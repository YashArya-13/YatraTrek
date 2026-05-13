from rest_framework import serializers
from .models import Invoice
from quotations.serializers import QuotationItemSerializer

class InvoiceSerializer(serializers.ModelSerializer):
    lead_name = serializers.CharField(source='quotation.customer.name', read_only=True)
    items = QuotationItemSerializer(source='quotation.items', many=True, read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'