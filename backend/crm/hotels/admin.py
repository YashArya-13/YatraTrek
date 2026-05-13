from django.contrib import admin
from .models import Trek, Package, Booking, Review

@admin.register(Trek)
class TrekAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'difficulty', 'duration_days', 'avg_rating', 'is_featured']
    list_filter = ['region', 'difficulty', 'is_featured', 'is_active']
    search_fields = ['name', 'region']

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ['trek', 'package_type', 'price_per_person', 'max_trekkers', 'is_active']
    list_filter = ['package_type', 'is_active']

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_ref', 'trek', 'guest_name', 'check_in', 'check_out', 'status', 'total_price']
    list_filter = ['status', 'payment_status']
    search_fields = ['booking_ref', 'guest_name', 'guest_email']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['trek', 'guest_name', 'rating', 'created_at']
    list_filter = ['rating']
