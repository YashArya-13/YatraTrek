from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('sales', 'Sales'),
        ('camp_leader', 'Camp Leader'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='sales')
    camp = models.ForeignKey('hotels.Camp', on_delete=models.SET_NULL, null=True, blank=True, related_name='leaders')