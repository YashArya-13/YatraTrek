import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from hotels.models import Trek

print("TREK DATA CHECK:")
for t in Trek.objects.all()[:5]:
    print(f"ID: {t.id} | Name: {t.name}")
    print(f"Images: {json.dumps(t.images, indent=2)}")
    print("-" * 20)
