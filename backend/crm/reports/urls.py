from django.urls import path
from .views import dashboard_stats, sales_report

urlpatterns = [
    path('dashboard/', dashboard_stats),
    path('sales-report/', sales_report),
]