import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from leads.models import Lead
from treks.models import Booking, Trek, Camp
from django.contrib.auth import get_user_model

User = get_user_model()

print(f"Total Users: {User.objects.count()}")
for u in User.objects.all():
    print(f" - {u.username} ({u.role})")

print(f"Total Leads: {Lead.objects.count()}")
print(f"Total Bookings: {Booking.objects.count()}")
print(f"Total Treks: {Trek.objects.count()}")
print(f"Total Camps: {Camp.objects.count()}")
