from django.db import models
from django.conf import settings

class Lead(models.Model):
    STATUS_CHOICES = (
        ('new', 'New'),
        ('contacted', 'Contacted'),
        ('converted', 'Converted'),
        ('lost', 'Lost'),
    )

    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=20, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    notes = models.TextField(blank=True, default='')
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True, blank=True
    )
    camp = models.ForeignKey('treks.Camp', on_delete=models.SET_NULL, null=True, blank=True, related_name='leads')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Activity(models.Model):
    ACTIVITY_TYPES = (
        ('email', 'Email Sent'),
        ('whatsapp', 'WhatsApp Sent'),
        ('note', 'Note Added'),
        ('system', 'System Action'),
    )
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPES)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.activity_type} - {self.lead.name}"
