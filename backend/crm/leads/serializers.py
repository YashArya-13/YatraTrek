from rest_framework import serializers
from .models import Lead, Activity
from invoices.models import Invoice

class ActivitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Activity
        fields = ['id', 'activity_type', 'description', 'created_at', 'username']

class LeadSerializer(serializers.ModelSerializer):
    activities = ActivitySerializer(many=True, read_only=True)
    assigned_to_username = serializers.CharField(source='assigned_to.username', read_only=True)
    score = serializers.SerializerMethodField()

    class Meta:
        model = Lead
        fields = '__all__'
        read_only_fields = ['assigned_to', 'created_at']

    def get_score(self, obj):
        score = 0
        if obj.status == 'new': score = 20
        elif obj.status == 'contacted': score = 50
        elif obj.status == 'converted': score = 100
        
        has_qt = obj.quotations.exists()
        if has_qt: score += 10
        
        has_paid_inv = Invoice.objects.filter(quotation__customer=obj, status='paid').exists()
        if has_paid_inv: score += 20
        
        return min(score, 100)
