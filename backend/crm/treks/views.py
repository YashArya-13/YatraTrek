from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.db.models import Q, Count, Sum
from django.db.models.functions import TruncMonth

from .models import Trek, Package, Booking, Review, Camp
from .serializers import (
    TrekListSerializer, TrekDetailSerializer,
    PackageSerializer, BookingSerializer, CreateBookingSerializer,
    ReviewSerializer, CampSerializer,
)


# ── Public Trek APIs ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def hotel_list(request):
    """Public: search & list treks with filters."""
    qs = Trek.objects.filter(is_active=True)

    # Filters
    city = request.GET.get('city', '').strip()
    if city:
        qs = qs.filter(region__icontains=city)

    difficulty = request.GET.get('difficulty')
    if difficulty:
        qs = qs.filter(difficulty=difficulty)

    region = request.GET.get('region')
    if region:
        qs = qs.filter(region__icontains=region)

    # Sort
    sort = request.GET.get('sort', 'featured')
    if sort == 'price_low':
        qs = qs.order_by('price_min')
    elif sort == 'price_high':
        qs = qs.order_by('-price_min')
    elif sort == 'rating':
        qs = qs.order_by('-avg_rating')
    else:
        qs = qs.order_by('-is_featured', '-avg_rating')

    data = TrekListSerializer(qs, many=True).data

    return Response({
        'count': len(data),
        'results': data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def hotel_detail(request, pk):
    """Public: full trek detail with packages & reviews."""
    try:
        trek = Trek.objects.prefetch_related('rooms', 'reviews').get(pk=pk, is_active=True)
    except Trek.DoesNotExist:
        return Response({'error': 'Trek not found'}, status=404)

    data = TrekDetailSerializer(trek).data
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def hotel_rooms(request, pk):
    """Public: list packages for a trek."""
    packages = Package.objects.filter(trek_id=pk, is_active=True)
    data = PackageSerializer(packages, many=True).data
    return Response(data)


@api_view(['GET'])
@permission_classes([AllowAny])
def package_detail(request, pk):
    """Public: detail for a specific package."""
    try:
        package = Package.objects.get(pk=pk, is_active=True)
    except Package.DoesNotExist:
        return Response({'error': 'Package not found'}, status=404)

    return Response(PackageSerializer(package).data)


# ── Booking APIs ───────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([AllowAny])
def create_booking(request):
    """Public: create a trek booking."""
    serializer = CreateBookingSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)

    d = serializer.validated_data
    try:
        trek = Trek.objects.get(pk=d['trek_id']) 
        package = Package.objects.get(pk=d['room_id'], trek=trek)
    except (Trek.DoesNotExist, Package.DoesNotExist):
        return Response({'error': 'Invalid trek or package'}, status=400)

    # Create CRM Lead
    from leads.models import Lead
    lead, created = Lead.objects.get_or_create(
        email=d['guest_email'],
        defaults={
            'name': d['guest_name'],
            'phone': d.get('guest_phone', ''),
            'status': 'new',
            'notes': f"Trek booking — {trek.name}",
            'camp': package.camp,
        }
    )
    if not created and not lead.camp:
        lead.camp = package.camp
        lead.save()

    # Create booking
    booking = Booking(
        trek=trek,
        package=package,
        guest_lead=lead,
        guest_name=d['guest_name'],
        guest_email=d['guest_email'],
        guest_phone=d.get('guest_phone', ''),
        check_in=d['check_in'],
        check_out=d['check_out'],
        trekkers_count=d.get('trekkers_count', 1),
        special_requests=d.get('special_requests', ''),
        status='confirmed',
        payment_status='paid',
    )
    booking.save()

    return Response(BookingSerializer(booking).data, status=201)


@api_view(['GET'])
@permission_classes([AllowAny])
def booking_detail(request, ref):
    try:
        booking = Booking.objects.get(booking_ref=ref)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)
    return Response(BookingSerializer(booking).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def cancel_booking(request, ref):
    try:
        booking = Booking.objects.get(booking_ref=ref)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=404)

    if booking.status in ['on_trek', 'completed']:
        return Response({'error': 'Cannot cancel trek already in progress'}, status=400)

    booking.status = 'cancelled'
    booking.payment_status = 'refunded'
    booking.save()
    return Response(BookingSerializer(booking).data)


# ── Reviews ────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([AllowAny])
def hotel_reviews(request, pk):
    if request.method == 'GET':
        reviews = Review.objects.filter(trek_id=pk)
        return Response(ReviewSerializer(reviews, many=True).data)

    data = request.data.copy()
    data['trek'] = pk
    serializer = ReviewSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ── Admin / CRM APIs ──────────────────────────────────────────────

class CampAdminViewSet(ModelViewSet):
    queryset = Camp.objects.all()
    serializer_class = CampSerializer
    permission_classes = [IsAuthenticated]


class HotelAdminViewSet(ModelViewSet):
    queryset = Trek.objects.all()
    serializer_class = TrekDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'camp_leader' and user.camp:
            # Camp leaders only see treks they have packages for
            return Trek.objects.filter(rooms__camp=user.camp).distinct()
        return Trek.objects.all()


class RoomAdminViewSet(ModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'camp_leader' and user.camp:
            return Package.objects.filter(camp=user.camp)
        return Package.objects.all()


class BookingAdminViewSet(ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Booking.objects.all().order_by('-created_at')
        
        if user.role == 'camp_leader' and user.camp:
            # Camp leaders only see bookings for their own camp
            return qs.filter(package__camp=user.camp)
        
        # Admin/Managers see everything
        return qs

    @action(detail=True, methods=['post'], url_path='update_status')
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        if new_status in dict(Booking.STATUS_CHOICES):
            booking.status = new_status
            booking.save()
            return Response(BookingSerializer(booking).data)
        return Response({'error': 'Invalid status'}, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hotel_dashboard(request):
    """Adventure CRM dashboard stats."""
    user = request.user
    
    # Filter base querysets by camp if user is camp_leader
    treks_qs = Trek.objects.filter(is_active=True)
    packages_qs = Package.objects.filter(is_active=True)
    bookings_qs = Booking.objects.all()
    
    if user.role == 'camp_leader' and user.camp:
        treks_qs = treks_qs.filter(rooms__camp=user.camp).distinct()
        packages_qs = packages_qs.filter(camp=user.camp)
        bookings_qs = bookings_qs.filter(package__camp=user.camp)

    total_treks = treks_qs.count()
    total_packages = packages_qs.count()
    total_bookings = bookings_qs.count()
    
    total_revenue = bookings_qs.filter(
        payment_status='paid'
    ).aggregate(Sum('total_price'))['total_price__sum'] or 0

    active_bookings = bookings_qs.filter(status='confirmed').count()
    on_trek = bookings_qs.filter(status='on_trek').count()
    cancelled = bookings_qs.filter(status='cancelled').count()

    # Revenue by month
    revenue_trend = (
        bookings_qs.filter(payment_status='paid')
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(total=Sum('total_price'), count=Count('id'))
        .order_by('month')
    )
    revenue_chart = [{
        'name': entry['month'].strftime('%b'),
        'revenue': entry['total'],
        'bookings': entry['count'],
    } for entry in revenue_trend]

    # Status distribution
    status_dist = []
    for s, label in Booking.STATUS_CHOICES:
        count = bookings_qs.filter(status=s).count()
        if count:
            status_dist.append({'name': label, 'value': count})

    # Top treks
    if user.role == 'camp_leader' and user.camp:
        top_treks = (
            treks_qs.annotate(booking_count=Count('bookings', filter=Q(bookings__package__camp=user.camp)))
            .order_by('-booking_count')[:5]
        )
    else:
        top_treks = (
            treks_qs.annotate(booking_count=Count('bookings'))
            .order_by('-booking_count')[:5]
        )
    top_treks_data = [{
        'name': h.name,
        'region': h.region,
        'bookings': h.booking_count,
        'rating': h.avg_rating,
    } for h in top_treks]

    recent = bookings_qs.order_by('-created_at')[:8]
    recent_data = BookingSerializer(recent, many=True).data

    return Response({
        'stats': {
            'total_treks': total_treks,
            'total_rooms': total_packages,
            'total_bookings': total_bookings,
            'total_revenue': total_revenue,
            'active_bookings': active_bookings,
            'checked_in': on_trek,
            'cancelled': cancelled,
            'occupancy': round((on_trek / max(total_treks * 10, 1)) * 100, 1), # Dummy calculation
        },
        'revenueChart': revenue_chart if revenue_chart else [{'name': 'No Data', 'revenue': 0, 'bookings': 0}],
        'statusDistribution': status_dist,
        'topTreks': top_treks_data,
        'recentBookings': recent_data,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def popular_cities(request):
    """Return trekking regions with counts."""
    regions = (
        Trek.objects.filter(is_active=True)
        .values('region')
        .annotate(count=Count('id'))
        .order_by('-count')[:8]
    )
    region_images = {
        'Uttarakhand': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
        'Ladakh': 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=800',
        'Himachal': 'https://images.unsplash.com/photo-1597074866923-dc0589150358?w=800',
        'Sikkim': 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=800',
        'Kashmir': 'https://images.unsplash.com/photo-1598324425714-3b2383842d63?w=800',
    }
    data = []
    for r in regions:
        data.append({
            'city': r['region'],
            'count': r['count'],
            'image': region_images.get(r['region'], 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'),
        })
    return Response(data)
