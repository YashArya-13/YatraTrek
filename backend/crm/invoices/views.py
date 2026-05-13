from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Invoice
from .serializers import InvoiceSerializer
import urllib.parse


from django.db.models import Q

class InvoiceViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Invoice.objects.all().order_by('-id')
        if user.role == 'camp_leader' and user.camp:
            return qs.filter(Q(quotation__camp=user.camp) | Q(quotation__camp__isnull=True))
        return qs


    @action(detail=True, methods=['get'], url_path='share_whatsapp')
    def share_whatsapp(self, request, pk=None):
        invoice = self.get_object()
        message = (
            f"🧾 *Invoice INV-{str(invoice.id).zfill(4)}*\n"
            f"Amount: *₹{invoice.total:,.0f}*\n\n"
            f"Thank you for your business! 🙏"
        )
        encoded = urllib.parse.quote(message)
        link = f"https://wa.me/?text={encoded}"
        return Response({"link": link})

    @action(detail=True, methods=['patch'], url_path='mark_paid')
    def mark_paid(self, request, pk=None):
        invoice = self.get_object()
        invoice.status = 'paid'
        invoice.save()
        return Response(InvoiceSerializer(invoice).data)