import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crm.settings')
django.setup()

from hotels.models import Trek, Package, Camp

MOUNTAIN_IMAGES = [
    "/assets/treks/pindari.png",
    "/assets/treks/valley.png",
    "/assets/treks/kedarkantha.png",
    "/assets/treks/view1.png",
    "/assets/treks/view2.png",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1520113526768-ca4051fa781e?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1519904981063-b0144230c28e?auto=format&fit=crop&q=80&w=1200",
]

def seed_treks():
    Trek.objects.all().delete()
    Camp.objects.all().delete()
    
    # Create Camps
    CAMPS_DATA = [
        {"name": "Himalayan Explorers", "specialty": "Elite Mountaineering", "rating": 4.9},
        {"name": "Trek The Himalayas", "specialty": "Professional Expeditions", "rating": 4.8},
        {"name": "IndiaHikes", "specialty": "Educational Trekking", "rating": 4.7},
        {"name": "Bikat Adventures", "specialty": "Technical Trails", "rating": 4.8},
        {"name": "Altitude Adventure", "specialty": "Luxury Camping", "rating": 4.9},
    ]
    
    camps = []
    for c in CAMPS_DATA:
        camp = Camp.objects.create(
            name=c["name"],
            specialty=c["specialty"],
            rating=c["rating"],
            experience_years=random.randint(10, 25),
            description=f"Leading expeditions since {2026 - random.randint(10,25)}. Certified IFMGA/UIAGM leadership."
        )
        camps.append(camp)

    TREKS = [
        # Uttarakhand
        {
            "name": "Pindari Glacier Expedition",
            "region": "Uttarakhand",
            "base_camp": "Loharkhet",
            "description": "A classic trek in the Kumaon region, leading to the source of the Pindar River. High altitude glaciers and rugged terrain.",
            "difficulty": "difficult",
            "duration_days": 7,
            "max_altitude": 3660,
            "best_season": "April - June, Sept - Oct",
            "weather": {"temp": "-5°C to 15°C", "condition": "Partly Cloudy", "humidity": "60%"},
            "amenities": ["Certified Guide", "High Altitude Tents", "Oxygen Cylinders", "All Meals"],
            "images": [MOUNTAIN_IMAGES[0], MOUNTAIN_IMAGES[3], MOUNTAIN_IMAGES[4]],
            "route_plan": [
                {"day": 1, "title": "Loharkhet to Dhakuri", "desc": "11km trek through dense forest."},
                {"day": 2, "title": "Dhakuri to Khati", "desc": "Gentle descent followed by a riverside walk."},
                {"day": 3, "title": "Khati to Dwali", "desc": "Ascent through bamboo groves and waterfalls."},
                {"day": 4, "title": "Dwali to Phurkia", "desc": "Steep climb towards the final camp."},
                {"day": 5, "title": "Phurkia to Zero Point", "desc": "The final push to the glacier snout."},
                {"day": 6, "title": "Return to Dwali", "desc": "Descent back to Dwali camp."},
                {"day": 7, "title": "Back to Loharkhet", "desc": "End of expedition."}
            ]
        },
        {
            "name": "Valley of Flowers & Hemkund Sahib",
            "region": "Uttarakhand",
            "base_camp": "Govindghat",
            "description": "A UNESCO World Heritage site known for its meadows of endemic alpine flowers and variety of flora.",
            "difficulty": "moderate",
            "duration_days": 6,
            "max_altitude": 4329,
            "best_season": "July - August",
            "weather": {"temp": "7°C to 18°C", "condition": "Misty/Rainy", "humidity": "85%"},
            "amenities": ["Luxury Camping", "Flower Expert Guide", "Pony Support", "Kitchen Team"],
            "images": [MOUNTAIN_IMAGES[1], MOUNTAIN_IMAGES[5], MOUNTAIN_IMAGES[6]],
            "route_plan": [
                {"day": 1, "title": "Govindghat to Ghangaria", "desc": "13km trek alongside the Lakshman Ganga river."},
                {"day": 2, "title": "Explore Valley of Flowers", "desc": "Spend the day amidst thousands of blooming flowers."},
                {"day": 3, "title": "Ghangaria to Hemkund Sahib", "desc": "Steep 6km ascent to the holy lake at 14,000ft."},
                {"day": 4, "title": "Valley Second Entry", "desc": "Further exploration of the valley's inner reaches."},
                {"day": 5, "title": "Ghangaria to Govindghat", "desc": "Return trek down to the base."},
                {"day": 6, "title": "Departure", "desc": "Drive back to Rishikesh."}
            ]
        },
        {
            "name": "Kedarkantha Winter Peak",
            "region": "Uttarakhand",
            "base_camp": "Sankri",
            "description": "One of the best winter treks in India, offering 360-degree views of Himalayan peaks.",
            "difficulty": "easy",
            "duration_days": 6,
            "max_altitude": 3800,
            "best_season": "December - February",
            "weather": {"temp": "-10°C to 8°C", "condition": "Snowy", "humidity": "50%"},
            "amenities": ["Snow Gear", "Gaiters & Spikes", "Warm Meals", "First Aid"],
            "images": [MOUNTAIN_IMAGES[2], MOUNTAIN_IMAGES[7], MOUNTAIN_IMAGES[8]],
            "route_plan": [
                {"day": 1, "title": "Drive to Sankri", "desc": "Scenic 8-hour drive from Dehradun."},
                {"day": 2, "title": "Sankri to Juda-ka-Talab", "desc": "Trek through pine forests to a frozen lake."},
                {"day": 3, "title": "Juda-ka-Talab to Base Camp", "desc": "Ascent to the open meadows below the peak."},
                {"day": 4, "title": "Summit Day", "desc": "Early morning push to the summit for sunrise."},
                {"day": 5, "title": "Base Camp to Hargaon", "desc": "Descent through beautiful clearings."},
                {"day": 6, "title": "Sankri to Dehradun", "desc": "Return journey."}
            ]
        },
        {
            "name": "Har Ki Dun Valley",
            "region": "Uttarakhand",
            "base_camp": "Sankri",
            "description": "A cradle-shaped valley set in the heart of Govind Pashu Vihar National Park.",
            "difficulty": "moderate",
            "duration_days": 7,
            "max_altitude": 3566,
            "amenities": ["Camping Equipment", "Expert Guide", "Mule Support"],
            "images": [MOUNTAIN_IMAGES[6], MOUNTAIN_IMAGES[7]],
            "route_plan": [
                {"day": 1, "title": "Sankri to Taluka", "desc": "Drive and short trek to Taluka village."},
                {"day": 2, "title": "Taluka to Osla", "desc": "Trek through ancient wooden villages."},
                {"day": 3, "title": "Osla to Har Ki Dun", "desc": "Reach the beautiful valley floor."},
                {"day": 4, "title": "Explore Maninda Tal", "desc": "Side trek to a high-altitude lake."},
                {"day": 5, "title": "Return to Osla", "desc": "Start the descent back."},
                {"day": 6, "title": "Osla to Sankri", "desc": "Full day trek back to base."},
                {"day": 7, "title": "Drive back", "desc": "End of journey."}
            ]
        },
        {
            "name": "Roopkund Skeleton Lake",
            "region": "Uttarakhand",
            "base_camp": "Lohajung",
            "description": "A mystery lake that remains frozen for most of the year, famous for human skeletons found at its bottom.",
            "difficulty": "difficult",
            "duration_days": 8,
            "max_altitude": 5029,
            "amenities": ["High Altitude Kit", "Medical Support", "Porters"],
            "images": [MOUNTAIN_IMAGES[8], MOUNTAIN_IMAGES[9]],
            "route_plan": [
                {"day": 1, "title": "Lohajung to Didina", "desc": "Pass through oak and rhododendron forests."},
                {"day": 2, "title": "Didina to Ali Bugyal", "desc": "Climb to the largest high altitude meadows in Asia."},
                {"day": 3, "title": "Ali to Patar Nachauni", "desc": "Walk on the ridge with massive peak views."},
                {"day": 4, "title": "Patar to Bhagwabasa", "desc": "Steep climb to the snowline camp."},
                {"day": 5, "title": "Roopkund Summit", "desc": "Push to the lake and Junargali pass."},
                {"day": 6, "title": "Descent to Bedni Bugyal", "desc": "Long descent back to meadows."},
                {"day": 7, "title": "Bedni to Wan", "desc": "Walk through Neel Ganga river."},
                {"day": 8, "title": "Drive to Rishikesh", "desc": "Departure."}
            ]
        },
        # Himachal
        {
            "name": "Hampta Pass Crossing",
            "region": "Himachal",
            "base_camp": "Manali",
            "description": "A dramatic trek that starts in the lush green Kullu valley and ends in the desert landscape of Spiti.",
            "difficulty": "moderate",
            "duration_days": 5,
            "max_altitude": 4270,
            "amenities": ["Transport to Spiti", "Tents", "Guide"],
            "images": [MOUNTAIN_IMAGES[10], MOUNTAIN_IMAGES[11]],
            "route_plan": [
                {"day": 1, "title": "Jobra to Jwara", "desc": "Forest trek with river crossings."},
                {"day": 2, "title": "Jwara to Balu Ka Ghera", "desc": "Ascent to the sand beds."},
                {"day": 3, "title": "Pass Crossing", "desc": "The big day across Hampta Pass to Shea Goru."},
                {"day": 4, "title": "Shea Goru to Chatru", "desc": "Descent to the road-head and drive to Chandratal."},
                {"day": 5, "title": "Drive to Manali", "desc": "Via Rohtang Pass."}
            ]
        },
        {
            "name": "Beas Kund Trek",
            "region": "Himachal",
            "base_camp": "Solang Valley",
            "description": "A short trek leading to the source of the Beas River, surrounded by Hanuman Tibba and Seven Sisters.",
            "difficulty": "easy",
            "duration_days": 3,
            "max_altitude": 3700,
            "amenities": ["Guide", "Meals", "Gear"],
            "images": [MOUNTAIN_IMAGES[0], MOUNTAIN_IMAGES[1]],
            "route_plan": [
                {"day": 1, "title": "Solang to Bakarthach", "desc": "Walk through deodar forests to alpine camps."},
                {"day": 2, "title": "Bakarthach to Beas Kund", "desc": "Visit the glacial lake and return."},
                {"day": 3, "title": "Return to Solang", "desc": "Back to Manali."}
            ]
        },
        {
            "name": "Bhrigu Lake Trail",
            "region": "Himachal",
            "base_camp": "Gulaba",
            "description": "A high-altitude glacial lake trek near Manali, offering stunning views of the Pir Panjal range.",
            "difficulty": "moderate",
            "duration_days": 4,
            "max_altitude": 4270,
            "amenities": ["Tents", "Meals", "Oxygen"],
            "images": [MOUNTAIN_IMAGES[2], MOUNTAIN_IMAGES[3]],
            "route_plan": [
                {"day": 1, "title": "Gulaba to Rohli Kheli", "desc": "Ascent through steep meadows."},
                {"day": 2, "title": "Rohli Kheli to Bhrigu Lake", "desc": "The holy lake visit and back."},
                {"day": 3, "title": "Descent to Vashisht", "desc": "Long downhill trek to hot springs."},
                {"day": 4, "title": "Manali Departure", "desc": "End of trek."}
            ]
        },
        {
            "name": "Pin Parvati Pass Expedition",
            "region": "Himachal",
            "base_camp": "Barsheni",
            "description": "One of the most challenging and remote treks in Himachal, connecting Parvati Valley to Pin Valley.",
            "difficulty": "expert",
            "duration_days": 11,
            "max_altitude": 5319,
            "amenities": ["Expert Team", "High Altitude Food", "Porter Support"],
            "images": [MOUNTAIN_IMAGES[4], MOUNTAIN_IMAGES[5]],
            "route_plan": [
                {"day": 1, "title": "Barsheni to Kheerganga", "desc": "Gentle walk to the famous hot springs."},
                {"day": 2, "title": "Kheerganga to Tunda Bhuj", "desc": "Trek through pine forests and birch trees."},
                {"day": 3, "title": "Tunda Bhuj to Thakur Kuan", "desc": "Rocky terrain and river crossings."},
                {"day": 4, "title": "Thakur Kuan to Odi Thach", "desc": "High altitude meadows."},
                {"day": 5, "title": "Odi Thach to Mantalai Lake", "desc": "Reach the source of Parvati river."},
                {"day": 6, "title": "Acclimatization Day", "desc": "Rest at Mantalai."},
                {"day": 7, "title": "Mantalai to Base Camp", "desc": "Moraine and glacier walk."},
                {"day": 8, "title": "Summit Day", "desc": "Crossing the Pin Parvati Pass."},
                {"day": 9, "title": "Descent to Wichkurung", "desc": "Spiti side descent."},
                {"day": 10, "title": "Wichkurung to Mudh", "desc": "Enter the beautiful Mudh village."},
                {"day": 11, "title": "Drive to Kaza", "desc": "End of expedition."}
            ]
        },
        {
            "name": "Kuari Pass Lord Curzon Trail",
            "region": "Uttarakhand",
            "base_camp": "Joshimath",
            "description": "Best mountain views trek, showcasing Nanda Devi, Dronagiri, and Kamet.",
            "difficulty": "moderate",
            "duration_days": 6,
            "max_altitude": 3876,
            "amenities": ["Binoculars", "Guide", "Tents"],
            "images": [MOUNTAIN_IMAGES[6], MOUNTAIN_IMAGES[7]],
            "route_plan": [
                {"day": 1, "title": "Joshimath to Chitrakantha", "desc": "Ascent through oak forest."},
                {"day": 2, "title": "Chitrakantha to Tali Top", "desc": "Alpine meadows walk."},
                {"day": 3, "title": "Kuari Pass Crossing", "desc": "The grand mountain views day."},
                {"day": 4, "title": "Tali to Auli", "desc": "Downhill towards the ski resort."},
                {"day": 5, "title": "Rest Day", "desc": "Explore Auli."},
                {"day": 6, "title": "Drive to Haridwar", "desc": "Departure."}
            ]
        },
        {
            "name": "Chopta Chandrashila Summit",
            "region": "Uttarakhand",
            "base_camp": "Chopta",
            "description": "The 'Mini Switzerland' of India, trek to Tungnath (highest Shiva temple) and Chandrashila peak.",
            "difficulty": "easy",
            "duration_days": 4,
            "max_altitude": 3690,
            "amenities": ["Guide", "Meals", "Gear"],
            "images": [MOUNTAIN_IMAGES[8], MOUNTAIN_IMAGES[9]],
            "route_plan": [
                {"day": 1, "title": "Drive to Chopta", "desc": "Beautiful drive from Rishikesh."},
                {"day": 2, "title": "Trek to Tungnath", "desc": "Paved path to the ancient temple."},
                {"day": 3, "title": "Chandrashila Summit", "desc": "Panoramic 360-degree views."},
                {"day": 4, "title": "Drive back", "desc": "Return to Rishikesh."}
            ]
        },
        {
            "name": "Brahmatal Winter Trek",
            "region": "Uttarakhand",
            "base_camp": "Lohajung",
            "description": "A secluded winter trek with views of Mt. Trishul and Mt. Nanda Ghunti.",
            "difficulty": "moderate",
            "duration_days": 6,
            "max_altitude": 3733,
            "amenities": ["Snow Spikes", "Warm Drinks", "Expert Team"],
            "images": [MOUNTAIN_IMAGES[10], MOUNTAIN_IMAGES[11]],
            "route_plan": [
                {"day": 1, "title": "Lohajung to Bekaltal", "desc": "Walk to the dark forest lake."},
                {"day": 2, "title": "Bekaltal to Brahmatal", "desc": "Trek on the ridge with massive views."},
                {"day": 3, "title": "Summit Day", "desc": "Visit Brahmatal top and frozen lake."},
                {"day": 4, "title": "Descent to Tilandi", "desc": "Stay in beautiful clearings."},
                {"day": 5, "title": "Tilandi to Lohajung", "desc": "Return to base."},
                {"day": 6, "title": "Departure", "desc": "Drive back."}
            ]
        },
        {
            "name": "Dayara Bugyal",
            "region": "Uttarakhand",
            "base_camp": "Raithal",
            "description": "Asia's most beautiful alpine meadows, perfect for first-timers.",
            "difficulty": "easy",
            "duration_days": 5,
            "max_altitude": 3650,
            "amenities": ["Guide", "Tents", "Mule Support"],
            "images": [MOUNTAIN_IMAGES[0], MOUNTAIN_IMAGES[1]],
            "route_plan": [
                {"day": 1, "title": "Raithal to Gui", "desc": "Short trek to forest clearing."},
                {"day": 2, "title": "Gui to Chilapada", "desc": "Ascent towards the meadows."},
                {"day": 3, "title": "Explore Dayara Bugyal", "desc": "Full day in the vast meadows."},
                {"day": 4, "title": "Descent to Raithal", "desc": "Return trek."},
                {"day": 5, "title": "Departure", "desc": "Drive back to Dehradun."}
            ]
        },
        {
            "name": "Bali Pass Expedition",
            "region": "Uttarakhand",
            "base_camp": "Sankri",
            "description": "A high-altitude pass connecting Yamunotri and Har Ki Dun valley.",
            "difficulty": "expert",
            "duration_days": 9,
            "max_altitude": 4950,
            "amenities": ["Expert Guides", "Technical Gear", "Medical Kit"],
            "images": [MOUNTAIN_IMAGES[2], MOUNTAIN_IMAGES[3]],
            "route_plan": [
                {"day": 1, "title": "Sankri to Taluka", "desc": "Start of the expedition."},
                {"day": 2, "title": "Taluka to Seema", "desc": "Riverside trail."},
                {"day": 3, "title": "Seema to Rainbasera", "desc": "Enter the wild valley."},
                {"day": 4, "title": "Rainbasera to Odari", "desc": "Glacier approach."},
                {"day": 5, "title": "Odari to Base Camp", "desc": "The cold moraine camp."},
                {"day": 6, "title": "Pass Crossing", "desc": "Technical crossing to Yamunotri side."},
                {"day": 7, "title": "Descent to Damni", "desc": "Steep downhill."},
                {"day": 8, "title": "Yamunotri to Janki Chatti", "desc": "End of trek."},
                {"day": 9, "title": "Departure", "desc": "Return drive."}
            ]
        },
        {
            "name": "Gaumukh Tapovan",
            "region": "Uttarakhand",
            "base_camp": "Gangotri",
            "description": "A holy trail to the source of the Ganges and the spiritual meadows of Tapovan.",
            "difficulty": "difficult",
            "duration_days": 6,
            "max_altitude": 4463,
            "amenities": ["Permits", "Guide", "Tents"],
            "images": [MOUNTAIN_IMAGES[4], MOUNTAIN_IMAGES[5]],
            "route_plan": [
                {"day": 1, "title": "Gangotri to Chirbasa", "desc": "Entrance to Gangotri National Park."},
                {"day": 2, "title": "Chirbasa to Bhojbasa", "desc": "Walk alongside the Bhagirathi river."},
                {"day": 3, "title": "Gaumukh \u0026 Tapovan", "desc": "Visit the glacier snout and climb to Tapovan."},
                {"day": 4, "title": "Rest in Tapovan", "desc": "Meditative day under Mt. Shivling."},
                {"day": 5, "title": "Tapovan to Bhojbasa", "desc": "Start return descent."},
                {"day": 6, "title": "Return to Gangotri", "desc": "End of trek."}
            ]
        },
        {
            "name": "Sar Pass Trail",
            "region": "Himachal",
            "base_camp": "Kasol",
            "description": "A popular trek in Parvati valley crossing a high altitude 'Sar' (Lake) pass.",
            "difficulty": "moderate",
            "duration_days": 6,
            "max_altitude": 4220,
            "amenities": ["Guide", "Meals", "Gear"],
            "images": [MOUNTAIN_IMAGES[6], MOUNTAIN_IMAGES[7]],
            "route_plan": [
                {"day": 1, "title": "Kasol to Grahan", "desc": "Visit the beautiful traditional village."},
                {"day": 2, "title": "Grahan to Min Thach", "desc": "Ascent to alpine meadows."},
                {"day": 3, "title": "Min Thach to Nagaru", "desc": "Steep climb to the snowline camp."},
                {"day": 4, "title": "Pass Crossing", "desc": "The famous snow-slide from the pass top."},
                {"day": 5, "title": "Biskeri to Barshaini", "desc": "Return to Parvati valley."},
                {"day": 6, "title": "Departure", "desc": "Back to Kasol."}
            ]
        },
        {
            "name": "Friendship Peak",
            "region": "Himachal",
            "base_camp": "Solang Valley",
            "description": "An introductory peak climbing expedition for aspiring mountaineers.",
            "difficulty": "expert",
            "duration_days": 8,
            "max_altitude": 5289,
            "amenities": ["Mountaineering Gear", "Technical Lead", "Summit Meals"],
            "images": [MOUNTAIN_IMAGES[8], MOUNTAIN_IMAGES[9]],
            "route_plan": [
                {"day": 1, "title": "Base Camp to Advance Base", "desc": "Gear up and move up."},
                {"day": 2, "title": "Technical Training", "desc": "Learn use of ice-axe and ropes."},
                {"day": 3, "title": "Summit Attempt", "desc": "Midnight start for the summit."},
                {"day": 4, "title": "Reserve Day", "desc": "For bad weather."},
                {"day": 5, "title": "Return to Manali", "desc": "Celebration dinner."}
            ]
        },
        {
            "name": "Kheerganga Hot Springs",
            "region": "Himachal",
            "base_camp": "Barshaini",
            "description": "A mystical trail in Parvati valley leading to natural sulphur hot springs.",
            "difficulty": "easy",
            "duration_days": 2,
            "max_altitude": 2960,
            "amenities": ["Camping", "Cafe Access", "Guide"],
            "images": [MOUNTAIN_IMAGES[10], MOUNTAIN_IMAGES[11]],
            "route_plan": [
                {"day": 1, "title": "Barshaini to Kheerganga", "desc": "Trek through waterfalls and forests."},
                {"day": 2, "title": "Hot Spring Bath \u0026 Return", "desc": "Relax and head back."}
            ]
        },
        {
            "name": "Triund Hill Ridge",
            "region": "Himachal",
            "base_camp": "McLeod Ganj",
            "description": "The crown jewel of Dharamshala, offering views of the Dhauladhar range.",
            "difficulty": "easy",
            "duration_days": 2,
            "max_altitude": 2850,
            "amenities": ["Night Camping", "Sunrise Hike", "Guide"],
            "images": [MOUNTAIN_IMAGES[0], MOUNTAIN_IMAGES[1]],
            "route_plan": [
                {"day": 1, "title": "McLeod Ganj to Triund Top", "desc": "Steady ascent with cafe stops."},
                {"day": 2, "title": "Descent to Dharamkot", "desc": "Via Galu temple."}
            ]
        },
        {
            "name": "Indrahar Pass",
            "region": "Himachal",
            "base_camp": "McLeod Ganj",
            "description": "A high-altitude pass crossing the mighty Dhauladhar range into Chamba valley.",
            "difficulty": "difficult",
            "duration_days": 4,
            "max_altitude": 4342,
            "amenities": ["Guide", "Equipment", "Meals"],
            "images": [MOUNTAIN_IMAGES[2], MOUNTAIN_IMAGES[3]],
            "route_plan": [
                {"day": 1, "title": "McLeod Ganj to Triund", "desc": "First leg of the journey."},
                {"day": 2, "title": "Triund to Lahesh Cave", "desc": "Rock shelter camp."},
                {"day": 3, "title": "Pass Crossing \u0026 Return", "desc": "Technical climb to the pass top."},
                {"day": 4, "title": "Back to McLeod Ganj", "desc": "Long descent."}
            ]
        }
    ]

    for t_data in TREKS:
        trek = Trek.objects.create(
            name=t_data["name"],
            region=t_data["region"],
            base_camp=t_data["base_camp"],
            description=t_data["description"],
            difficulty=t_data["difficulty"],
            duration_days=t_data["duration_days"],
            max_altitude=t_data["max_altitude"],
            best_season=t_data.get("best_season", "April - June"),
            weather_info=t_data.get("weather", {"temp": "12°C", "condition": "Sunny", "humidity": "40%"}),
            amenities=t_data["amenities"],
            images=t_data.get("images", []),
            route_plan=t_data.get("route_plan", []),
            is_featured=random.choice([True, False]),
            avg_rating=round(random.uniform(4.2, 5.0), 1),
            total_reviews=random.randint(50, 500)
        )
        
        # Add packages from different camps
        selected_camps = random.sample(camps, k=random.randint(2, 4))
        for camp in selected_camps:
            # Vary the route slightly for each camp to show difference
            camp_route = []
            for day in t_data.get("route_plan", []):
                # Add camp specific note to first and last day
                if day["day"] == 1:
                    day_copy = day.copy()
                    day_copy["desc"] = f"[{camp.name} Style] " + day_copy["desc"]
                    camp_route.append(day_copy)
                else:
                    camp_route.append(day)

            # Standard package for this camp
            Package.objects.create(
                trek=trek,
                camp=camp,
                package_type='standard',
                base_camp=t_data["base_camp"],
                route_plan=camp_route,
                price_per_person=random.randint(8000, 15000),
                max_trekkers=20,
                inclusions=["Camp Stay", "Guide", "Local Meals", "Permits"]
            )
            # Occasional luxury package for this camp
            if random.random() > 0.6:
                luxury_route = [d.copy() for d in camp_route]
                luxury_route[0]["desc"] = "Luxury pickup and " + luxury_route[0]["desc"]
                
                Package.objects.create(
                    trek=trek,
                    camp=camp,
                    package_type='luxury',
                    base_camp=t_data["base_camp"],
                    route_plan=luxury_route,
                    price_per_person=random.randint(18000, 30000),
                    max_trekkers=8,
                    inclusions=["Swiss Tents", "Elite Guide", "Buffet", "Equipment Kit"]
                )
        
        trek.update_price_range()
        print(f"Seeded: {trek.name} with multiple camp options.")

if __name__ == '__main__':
    seed_treks()
