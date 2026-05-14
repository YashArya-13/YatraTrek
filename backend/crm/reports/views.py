from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from leads.models import Lead
from invoices.models import Invoice
from products.models import Product
from quotations.models import Quotation
from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from tasks.models import Task
from leads.models import Activity

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    role = getattr(user, 'role', 'sales')

    # Base querysets based on RBAC
    if role in ['admin', 'manager']:
        leads_qs = Lead.objects.all()
        invoices_qs = Invoice.objects.all()
        quotations_qs = Quotation.objects.all()
    else:
        # Sales role only sees their own leads
        leads_qs = Lead.objects.filter(assigned_to=user)
        # Invoices and Quotations linked to their leads
        invoices_qs = Invoice.objects.filter(quotation__customer__assigned_to=user)
        quotations_qs = Quotation.objects.filter(customer__assigned_to=user)

    # General Stats
    total_leads = leads_qs.count()
    converted_leads = leads_qs.filter(status='converted').count()
    new_leads = leads_qs.filter(status='new').count()
    total_revenue = invoices_qs.filter(status='paid').aggregate(Sum('total'))['total__sum'] or 0
    pending_revenue = invoices_qs.exclude(status='paid').aggregate(Sum('total'))['total__sum'] or 0
    
    # Chart Data: Leads by month
    monthly_leads = (
        leads_qs.annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(count=Count('id'))
        .order_by('month')
    )
    
    chart_data = []
    # Simplified month mapping
    for entry in monthly_leads:
        chart_data.append({
            "name": entry['month'].strftime('%b'),
            "leads": entry['count']
        })

    # Distribution Data
    distribution = [
        {"name": "New", "value": new_leads},
        {"name": "Converted", "value": converted_leads},
        {"name": "Lost", "value": leads_qs.filter(status='lost').count()},
    ]

    # Recent Leads (Real Data)
    recent_leads = leads_qs.order_by('-created_at')[:5]
    recent_leads_data = []
    for l in recent_leads:
        recent_leads_data.append({
            "id": l.id,
            "name": l.name,
            "company": l.email or l.phone or "N/A",
            "status": l.status.upper(),
            "value": "—" # Leads don't have direct value in this model yet
        })

    # Task Stats
    pending_tasks = Task.objects.filter(assigned_to=user, status='pending').count()
    overdue_tasks = Task.objects.filter(assigned_to=user, status='overdue').count()

    # AI Lead Scoring Logic (Simple Rule-based)
    # New: 20, Contacted: 50, Converted: 100, Lost: 0
    # +10 if has quotations, +20 if has paid invoices
    ai_leads = []
    for lead in leads_qs[:10]:
        score = 0
        if lead.status == 'new': score = 20
        elif lead.status == 'contacted': score = 50
        elif lead.status == 'converted': score = 100
        
        has_qt = lead.quotations.exists()
        if has_qt: score += 10
        
        has_paid_inv = Invoice.objects.filter(quotation__customer=lead, status='paid').exists()
        if has_paid_inv: score += 20
        
        ai_leads.append({
            "id": lead.id,
            "name": lead.name,
            "score": min(score, 100),
            "status": lead.status
        })

    # Recent Activities
    recent_activities = Activity.objects.filter(lead__in=leads_qs).order_by('-created_at')[:8]
    activities_data = []
    for act in recent_activities:
        activities_data.append({
            "id": act.id,
            "lead_name": act.lead.name,
            "type": act.activity_type,
            "desc": act.description,
            "time": act.created_at.strftime("%I:%M %p"),
            "date": act.created_at.strftime("%d %b")
        })

    # Overdue Tasks List
    overdue_list = Task.objects.filter(assigned_to=user, status='overdue').order_by('due_date')[:5]
    overdue_tasks_data = []
    for t in overdue_list:
        overdue_tasks_data.append({
            "id": t.id,
            "title": t.title,
            "due": t.due_date.strftime("%d %b") if t.due_date else "N/A"
        })

    # Revenue Trend (Invoices over time)
    revenue_trend = (
        invoices_qs.filter(status='paid')
        .annotate(month=TruncMonth('created_at'))
        .values('month')
        .annotate(total=Sum('total'))
        .order_by('month')
    )
    revenue_chart = []
    for entry in revenue_trend:
        revenue_chart.append({
            "name": entry['month'].strftime('%b'),
            "revenue": entry['total']
        })

    return Response({
        "role": role,
        "stats": {
            "total_leads": total_leads,
            "converted": converted_leads,
            "new": new_leads,
            "revenue": total_revenue,
            "pending": pending_revenue,
            "pending_tasks": pending_tasks,
            "overdue_tasks": overdue_tasks
        },
        "chartData": chart_data if chart_data else [{"name": "No Data", "leads": 0}],
        "revenueChart": revenue_chart if revenue_chart else [{"name": "Jan", "revenue": 0}],
        "distribution": distribution,
        "recentLeads": recent_leads_data,
        "aiLeads": sorted(ai_leads, key=lambda x: x['score'], reverse=True),
        "recentActivities": activities_data,
        "overdueTasksList": overdue_tasks_data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sales_report(request):
    # Only Admin/Manager can see full sales report
    if request.user.role not in ['admin', 'manager']:
        return Response({"error": "Unauthorized"}, status=403)
        
    data = Invoice.objects.annotate(month=TruncMonth('created_at')).values('month').annotate(total=Sum('total')).order_by('month')
    return Response(list(data))
