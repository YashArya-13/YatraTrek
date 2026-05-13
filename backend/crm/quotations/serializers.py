from rest_framework import serializers
from .models import Quotation, QuotationItem
from products.models import Product
from leads.models import Lead


class QuotationItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = QuotationItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal()


class QuotationSerializer(serializers.ModelSerializer):
    items = QuotationItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True, default='')
    customer_email = serializers.CharField(source='customer.email', read_only=True, default='')
    customer_phone = serializers.CharField(source='customer.phone', read_only=True, default='')

    class Meta:
        model = Quotation
        fields = [
            'id', 'customer', 'customer_name', 'customer_email', 'customer_phone',
            'subtotal', 'gst_rate', 'gst_amount', 'total', 'notes', 'items', 'created_at'
        ]
        read_only_fields = ['subtotal', 'gst_amount', 'total', 'created_at']


class CreateQuotationSerializer(serializers.Serializer):
    """Used for creating a quotation with nested items in one shot."""
    lead = serializers.IntegerField(required=False, allow_null=True)
    notes = serializers.CharField(required=False, allow_blank=True, default='')
    gst_rate = serializers.FloatField(required=False, default=18.0)
    items = serializers.ListField(
        child=serializers.DictField(), min_length=1
    )

    def validate_items(self, items):
        for item in items:
            if not item.get('product'):
                raise serializers.ValidationError("Each item must have a product.")
            if int(item.get('qty', 0)) < 1:
                raise serializers.ValidationError("Quantity must be at least 1.")
        return items

    def create(self, validated_data):
        lead = None
        lead_id = validated_data.get('lead')
        if lead_id:
            try:
                lead = Lead.objects.get(id=lead_id)
            except Lead.DoesNotExist:
                pass

        quotation = Quotation.objects.create(
            customer=lead,
            notes=validated_data.get('notes', ''),
            gst_rate=validated_data.get('gst_rate', 18.0)
        )

        for item_data in validated_data['items']:
            try:
                product = Product.objects.get(id=item_data['product'])
                QuotationItem.objects.create(
                    quotation=quotation,
                    product=product,
                    quantity=int(item_data.get('qty', 1)),
                    unit_price=float(product.price),
                )
            except Product.DoesNotExist:
                pass

        quotation.recalculate_total()
        return quotation
