from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("CRM Backend Running 🚀")

urlpatterns = [
    path('', home), 
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/leads/', include('leads.urls')),
    path('api/products/', include('products.urls')),
    path('api/quotations/', include('quotations.urls')),
    path('api/invoices/', include('invoices.urls')),
    path('api/reports/', include('reports.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/hotels/', include('hotels.urls')),
]