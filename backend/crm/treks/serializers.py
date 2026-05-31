from rest_framework import serializers
from .models import Trek, Package, Booking, Review, Camp


class CampSerializer(serializers.ModelSerializer):
    class Meta:
        model = Camp
        fields = ['id', 'name', 'logo_url', 'description', 'experience_years', 'rating', 'specialty']


class PackageSerializer(serializers.ModelSerializer):
    package_type_display = serializers.CharField(source='get_package_type_display', read_only=True)
    camp_details = CampSerializer(source='camp', read_only=True)

    class Meta:
        model = Package
        fields = [
            'id', 'trek', 'camp', 'camp_details', 'package_type', 'package_type_display',
            'base_camp', 'route_plan',
            'price_per_person', 'max_trekkers',
            'inclusions', 'is_active',
        ]
        read_only_fields = ['inclusions']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'trek', 'booking', 'guest_name',
            'rating', 'title', 'comment', 'travel_type', 'created_at',
        ]
        read_only_fields = ['created_at']


class TrekListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing."""
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)

    amenities = serializers.JSONField(read_only=True)
    images = serializers.JSONField(read_only=True)
    route_plan = serializers.JSONField(read_only=True)

    class Meta:
        model = Trek
        fields = [
            'id', 'name', 'slug', 'region', 'base_camp',
            'difficulty', 'difficulty_display', 'duration_days', 'max_altitude',
            'amenities', 'images', 'route_plan', 'weather_info', 'best_season',
            'price_min', 'price_max', 'avg_rating',
            'total_reviews', 'is_featured', 'is_active',
        ]


class TrekDetailSerializer(serializers.ModelSerializer):
    """Full detail with packages and reviews."""
    rooms = PackageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    difficulty_display = serializers.CharField(source='get_difficulty_display', read_only=True)
    
    amenities = serializers.JSONField(read_only=True)
    images = serializers.JSONField(read_only=True)
    route_plan = serializers.JSONField(read_only=True)

    class Meta:
        model = Trek
        fields = [
            'id', 'name', 'slug', 'region', 'base_camp', 'description',
            'difficulty', 'difficulty_display', 'duration_days', 'max_altitude',
            'amenities', 'images', 'route_plan', 'weather_info', 'best_season',
            'price_min', 'price_max', 'avg_rating', 'total_reviews',
            'is_featured', 'is_active',
            'rooms', 'reviews', 'created_at',
        ]


class BookingSerializer(serializers.ModelSerializer):
    trek_name = serializers.CharField(source='trek.name', read_only=True)
    trek_region = serializers.CharField(source='trek.region', read_only=True)
    trek_image = serializers.SerializerMethodField()
    package_type = serializers.CharField(source='package.get_package_type_display', read_only=True)
    camp_name = serializers.CharField(source='package.camp.name', read_only=True, default='Unassigned')
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    invoice_details = serializers.SerializerMethodField()
    trek_city = serializers.CharField(source='trek.region', read_only=True)
    room_type = serializers.CharField(source='package.get_package_type_display', read_only=True)
    nights = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'booking_ref', 'user', 'trek', 'trek_name', 'trek_region', 'trek_image',
            'trek_city', 'room_type', 'nights',
            'package', 'package_type', 'camp_name',
            'guest_lead', 'guest_name', 'guest_email', 'guest_phone',
            'check_in', 'check_out', 'trekkers_count',
            'total_price',
            'status', 'status_display', 'payment_status', 'payment_display',
            'special_requests', 'created_at',
            'invoice_details',
        ]
        read_only_fields = [
            'booking_ref', 'total_price', 'created_at',
        ]

    def get_trek_image(self, obj):
        images = obj.trek.images
        return images[0] if images else ''

    def get_nights(self, obj):
        if obj.check_in and obj.check_out:
            return (obj.check_out - obj.check_in).days
        return 0

    def get_invoice_details(self, obj):
        from invoices.models import Invoice
        try:
            if obj.guest_lead:
                invoice = Invoice.objects.filter(quotation__customer=obj.guest_lead).first()
                if invoice:
                    return {
                        'id': invoice.id,
                        'invoice_no': f"INV-{str(invoice.id).zfill(4)}",
                        'subtotal': invoice.subtotal,
                        'gst_rate': invoice.gst_rate,
                        'gst_amount': invoice.gst_amount,
                        'total': invoice.total,
                        'status': invoice.status,
                        'created_at': invoice.created_at.strftime('%Y-%m-%d')
                    }
        except Exception:
            pass
        return None


class CreateBookingSerializer(serializers.Serializer):
    """Used for the public booking endpoint."""
    trek_id = serializers.IntegerField()
    room_id = serializers.IntegerField()
    guest_name = serializers.CharField(max_length=255)
    guest_email = serializers.EmailField()
    guest_phone = serializers.CharField(max_length=20, required=False, default='', allow_blank=True)
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    trekkers_count = serializers.IntegerField(default=1)
    special_requests = serializers.CharField(required=False, default='', allow_blank=True)
