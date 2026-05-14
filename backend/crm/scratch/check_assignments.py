import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from django.contrib.auth import get_user_model
from treks.models import Camp

User = get_user_model()

print("--- User-Camp Assignments ---")
for u in User.objects.filter(role='camp_leader'):
    print(f"User: {u.username} | Camp: {u.camp.name if u.camp else 'NONE'}")

print("\n--- All Camps ---")
for c in Camp.objects.all():
    print(f"Camp ID: {c.id} | Name: {c.name}")
