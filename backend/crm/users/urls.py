from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, login, me, register_camp_owner, register_trekker

router = DefaultRouter()
router.register('', UserViewSet, basename='user')

urlpatterns = [
    path('login/', login),
    path('me/', me),
    path('register-camp/', register_camp_owner),
    path('register-trekker/', register_trekker),
    path('', include(router.urls)),
]
