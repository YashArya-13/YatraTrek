import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from users.models import User
from treks.models import Camp

count = 0
for camp in Camp.objects.all():
    if not User.objects.filter(camp=camp).exists():
        username = f"{camp.name.lower().replace(' ', '_')}_admin"
        email = f"admin@{camp.name.lower().replace(' ', '')}.com"
        print(f"Creating user {username} for camp {camp.name}")
        User.objects.create_user(
            username=username,
            email=email,
            password='password123',
            role='camp_leader',
            camp=camp
        )
        count += 1

print(f"Created {count} camp owners.")
