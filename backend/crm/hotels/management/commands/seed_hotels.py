import random
from django.core.management.base import BaseCommand
from hotels.models import Hotel, Room, Review


HOTELS_DATA = [
    {
        'name': 'The Grand Palazzo',
        'city': 'Mumbai',
        'address': 'Marine Drive, South Mumbai, Maharashtra 400002',
        'description': 'Experience unmatched luxury at The Grand Palazzo, Mumbai\'s finest waterfront hotel. Overlooking the Arabian Sea and the iconic Marine Drive, this 5-star property features world-class dining, a rooftop infinity pool, and the city\'s most prestigious spa. Perfect for both business travelers and those seeking an unforgettable Mumbai experience.',
        'star_rating': 5,
        'amenities': ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Room Service', 'Valet Parking', 'Business Center', 'Concierge'],
        'images': [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
        ],
        'latitude': 18.9437, 'longitude': 72.8235,
        'is_featured': True,
        'rooms': [
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 8500, 'max_guests': 2, 'total': 30, 'size': 400, 'amenities': ['Sea View', 'Mini Bar', 'Smart TV', 'Rain Shower']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 15000, 'max_guests': 3, 'total': 15, 'size': 650, 'amenities': ['Sea View', 'Jacuzzi', 'Living Room', 'Butler Service']},
            {'room_type': 'presidential', 'bed_type': 'king', 'price': 35000, 'max_guests': 4, 'total': 3, 'size': 1200, 'amenities': ['Panoramic Sea View', 'Private Pool', 'Dining Room', 'Personal Chef']},
        ],
    },
    {
        'name': 'Royal Heritage Resort',
        'city': 'Jaipur',
        'address': 'Near Amer Fort, Jaipur, Rajasthan 302001',
        'description': 'Step into a world of regal splendor at Royal Heritage Resort. Nestled near the majestic Amer Fort, this palace-turned-resort combines the grandeur of Rajasthani architecture with modern amenities. Enjoy royal dining, camel safaris, and cultural evenings under the desert stars.',
        'star_rating': 5,
        'amenities': ['Free WiFi', 'Heritage Pool', 'Spa', 'Cultural Shows', 'Restaurant', 'Desert Safari', 'Room Service', 'Parking', 'Yoga Center'],
        'images': [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
        ],
        'latitude': 26.9855, 'longitude': 75.8513,
        'is_featured': True,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 4500, 'max_guests': 2, 'total': 40, 'size': 300, 'amenities': ['Garden View', 'AC', 'Smart TV']},
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 7500, 'max_guests': 2, 'total': 25, 'size': 450, 'amenities': ['Fort View', 'Mini Bar', 'Balcony']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 14000, 'max_guests': 3, 'total': 10, 'size': 700, 'amenities': ['Panoramic Fort View', 'Jacuzzi', 'Living Room', 'Heritage Decor']},
        ],
    },
    {
        'name': 'Serenity Beach Resort',
        'city': 'Goa',
        'address': 'Baga Beach Road, North Goa 403516',
        'description': 'Your perfect tropical getaway awaits at Serenity Beach Resort. Located steps from the golden sands of Baga Beach, this resort offers a blend of Portuguese charm and modern luxury. Dive into our beachfront pool, savor fresh seafood at our restaurant, or simply relax with a cocktail as the sun sets over the Arabian Sea.',
        'star_rating': 4,
        'amenities': ['Free WiFi', 'Beach Access', 'Pool', 'Spa', 'Water Sports', 'Restaurant', 'Bar', 'Live Music', 'Kids Club'],
        'images': [
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
        ],
        'latitude': 15.5579, 'longitude': 73.7515,
        'is_featured': True,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 3500, 'max_guests': 2, 'total': 50, 'size': 280, 'amenities': ['Garden View', 'AC', 'Balcony']},
            {'room_type': 'deluxe', 'bed_type': 'queen', 'price': 5500, 'max_guests': 2, 'total': 30, 'size': 380, 'amenities': ['Pool View', 'Mini Bar', 'Rain Shower']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 9000, 'max_guests': 3, 'total': 12, 'size': 550, 'amenities': ['Sea View', 'Private Balcony', 'Living Area', 'Jacuzzi']},
        ],
    },
    {
        'name': 'Imperial Tower Hotel',
        'city': 'Delhi',
        'address': 'Connaught Place, New Delhi 110001',
        'description': 'Located in the heart of India\'s capital, Imperial Tower Hotel offers world-class hospitality with a contemporary Indian flair. Walking distance from major landmarks, premium shopping, and business districts. Our award-winning restaurant serves authentic cuisines from across the subcontinent.',
        'star_rating': 5,
        'amenities': ['Free WiFi', 'Swimming Pool', 'Spa', 'Gym', 'Multi-Cuisine Restaurant', 'Business Center', 'Airport Shuttle', 'Laundry', 'Concierge'],
        'images': [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        ],
        'latitude': 28.6315, 'longitude': 77.2167,
        'is_featured': True,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 6000, 'max_guests': 2, 'total': 60, 'size': 320, 'amenities': ['City View', 'Work Desk', 'Smart TV']},
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 9500, 'max_guests': 2, 'total': 35, 'size': 450, 'amenities': ['Premium City View', 'Mini Bar', 'Lounge Access']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 18000, 'max_guests': 4, 'total': 10, 'size': 800, 'amenities': ['Panoramic View', 'Living Room', 'Dining Area', 'Butler Service']},
            {'room_type': 'presidential', 'bed_type': 'king', 'price': 45000, 'max_guests': 4, 'total': 2, 'size': 1500, 'amenities': ['360° View', 'Private Terrace', 'Home Theater', 'Personal Chef']},
        ],
    },
    {
        'name': 'Lakeside Paradise',
        'city': 'Udaipur',
        'address': 'Lake Pichola Road, Udaipur, Rajasthan 313001',
        'description': 'Perched on the banks of the enchanting Lake Pichola, Lakeside Paradise offers a romantic retreat in the Venice of the East. Watch the sunset paint the Aravalli hills in gold while you dine on our floating restaurant. Every room promises breathtaking lake views and heritage charm.',
        'star_rating': 4,
        'amenities': ['Free WiFi', 'Lake View', 'Boat Rides', 'Spa', 'Heritage Restaurant', 'Rooftop Dining', 'Yoga', 'Cultural Events'],
        'images': [
            'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
        ],
        'latitude': 24.5854, 'longitude': 73.6795,
        'is_featured': False,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 3800, 'max_guests': 2, 'total': 35, 'size': 300, 'amenities': ['Garden View', 'AC', 'Ethnic Decor']},
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 6500, 'max_guests': 2, 'total': 20, 'size': 420, 'amenities': ['Lake View', 'Balcony', 'Mini Bar']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 12000, 'max_guests': 3, 'total': 8, 'size': 600, 'amenities': ['Panoramic Lake View', 'Jacuzzi', 'Living Room']},
        ],
    },
    {
        'name': 'TechPark Business Hotel',
        'city': 'Bangalore',
        'address': 'Whitefield, Bangalore, Karnataka 560066',
        'description': 'The preferred choice for tech professionals and business travelers. TechPark Business Hotel sits in Bangalore\'s IT corridor, offering state-of-the-art conference facilities, high-speed internet, and proximity to major tech parks. Wind down at our craft brewery or rejuvenate at the wellness center.',
        'star_rating': 4,
        'amenities': ['Free WiFi', 'Business Center', 'Conference Rooms', 'Gym', 'Restaurant', 'Craft Brewery', 'Airport Transfer', 'Co-Working Space'],
        'images': [
            'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
        ],
        'latitude': 12.9698, 'longitude': 77.7500,
        'is_featured': False,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 3200, 'max_guests': 2, 'total': 80, 'size': 280, 'amenities': ['Work Desk', 'Fast WiFi', 'Smart TV']},
            {'room_type': 'deluxe', 'bed_type': 'queen', 'price': 5000, 'max_guests': 2, 'total': 40, 'size': 350, 'amenities': ['City View', 'Ergonomic Chair', 'Mini Bar']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 8500, 'max_guests': 3, 'total': 15, 'size': 500, 'amenities': ['Meeting Room', 'Living Area', 'Premium Mini Bar']},
        ],
    },
    {
        'name': 'Mountain View Lodge',
        'city': 'Manali',
        'address': 'Old Manali Road, Manali, Himachal Pradesh 175131',
        'description': 'Escape to the Himalayas at Mountain View Lodge. Surrounded by pine forests and snow-capped peaks, this charming lodge offers adventure seekers and nature lovers an authentic mountain experience. Enjoy trekking, river rafting, and evenings by the bonfire under a canopy of stars.',
        'star_rating': 3,
        'amenities': ['Free WiFi', 'Mountain View', 'Bonfire', 'Trekking Guides', 'Restaurant', 'Parking', 'Adventure Sports', 'Library'],
        'images': [
            'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
            'https://images.unsplash.com/photo-1501117716987-c8c394bb29df?w=800',
            'https://images.unsplash.com/photo-1470770841497-7b3202a1f07c?w=800',
        ],
        'latitude': 32.2396, 'longitude': 77.1887,
        'is_featured': False,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 2200, 'max_guests': 2, 'total': 25, 'size': 220, 'amenities': ['Mountain View', 'Heater', 'Hot Water']},
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 3800, 'max_guests': 3, 'total': 15, 'size': 320, 'amenities': ['Valley View', 'Fireplace', 'Balcony']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 6000, 'max_guests': 4, 'total': 5, 'size': 450, 'amenities': ['Panoramic View', 'Fireplace', 'Living Room', 'Kitchenette']},
        ],
    },
    {
        'name': 'Backwater Bliss Resort',
        'city': 'Kerala',
        'address': 'Alleppey Backwaters, Kerala 688001',
        'description': 'Discover God\'s Own Country at Backwater Bliss Resort. Nestled along the serene backwaters of Alleppey, our eco-friendly resort offers a unique blend of traditional Keralan hospitality and modern comfort. Float through the backwaters on a private houseboat, indulge in Ayurvedic treatments, and feast on authentic South Indian cuisine.',
        'star_rating': 4,
        'amenities': ['Free WiFi', 'Backwater View', 'Ayurvedic Spa', 'Houseboat', 'Yoga', 'Restaurant', 'Canoe Rides', 'Bird Watching'],
        'images': [
            'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800',
            'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
        ],
        'latitude': 9.4981, 'longitude': 76.3388,
        'is_featured': True,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 3000, 'max_guests': 2, 'total': 30, 'size': 260, 'amenities': ['Garden View', 'AC', 'Traditional Decor']},
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 5200, 'max_guests': 2, 'total': 20, 'size': 380, 'amenities': ['Backwater View', 'Private Sit-out', 'Rain Shower']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 8500, 'max_guests': 3, 'total': 8, 'size': 520, 'amenities': ['Waterfront', 'Private Plunge Pool', 'Open-Air Bathroom']},
        ],
    },
    {
        'name': 'Gateway Residency',
        'city': 'Mumbai',
        'address': 'Colaba, Near Gateway of India, Mumbai 400001',
        'description': 'An affordable luxury experience in the heart of South Mumbai. Gateway Residency offers well-appointed rooms just minutes from the Gateway of India, Taj Mahal Palace, and Leopold Cafe. Ideal for travelers who want comfort without compromising on location.',
        'star_rating': 3,
        'amenities': ['Free WiFi', 'Restaurant', 'Room Service', 'Laundry', 'Travel Desk', 'AC', 'Parking'],
        'images': [
            'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=800',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        ],
        'latitude': 18.9220, 'longitude': 72.8347,
        'is_featured': False,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 2500, 'max_guests': 2, 'total': 45, 'size': 250, 'amenities': ['City View', 'AC', 'TV']},
            {'room_type': 'deluxe', 'bed_type': 'queen', 'price': 4000, 'max_guests': 2, 'total': 25, 'size': 320, 'amenities': ['Sea Glimpse', 'Mini Fridge', 'Work Desk']},
            {'room_type': 'superior', 'bed_type': 'king', 'price': 5500, 'max_guests': 3, 'total': 10, 'size': 400, 'amenities': ['Sea View', 'Sitting Area', 'Mini Bar']},
        ],
    },
    {
        'name': 'Desert Oasis Camp',
        'city': 'Jaipur',
        'address': 'Nahargarh Road, Jaipur, Rajasthan 302002',
        'description': 'A boutique desert experience right outside the Pink City. Desert Oasis Camp combines rustic Rajasthani charm with luxurious amenities. Enjoy royal Rajasthani thali dinners, folk music performances, and stargazing sessions in the Thar-inspired setting.',
        'star_rating': 3,
        'amenities': ['Free WiFi', 'Desert Safari', 'Cultural Shows', 'Restaurant', 'Bonfire', 'Camel Rides', 'Parking'],
        'images': [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
        ],
        'latitude': 26.9490, 'longitude': 75.7893,
        'is_featured': False,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 2000, 'max_guests': 2, 'total': 30, 'size': 240, 'amenities': ['Desert View', 'AC', 'Ethnic Decor']},
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 3500, 'max_guests': 2, 'total': 20, 'size': 320, 'amenities': ['Premium Tent', 'Private Bathroom', 'Balcony']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 6500, 'max_guests': 3, 'total': 5, 'size': 500, 'amenities': ['Royal Tent', 'Jacuzzi', 'Private Dining']},
        ],
    },
    {
        'name': 'Seaside Cliff Hotel',
        'city': 'Goa',
        'address': 'Vagator Cliff, North Goa 403509',
        'description': 'Perched atop the dramatic cliffs of Vagator, Seaside Cliff Hotel offers stunning panoramic views of the Arabian Sea. This boutique hotel combines Mediterranean design with Goan warmth. Watch dolphins from your private balcony and catch legendary Goan sunsets every evening.',
        'star_rating': 4,
        'amenities': ['Free WiFi', 'Cliff-top Pool', 'Sea View', 'Spa', 'Restaurant', 'Bar', 'Yoga Deck', 'Scuba Diving'],
        'images': [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
            'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
        ],
        'latitude': 15.6042, 'longitude': 73.7362,
        'is_featured': False,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 4000, 'max_guests': 2, 'total': 25, 'size': 300, 'amenities': ['Garden View', 'AC', 'Balcony']},
            {'room_type': 'deluxe', 'bed_type': 'queen', 'price': 6500, 'max_guests': 2, 'total': 15, 'size': 400, 'amenities': ['Ocean View', 'Mini Bar', 'Rain Shower']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 11000, 'max_guests': 3, 'total': 5, 'size': 600, 'amenities': ['Panoramic Ocean View', 'Private Pool', 'Outdoor Shower']},
        ],
    },
    {
        'name': 'Silicon Valley Suites',
        'city': 'Bangalore',
        'address': 'MG Road, Bangalore, Karnataka 560001',
        'description': 'Premium serviced suites in the heart of Bangalore. Silicon Valley Suites caters to extended-stay professionals with fully furnished apartments, high-speed internet, and a vibrant rooftop restaurant. Walking distance to pubs, shopping, and the metro.',
        'star_rating': 4,
        'amenities': ['Free WiFi', 'Kitchenette', 'Gym', 'Rooftop Restaurant', 'Co-Working', 'Laundry', 'Metro Proximity', '24/7 Concierge'],
        'images': [
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        ],
        'latitude': 12.9716, 'longitude': 77.5946,
        'is_featured': False,
        'rooms': [
            {'room_type': 'standard', 'bed_type': 'double', 'price': 3500, 'max_guests': 2, 'total': 50, 'size': 350, 'amenities': ['City View', 'Kitchenette', 'Fast WiFi']},
            {'room_type': 'deluxe', 'bed_type': 'king', 'price': 5500, 'max_guests': 2, 'total': 30, 'size': 450, 'amenities': ['Premium View', 'Full Kitchen', 'Washer']},
            {'room_type': 'suite', 'bed_type': 'king', 'price': 9000, 'max_guests': 3, 'total': 10, 'size': 650, 'amenities': ['Penthouse View', '2 Bedrooms', 'Full Kitchen', 'Home Theater']},
        ],
    },
]

REVIEW_NAMES = [
    'Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Reddy',
    'Vikram Singh', 'Ananya Gupta', 'Rajesh Nair', 'Meera Joshi',
    'Arjun Verma', 'Kavita Desai', 'Sanjay Mehta', 'Pooja Iyer',
    'Nikhil Agarwal', 'Divya Kapoor', 'Rohan Malhotra', 'Ishita Das',
]

REVIEW_TITLES = [
    'Amazing experience!', 'Loved every moment', 'Best hotel in the city',
    'Great value for money', 'Perfect for families', 'Highly recommended',
    'Will definitely come back', 'Exceeded expectations', 'Beautiful property',
    'Wonderful hospitality', 'Superb location', 'Clean and comfortable',
]

REVIEW_COMMENTS = [
    'The staff was incredibly welcoming and the room was spotless. The view from our balcony was breathtaking. Would highly recommend to anyone visiting the city.',
    'We had a wonderful stay. The food was delicious and the amenities were top-notch. The pool area was particularly impressive.',
    'Perfect location, close to all major attractions. The room was spacious and well-maintained. The concierge was very helpful with restaurant recommendations.',
    'One of the best hotels I\'ve ever stayed at. The attention to detail is remarkable. The spa treatment was the highlight of our trip.',
    'Great property with excellent service. The breakfast buffet had a wide variety of options. The gym was well-equipped.',
    'Beautiful architecture and lovely ambiance. The staff went above and beyond to make our anniversary special. Truly a memorable stay.',
    'Very comfortable rooms with modern amenities. The restaurant served authentic local cuisine that was absolutely delicious.',
    'Checked in smoothly and the room was ready ahead of time. Beds were extremely comfortable. Will book again for our next trip.',
]

TRAVEL_TYPES = ['business', 'leisure', 'family', 'couple', 'solo']


class Command(BaseCommand):
    help = 'Seeds hotel data with rooms and reviews'

    def handle(self, *args, **options):
        self.stdout.write('[HOTEL] Seeding hotel data...')

        for hotel_data in HOTELS_DATA:
            rooms_data = hotel_data.pop('rooms')

            hotel, created = Hotel.objects.get_or_create(
                name=hotel_data['name'],
                defaults=hotel_data,
            )

            if created:
                self.stdout.write(f'  [+] Created: {hotel.name}')
            else:
                self.stdout.write(f'  [=] Exists: {hotel.name}')
                continue

            # Create rooms
            for room_data in rooms_data:
                Room.objects.create(
                    hotel=hotel,
                    room_type=room_data['room_type'],
                    bed_type=room_data['bed_type'],
                    price_per_night=room_data['price'],
                    max_guests=room_data['max_guests'],
                    total_rooms=room_data['total'],
                    room_size=room_data['size'],
                    amenities=room_data['amenities'],
                    images=hotel.images[:1],  # Use first hotel image
                )

            hotel.update_price_range()

            # Create random reviews
            num_reviews = random.randint(5, 12)
            for _ in range(num_reviews):
                rating = random.choices([5, 4, 3, 4, 5], weights=[3, 4, 1, 3, 4])[0]
                Review.objects.create(
                    hotel=hotel,
                    guest_name=random.choice(REVIEW_NAMES),
                    rating=rating,
                    title=random.choice(REVIEW_TITLES),
                    comment=random.choice(REVIEW_COMMENTS),
                    travel_type=random.choice(TRAVEL_TYPES),
                )

            hotel.update_rating()

        total = Hotel.objects.count()
        self.stdout.write(self.style.SUCCESS(f'\nDone! {total} hotels seeded with rooms and reviews.'))
