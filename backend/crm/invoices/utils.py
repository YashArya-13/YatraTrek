from reportlab.pdfgen import canvas

def generate_invoice_pdf(invoice_id):
    file_name = f"invoice_{invoice_id}.pdf"
    c = canvas.Canvas(file_name)
    c.drawString(100, 750, f"Invoice ID: {invoice_id}")
    c.save()
    return file_name
