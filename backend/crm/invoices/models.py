from django.db import models
from quotations.models import Quotation

class Invoice(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
    )
    quotation = models.OneToOneField(Quotation, on_delete=models.CASCADE)
    subtotal = models.FloatField(default=0)
    gst_rate = models.FloatField(default=18)
    gst_amount = models.FloatField(default=0)
    total = models.FloatField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"INV-{str(self.id).zfill(4)}"
