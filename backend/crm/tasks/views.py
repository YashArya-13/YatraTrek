from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'manager']:
            return Task.objects.all().order_by('due_date')
        return Task.objects.filter(assigned_to=user).order_by('due_date')

    def perform_create(self, serializer):
        serializer.save(assigned_to=self.request.user)
