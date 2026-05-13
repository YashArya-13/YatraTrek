import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from hotels.models import Booking

print("--- Booking-Lead Linkage ---")
for b in Booking.objects.all():
    print(f"Booking: {b.booking_ref} | Lead: {b.guest_lead.name if b.guest_lead else 'NULL'} (ID: {b.guest_lead.id if b.guest_lead else 'N/A'})")
