from django.db import models
from leads.models import Lead
from products.models import Product


class Quotation(models.Model):
    camp = models.ForeignKey('treks.Camp', on_delete=models.CASCADE, related_name='quotations', null=True, blank=True)
    customer = models.ForeignKey(
        Lead, on_delete=models.SET_NULL, null=True, blank=True, related_name='quotations'
    )
    subtotal = models.FloatField(default=0)   # before GST
    gst_rate = models.FloatField(default=18)  # percentage, e.g. 18 for 18%
    gst_amount = models.FloatField(default=0)
    total = models.FloatField(default=0)      # subtotal + gst_amount
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"QT-{str(self.id).zfill(4)}"

    def recalculate_total(self):
        self.subtotal = sum(item.subtotal() for item in self.items.all())
        self.gst_amount = round(self.subtotal * (self.gst_rate / 100), 2)
        self.total = round(self.subtotal + self.gst_amount, 2)
        self.save()


class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    unit_price = models.FloatField(default=0)  # snapshot of price at time of quotation

    def subtotal(self):
        return self.unit_price * self.quantity

    def __str__(self):
        return f"{self.product.name} x{self.quantity}"
