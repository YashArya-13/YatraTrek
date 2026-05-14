import os
import django
import sys

# Setup django
sys.path.append('d:\\Yash projects\\crm_project\\backend\\crm')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from treks.models import Trek, Package

def seed():
    # Clear existing
    Trek.objects.all().delete()

    treks_data = [
        {
            "name": "Pindari Glacier Trek",
            "region": "Uttarakhand",
            "base_camp": "Khati Village",
            "description": "The Pindari Glacier is a glacier found in the upper reaches of the Kumaon Himalayas, to the southeast of Nanda Devi and Nanda Kot.",
            "difficulty": "moderate",
            "duration_days": 7,
            "max_altitude": 3660,
            "amenities": ["Guide", "Camping Gear", "All Meals", "Mules for Luggage"],
            "images": ["https://images.unsplash.com/photo-1596701062351-be5f8a42478f?w=1200", "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?w=1200"],
            "is_featured": True
        },
        {
            "name": "Valley of Flowers Expedition",
            "region": "Uttarakhand",
            "base_camp": "Govindghat",
            "description": "Valley of Flowers National Park is an Indian national park, located in North Chamoli and Pithoragarh, in the state of Uttarakhand and is known for its meadows of endemic alpine flowers.",
            "difficulty": "easy",
            "duration_days": 6,
            "max_altitude": 3858,
            "amenities": ["Expert Guide", "Hotel Stay in Ghangaria", "Permits", "First Aid"],
            "images": ["https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200", "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?w=1200"],
            "is_featured": True
        },
        {
            "name": "Auli (Olly) Ski & Trek",
            "region": "Uttarakhand",
            "base_camp": "Joshimath",
            "description": "Auli is a Himalayan ski resort and hill station in the north Indian state of Uttarakhand. It’s surrounded by coniferous and oak forests, plus the Nanda Devi and Nar Parvat mountains.",
            "difficulty": "easy",
            "duration_days": 4,
            "max_altitude": 3050,
            "amenities": ["Skiing Equipment", "Chairlift Pass", "Luxury Resort", "Heated Rooms"],
            "images": ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200"],
            "is_featured": False
        },
        {
            "name": "Char Dham Yatra Experience",
            "region": "Uttarakhand",
            "base_camp": "Haridwar",
            "description": "A spiritual journey through Yamunotri, Gangotri, Kedarnath, and Badrinath. Experience the soul of the Himalayas.",
            "difficulty": "moderate",
            "duration_days": 12,
            "max_altitude": 3583,
            "amenities": ["VIP Darshan", "Comfortable Transport", "Ashram Stays", "Veg Meals"],
            "images": ["https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200"],
            "is_featured": True
        },
        {
            "name": "Leh Ladakh Bike Expedition",
            "region": "Ladakh",
            "base_camp": "Leh",
            "description": "Ride through the highest motorable passes in the world. Khardung La, Pangong Tso, and Nubra Valley await.",
            "difficulty": "difficult",
            "duration_days": 10,
            "max_altitude": 5359,
            "amenities": ["Royal Enfield Himalayan", "Backup Vehicle", "Mechanic", "Oxygen Cylinders"],
            "images": ["https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200"],
            "is_featured": True
        },
        {
            "name": "Sandakphu Trek",
            "region": "Sikkim",
            "base_camp": "Darjeeling",
            "description": "See four of the five highest peaks in the world including Mt. Everest and Kanchenjunga from a single point.",
            "difficulty": "moderate",
            "duration_days": 7,
            "max_altitude": 3636,
            "amenities": ["Guide", "Tea House Stay", "Permits", "Transport from Bagdogra"],
            "images": ["https://images.unsplash.com/photo-1571401835393-8c5f35328320?w=1200"],
            "is_featured": False
        }
    ]

    for t_data in treks_data:
        trek = Trek.objects.create(**t_data)
        # Create standard and luxury packages
        Package.objects.create(
            trek=trek,
            package_type='standard',
            price_per_person=15000 + (trek.duration_days * 1000),
            max_trekkers=15,
            inclusions=["Stay", "Meals", "Guide"]
        )
        Package.objects.create(
            trek=trek,
            package_type='luxury',
            price_per_person=25000 + (trek.duration_days * 2000),
            max_trekkers=8,
            inclusions=["Luxury Stay", "Gourmet Meals", "Personal Guide", "Private Transport"]
        )
        trek.update_price_range()
    
    print(f"Successfully seeded {len(treks_data)} treks.")

if __name__ == "__main__":
    seed()
