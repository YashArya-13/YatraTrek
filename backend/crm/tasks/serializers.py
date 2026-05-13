from rest_framework import serializers
from .models import Task
from leads.models import Lead

class TaskSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='lead.name', read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['assigned_to', 'created_at', 'updated_at']
