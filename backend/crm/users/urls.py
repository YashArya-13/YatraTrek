from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, login, me

router = DefaultRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('login/', login),
    path('me/', me),
    path('', include(router.urls)),
]