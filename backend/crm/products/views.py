from django.db import models
from rest_framework.viewsets import ModelViewSet
from .models import Product
from .serializers import ProductSerializer

class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Product.objects.all().order_by('name')
        if user.role == 'camp_leader' and user.camp:
            return qs.filter(models.Q(camp=user.camp) | models.Q(camp__isnull=True))
        return qs

    def perform_create(self, serializer):
        user = self.request.user
        if user.role == 'camp_leader' and user.camp:
            serializer.save(camp=user.camp)
        else:
            serializer.save()
