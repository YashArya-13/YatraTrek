from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.core.mail import send_mail
from django.conf import settings
import urllib.parse

from .models import Quotation, QuotationItem
from .serializers import QuotationSerializer, CreateQuotationSerializer
from products.models import Product
from leads.models import Lead


from django.db.models import Q

class QuotationViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = QuotationSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Quotation.objects.prefetch_related('items__product').order_by('-created_at')
        if user.role == 'camp_leader' and user.camp:
            return qs.filter(Q(camp=user.camp) | Q(camp__isnull=True))
        return qs

    def create(self, request, *args, **kwargs):
        """Create quotation with nested items."""
        serializer = CreateQuotationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Resolve lead
        lead = None
        lead_id = serializer.validated_data.get('lead')
        if lead_id:
            try:
                lead = Lead.objects.get(id=lead_id)
            except Lead.DoesNotExist:
                pass

        # Determine camp
        user = request.user
        camp = user.camp if user.role == 'camp_leader' else (lead.camp if lead else None)

        # Create quotation
        quotation = Quotation.objects.create(
            customer=lead,
            camp=camp,
            notes=serializer.validated_data.get('notes', '')
        )

        # Create line items
        for item_data in serializer.validated_data['items']:
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

        return Response(
            QuotationSerializer(quotation).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'], url_path='share_whatsapp')
    def share_whatsapp(self, request, pk=None):
        quotation = self.get_object()
        items_text = '\n'.join(
            f"• {item.product.name} x{item.quantity} = ₹{item.subtotal():,.0f}"
            for item in quotation.items.all()
        )
        message = (
            f"📋 *Quotation QT-{str(quotation.id).zfill(4)}*\n"
            f"{'Customer: ' + quotation.customer.name + chr(10) if quotation.customer else ''}"
            f"\n*Items:*\n{items_text}\n\n"
            f"*Total: ₹{quotation.total:,.0f}*\n\n"
            f"Thank you for your business! 🙏"
        )
        encoded = urllib.parse.quote(message)
        phone = ""
        if quotation.customer and quotation.customer.phone:
            phone = quotation.customer.phone.replace(" ", "").replace("+", "")
        link = f"https://wa.me/{phone}?text={encoded}"
        return Response({'link': link})

    @action(detail=True, methods=['post'], url_path='share_email')
    def share_email(self, request, pk=None):
        quotation = self.get_object()
        recipient = request.data.get('email') or (
            quotation.customer.email if quotation.customer else None
        )
        if not recipient:
            return Response({'error': 'No email address provided.'}, status=400)

        # Build email content
        customer_name = quotation.customer.name if quotation.customer else 'Customer'
        qt_id = f"QT-{str(quotation.id).zfill(4)}"
        date_str = quotation.created_at.strftime('%d %b %Y')

        items_rows_html = ''.join(
            f"""<tr>
                <td style="padding:10px 14px;border-bottom:1px solid #1e293b;">{item.product.name}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #1e293b;text-align:center;">{item.quantity}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #1e293b;text-align:right;">₹{item.unit_price:,.0f}</td>
                <td style="padding:10px 14px;border-bottom:1px solid #1e293b;text-align:right;font-weight:600;color:#22d3a5;">₹{item.subtotal():,.0f}</td>
            </tr>"""
            for item in quotation.items.all()
        )
        items_text = '\n'.join(
            f"  • {item.product.name}  x{item.quantity}  =  ₹{item.subtotal():,.0f}"
            for item in quotation.items.all()
        )

        subject = f"Quotation {qt_id} from NexCRM"

        # Plain text fallback
        plain_body = (
            f"Dear {customer_name},\n\n"
            f"Please find your quotation details below.\n\n"
            f"Quotation : {qt_id}\n"
            f"Date      : {date_str}\n\n"
            f"Items:\n{items_text}\n\n"
            f"{'─'*36}\n"
            f"TOTAL     : ₹{quotation.total:,.0f}\n"
            f"{'─'*36}\n\n"
            f"{'Notes: ' + quotation.notes + chr(10) if quotation.notes else ''}"
            f"Thank you for your business!\n— NexCRM Team"
        )

        # Pre-compute notes block (avoids backslash-in-f-string error in Python < 3.12)
        notes_block = (
            f'<div style="background:#1e293b;border-radius:8px;padding:12px 16px;'
            f'margin-bottom:24px;font-size:13px;color:#94a3b8;">'
            f'<strong style="color:#f1f5f9;">Notes:</strong> {quotation.notes}</div>'
        ) if quotation.notes else ''

        # HTML email
        html_body = f"""
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0e1a;font-family:'Segoe UI',Arial,sans-serif;">
<div style="max-width:600px;margin:32px auto;background:#0f1629;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">

  <!-- Header -->
  <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:32px 40px;">
    <div style="font-size:28px;font-weight:800;color:#fff;letter-spacing:-0.5px;">⚡ NexCRM</div>
    <div style="color:rgba(255,255,255,0.75);margin-top:4px;font-size:14px;">Pro Edition</div>
  </div>

  <!-- Body -->
  <div style="padding:36px 40px;">
    <p style="font-size:16px;color:#94a3b8;margin:0 0 24px;">Dear <strong style="color:#f1f5f9;">{customer_name}</strong>,</p>
    <p style="font-size:14px;color:#94a3b8;margin:0 0 28px;line-height:1.6;">
      Please find your quotation details below. Kindly review and confirm at your earliest convenience.
    </p>

    <!-- Meta -->
    <div style="background:#111827;border:1px solid #1e293b;border-radius:10px;padding:16px 20px;margin-bottom:24px;display:flex;gap:24px;">
      <div style="flex:1;">
        <div style="font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Quotation ID</div>
        <div style="font-size:15px;font-weight:700;color:#818cf8;">{qt_id}</div>
      </div>
      <div style="flex:1;">
        <div style="font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:4px;">Date</div>
        <div style="font-size:15px;font-weight:600;color:#f1f5f9;">{date_str}</div>
      </div>
    </div>

    <!-- Items Table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;background:#111827;border:1px solid #1e293b;border-radius:10px;overflow:hidden;">
      <thead>
        <tr style="background:#1e293b;">
          <th style="padding:12px 14px;text-align:left;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Product</th>
          <th style="padding:12px 14px;text-align:center;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Qty</th>
          <th style="padding:12px 14px;text-align:right;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Unit Price</th>
          <th style="padding:12px 14px;text-align:right;font-size:11px;color:#475569;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">Subtotal</th>
        </tr>
      </thead>
      <tbody>{items_rows_html}</tbody>
    </table>

    <!-- Total -->
    <div style="text-align:right;margin-bottom:28px;">
      <div style="display:inline-block;background:rgba(34,211,165,0.1);border:1px solid rgba(34,211,165,0.25);border-radius:10px;padding:14px 24px;">
        <div style="font-size:12px;color:#64748b;margin-bottom:4px;">TOTAL AMOUNT</div>
        <div style="font-size:28px;font-weight:800;color:#22d3a5;">₹{quotation.total:,.0f}</div>
      </div>
    </div>

    {notes_block}

    <p style="font-size:13px;color:#475569;margin:0;">
      If you have any questions, please reply to this email.<br>
      Thank you for your business! 🙏
    </p>
  </div>

  <!-- Footer -->
  <div style="background:#080c18;padding:20px 40px;text-align:center;border-top:1px solid #1e293b;">
    <p style="font-size:12px;color:#334155;margin:0;">Sent via <strong style="color:#6366f1;">NexCRM Pro</strong> · This is an automated quotation email.</p>
  </div>

</div>
</body>
</html>"""

        # Check if SMTP is configured
        from django.conf import settings as django_settings
        email_backend = getattr(django_settings, 'EMAIL_BACKEND', '')
        if 'console' in email_backend:
            return Response({
                'error': 'not_configured',
                'message': (
                    'Gmail SMTP is not configured yet. '
                    'Please open backend/crm/.env and fill in your Gmail credentials.'
                )
            }, status=503)

        try:
            from django.core.mail import EmailMultiAlternatives
            msg = EmailMultiAlternatives(
                subject=subject,
                body=plain_body,
                from_email=getattr(django_settings, 'DEFAULT_FROM_EMAIL', 'noreply@nexcrm.com'),
                to=[recipient],
            )
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=False)
            return Response({'message': f'Quotation {qt_id} sent to {recipient} ✅'})
        except Exception as e:
            return Response({'error': str(e)}, status=500)

    @action(detail=True, methods=['post'], url_path='convert_to_invoice')
    def convert_to_invoice(self, request, pk=None):
        quotation = self.get_object()
        from invoices.models import Invoice
        
        # Check if invoice already exists
        if Invoice.objects.filter(quotation=quotation).exists():
            return Response({'error': 'Invoice already exists for this quotation.'}, status=400)
            
        invoice = Invoice.objects.create(
            quotation=quotation,
            subtotal=quotation.subtotal,
            gst_rate=quotation.gst_rate,
            gst_amount=quotation.gst_amount,
            total=quotation.total,
            status='pending'
        )
        
        # Also update lead status if needed
        if quotation.customer:
            quotation.customer.status = 'converted'
            quotation.customer.save()
            
        from invoices.serializers import InvoiceSerializer
        return Response(InvoiceSerializer(invoice).data, status=201)
