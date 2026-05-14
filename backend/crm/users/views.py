from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import User
from .serializers import UserSerializer
from .permissions import IsAdmin


class UserViewSet(ModelViewSet):
    """CRUD for users — admin only."""
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "username": user.username
        })

    return Response({"error": "Invalid credentials"}, status=401)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Return the currently authenticated user's info."""
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "role": request.user.role,
    })


@api_view(['POST'])
@permission_classes([AllowAny])
def register_camp_owner(request):
    """Register a new camp owner, create their camp, and set up a base trek."""
    data = request.data
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')
    camp_name = data.get('camp_name')
    base_camp = data.get('base_camp', '')
    route_details = data.get('route_details', 'Standard Route')
    subscription_plan = data.get('subscription_plan', 'basic')

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    from treks.models import Camp, Trek, Package
    
    # Create the Camp
    camp = Camp.objects.create(
        name=camp_name,
        description=f"Partner on {subscription_plan.capitalize()} Plan",
        specialty=route_details
    )

    # Create the User
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        role='camp_leader',
        camp=camp
    )

    # Optionally seed a starter Trek so their dashboard isn't completely empty
    trek = Trek.objects.create(
        name=f"{camp_name} Expedition",
        region=base_camp,
        base_camp=base_camp,
        description=f"Primary route: {route_details}",
        price_min=5000,
        price_max=15000
    )
    
    Package.objects.create(
        trek=trek,
        camp=camp,
        base_camp=base_camp,
        package_type='standard',
        price_per_person=5000,
        max_trekkers=15
    )

    refresh = RefreshToken.for_user(user)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "role": user.role,
        "username": user.username,
        "message": "Camp Owner registered successfully"
    }, status=201)
