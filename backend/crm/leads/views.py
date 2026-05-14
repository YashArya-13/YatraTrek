from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Lead, Activity
from .serializers import LeadSerializer, ActivitySerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def public_create_lead(request):
    """Public endpoint for marketing website leads."""
    serializer = LeadSerializer(data=request.data)
    if serializer.is_valid():
        # Assign to a default admin or leave unassigned
        from django.contrib.auth import get_user_model
        User = get_user_model()
        admin = User.objects.filter(role='admin').first()
        serializer.save(assigned_to=admin, status='new')
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

class LeadViewSet(ModelViewSet):
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Admins and Managers see all leads
        if user.role in ['admin', 'manager']:
            return Lead.objects.all().order_by('-created_at')
        
        # Camp leaders only see leads for their camp
        if user.role == 'camp_leader' and user.camp:
            return Lead.objects.filter(camp=user.camp).order_by('-created_at')
            
        # Sales users only see leads assigned to them
        return Lead.objects.filter(assigned_to=user).order_by('-created_at')

    def perform_create(self, serializer):
        # Auto-assign newly created leads to the creator
        serializer.save(assigned_to=self.request.user)

    @action(detail=True, methods=['post'])
    def add_activity(self, request, pk=None):
        lead = self.get_object()
        serializer = ActivitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user, lead=lead)
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
