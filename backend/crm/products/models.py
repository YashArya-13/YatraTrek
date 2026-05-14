from django.db import models

class Product(models.Model):
    CATEGORY_CHOICES = [
        ('trek_package', 'Trek Package'),
        ('equipment', 'Equipment'),
        ('meal_plan', 'Meal Plan'),
        ('transport', 'Transport'),
        ('insurance', 'Insurance'),
        ('other', 'Other'),
    ]
    camp = models.ForeignKey('treks.Camp', on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    name = models.CharField(max_length=255)
    price = models.FloatField()
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='other')
    stock = models.IntegerField(default=0, help_text='Units in stock. 0 = out of stock.')
    discount_pct = models.FloatField(default=0, help_text='Discount percentage (0–100).')
    is_active = models.BooleanField(default=True)

    def effective_price(self):
        return round(self.price * (1 - self.discount_pct / 100), 2)

    def __str__(self):
        return f"{self.name} ({self.camp.name if self.camp else 'Global'})"
