import json
from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid


class Trek(models.Model):
    """A trekking expedition or adventure camp."""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('moderate', 'Moderate'),
        ('difficult', 'Difficult'),
        ('expert', 'Expert / Technical'),
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    region = models.CharField(max_length=100, db_index=True, help_text="e.g. Uttarakhand, Ladakh, Himachal")
    base_camp = models.CharField(max_length=255, default='')
    description = models.TextField(blank=True, default='')
    route_plan = models.JSONField(default=list, blank=True, help_text='Detailed itinerary: [{"day": 1, "title": "...", "desc": "..."}]')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_CHOICES, default='moderate')
    duration_days = models.IntegerField(default=5)
    max_altitude = models.IntegerField(default=3000, help_text="Altitude in meters")
    amenities = models.JSONField(default=list, blank=True,
                                 help_text='Inclusions: ["Guide","Equipment","Meals"]')
    images = models.JSONField(default=list, blank=True,
                              help_text='List of adventure image URLs')
    weather_info = models.JSONField(default=dict, blank=True,
                                   help_text='Average weather: {"temp": "5°C", "condition": "Sunny", "humidity": "45%"}')
    best_season = models.CharField(max_length=100, default='April - June', help_text="e.g. Sept - Nov")
    price_min = models.FloatField(default=0, help_text='Starting price per person')
    price_max = models.FloatField(default=0)
    avg_rating = models.FloatField(default=0)
    total_reviews = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', '-avg_rating']

    def __str__(self):
        return f"{self.name} — {self.region}"

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            base = slugify(self.name)
            self.slug = f"{base}-{self.region.lower().replace(' ', '-')}"
        super().save(*args, **kwargs)

    def update_rating(self):
        reviews = self.reviews.all()
        count = reviews.count()
        if count:
            self.avg_rating = round(sum(r.rating for r in reviews) / count, 1)
            self.total_reviews = count
        else:
            self.avg_rating = 0
            self.total_reviews = 0
        self.save(update_fields=['avg_rating', 'total_reviews'])

    def update_price_range(self):
        packages = self.rooms.filter(is_active=True)
        if packages.exists():
            self.price_min = packages.order_by('price_per_person').first().price_per_person
            self.price_max = packages.order_by('-price_per_person').first().price_per_person
        self.save(update_fields=['price_min', 'price_max'])


class Camp(models.Model):
    """An organization or local camp that leads treks."""
    name = models.CharField(max_length=255)
    logo_url = models.URLField(blank=True, default='')
    description = models.TextField(blank=True, default='')
    experience_years = models.IntegerField(default=5)
    rating = models.FloatField(default=4.8)
    specialty = models.CharField(max_length=255, blank=True, default='Elite Expeditions')
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Package(models.Model):
    """A specific trek package or batch."""
    PACKAGE_TYPES = (
        ('standard', 'Standard Group'),
        ('private', 'Private Expedition'),
        ('luxury', 'Luxury Camp'),
        ('student', 'Student/Youth Special'),
    )

    trek = models.ForeignKey(Trek, on_delete=models.CASCADE, related_name='rooms')
    camp = models.ForeignKey(Camp, on_delete=models.SET_NULL, null=True, blank=True, related_name='packages')
    package_type = models.CharField(max_length=30, choices=PACKAGE_TYPES, default='standard')
    base_camp = models.CharField(max_length=255, default='', blank=True)
    route_plan = models.JSONField(default=list, blank=True, help_text='Package specific itinerary')
    price_per_person = models.FloatField()
    max_trekkers = models.IntegerField(default=15)
    inclusions = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['price_per_person']

    def __str__(self):
        return f"{self.get_package_type_display()} — {self.trek.name}"

    def available_slots(self, check_in, check_out):
        """Returns available slots for given date range."""
        from django.db.models import Q
        booked = Booking.objects.filter(
            package=self,
            status__in=['confirmed', 'checked_in'],
        ).filter(
            Q(check_in__lt=check_out) & Q(check_out__gt=check_in)
        ).aggregate(models.Sum('trekkers_count'))['trekkers_count__sum'] or 0
        return max(0, self.max_trekkers - booked)


class Booking(models.Model):
    """A trek booking."""
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('on_trek', 'On Trek'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    PAYMENT_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
    )

    booking_ref = models.CharField(max_length=12, unique=True, editable=False)
    trek = models.ForeignKey(Trek, on_delete=models.CASCADE, related_name='bookings')
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name='bookings')
    guest_lead = models.ForeignKey('leads.Lead', on_delete=models.SET_NULL, null=True, blank=True,
                                   related_name='bookings')
    guest_name = models.CharField(max_length=255)
    guest_email = models.EmailField()
    guest_phone = models.CharField(max_length=20, blank=True, default='')
    check_in = models.DateField(verbose_name="Start Date")
    check_out = models.DateField(verbose_name="End Date")
    trekkers_count = models.IntegerField(default=1)
    total_price = models.FloatField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='pending')
    special_requests = models.TextField(blank=True, default='', help_text="Medical issues, dietary needs")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.booking_ref} — {self.guest_name}"

    def save(self, *args, **kwargs):
        if not self.booking_ref:
            self.booking_ref = f"TRK{uuid.uuid4().hex[:8].upper()}"
        if self.check_in and self.check_out:
            nights = (self.check_out - self.check_in).days
            self.total_price = self.package.price_per_person * self.trekkers_count
        super().save(*args, **kwargs)


class Review(models.Model):
    """Guest review for a trek."""
    trek = models.ForeignKey(Trek, on_delete=models.CASCADE, related_name='reviews')
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    guest_name = models.CharField(max_length=255)
    rating = models.IntegerField(default=5)
    title = models.CharField(max_length=255, blank=True, default='')
    comment = models.TextField(blank=True, default='')
    travel_type = models.CharField(max_length=50, blank=True, default='solo',
                                   help_text='solo, group, family, couple')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.guest_name} — {self.trek.name} ({self.rating}★)"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.trek.update_rating()
