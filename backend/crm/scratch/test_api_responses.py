import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from leads.models import Lead
from hotels.models import Booking
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory, force_authenticate
from leads.views import LeadViewSet
from hotels.views import BookingAdminViewSet

User = get_user_model()
admin = User.objects.get(username='admin')

factory = APIRequestFactory()

print("--- Testing LeadViewSet (admin) ---")
request = factory.get('/api/leads/')
force_authenticate(request, user=admin)
view = LeadViewSet.as_view({'get': 'list'})
response = view(request)
print(f"Status: {response.status_code}")
print(f"Data Count: {len(response.data) if response.status_code == 200 else 'N/A'}")
if response.status_code == 200:
    print(f"First Lead: {json.dumps(response.data[0], indent=2) if response.data else 'None'}")

print("\n--- Testing BookingAdminViewSet (admin) ---")
request = factory.get('/api/hotels/admin/bookings/')
force_authenticate(request, user=admin)
view = BookingAdminViewSet.as_view({'get': 'list'})
response = view(request)
print(f"Status: {response.status_code}")
print(f"Data Count: {len(response.data) if response.status_code == 200 else 'N/A'}")
if response.status_code == 200:
    print(f"First Booking: {json.dumps(response.data[0], indent=2) if response.data else 'None'}")
