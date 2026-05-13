from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeadViewSet, public_create_lead

router = DefaultRouter()
router.register('', LeadViewSet, basename='lead') # Empty prefix because root has 'api/leads/'

urlpatterns = [
    path('public-lead/', public_create_lead), # api/leads/public-lead/
    path('', include(router.urls)),           # api/leads/ (list), api/leads/<pk>/ (detail)
]