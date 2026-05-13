import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from hotels.models import Booking

print("--- Booking Data ---")
for b in Booking.objects.all():
    print(f"Ref: {b.booking_ref} | Status: {b.status} | Payment: {b.payment_status} | Price: {b.total_price}")
