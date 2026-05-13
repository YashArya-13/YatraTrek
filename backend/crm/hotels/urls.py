from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('admin/camps', views.CampAdminViewSet, basename='admin-camps')
router.register('admin/hotels', views.HotelAdminViewSet, basename='admin-hotels')
router.register('admin/rooms', views.RoomAdminViewSet, basename='admin-rooms')
router.register('admin/bookings', views.BookingAdminViewSet, basename='admin-bookings')

urlpatterns = [
    # Public endpoints
    path('', views.hotel_list, name='hotel-list'),
    path('popular-cities/', views.popular_cities, name='popular-cities'),
    path('<int:pk>/', views.hotel_detail, name='hotel-detail'),
    path('<int:pk>/rooms/', views.hotel_rooms, name='hotel-rooms'),
    path('<int:pk>/reviews/', views.hotel_reviews, name='hotel-reviews'),
    path('packages/<int:pk>/', views.package_detail, name='package-detail'),

    # Booking endpoints
    path('book/', views.create_booking, name='create-booking'),
    path('booking/<str:ref>/', views.booking_detail, name='booking-detail'),
    path('booking/<str:ref>/cancel/', views.cancel_booking, name='cancel-booking'),

    # CRM Dashboard
    path('dashboard/', views.hotel_dashboard, name='hotel-dashboard'),

    # Admin CRUD
    path('', include(router.urls)),
]
