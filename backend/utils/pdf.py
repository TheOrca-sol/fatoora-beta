from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
from io import BytesIO
from datetime import datetime
import os

def number_to_words_french(amount):
    """Convert number to French words for invoice"""
    # Simple implementation - in production you'd use a proper library
    if amount == 10000:
        return "dix mille dirhams"
    elif amount < 1000:
        return f"{int(amount)} dirhams"
    elif amount < 10000:
        thousands = int(amount // 1000)
        remainder = int(amount % 1000)
        if remainder == 0:
            return f"{thousands} mille dirhams"
        else:
            return f"{thousands} mille {remainder} dirhams"
    else:
        return f"{int(amount)} dirhams"

def render_invoice_pdf(invoice, client, team, logo_url=None):
    """Generate a PDF invoice using ReportLab"""
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    # Get styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        textColor=colors.HexColor('#2563eb'),
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        textColor=colors.HexColor('#1f2937')
    )
    
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=6
    )
    
    # Build the document content
    story = []
    
    # Header with logo and company info
    header_data = []
    if logo_url and os.path.exists(logo_url):
        try:
            logo = Image(logo_url, width=1*inch, height=1*inch)
            company_info = [
                Paragraph(f"<b>{team.name or 'Your Company'}</b>", heading_style),
                Paragraph(f"ICE: {team.ice or 'N/A'}", normal_style),
                Paragraph(f"IF: {team.if_number or 'N/A'}", normal_style),
            ]
            header_data = [[logo, company_info]]
        except:
            # If logo fails to load, use text only
            header_data = [[
                Paragraph(f"<b>{team.name or 'Your Company'}</b>", title_style)
            ]]
    else:
        header_data = [[
            Paragraph(f"<b>{team.name or 'Your Company'}</b>", title_style)
        ]]
    
    if header_data[0]:
        header_table = Table(header_data, colWidths=[2*inch, 4*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ]))
        story.append(header_table)
        story.append(Spacer(1, 20))
    
    # Invoice title and number
    story.append(Paragraph(f"<b>FACTURE N° {invoice.number}</b>", title_style))
    story.append(Spacer(1, 20))
    
    # Invoice details and client info in two columns
    invoice_date = invoice.created_at.strftime('%d/%m/%Y') if invoice.created_at else datetime.now().strftime('%d/%m/%Y')
    due_date = invoice.due_date.strftime('%d/%m/%Y') if invoice.due_date else 'N/A'
    
    details_data = [
        [
            Paragraph("<b>DÉTAILS DE LA FACTURE</b>", heading_style),
            Paragraph("<b>FACTURER À</b>", heading_style)
        ],
        [
            Paragraph(f"Date: {invoice_date}", normal_style),
            Paragraph(f"<b>{client.name}</b>", normal_style)
        ],
        [
            Paragraph(f"Date d'échéance: {due_date}", normal_style),
            Paragraph(f"ICE: {client.ice or 'N/A'}", normal_style)
        ],
        [
            Paragraph(f"Statut: {invoice.status.upper()}", normal_style),
            Paragraph(f"IF: {client.if_number or 'N/A'}", normal_style)
        ]
    ]
    
    details_table = Table(details_data, colWidths=[3*inch, 3*inch])
    details_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 1, colors.lightgrey),
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
    ]))
    story.append(details_table)
    story.append(Spacer(1, 30))
    
    # Invoice items table
    story.append(Paragraph("<b>ARTICLES</b>", heading_style))
    story.append(Spacer(1, 10))
    
    # Table headers
    items_data = [
        ['Description', 'Quantité', 'Prix unitaire', 'Total']
    ]
    
    # Add invoice items
    for item in invoice.items:
        items_data.append([
            item.description,
            f"{item.quantity}",
            f"{item.unit_price:.2f} {invoice.currency}",
            f"{item.total:.2f} {invoice.currency}"
        ])
    
    # Add total row
    items_data.append(['', '', 'TOTAL:', f"{invoice.amount:.2f} {invoice.currency}"])
    
    items_table = Table(items_data, colWidths=[3*inch, 1*inch, 1.5*inch, 1.5*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (0, 1), (0, -1), 'LEFT'),  # Description column left-aligned
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
        ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#fbbf24')),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    story.append(items_table)
    story.append(Spacer(1, 30))
    
    # Amount in words
    amount_words = number_to_words_french(invoice.amount)
    story.append(Paragraph(f"<b>Montant en lettres:</b> {amount_words}", normal_style))
    story.append(Spacer(1, 20))
    
    # Footer with business info
    if team.address or team.phone or team.email:
        story.append(Spacer(1, 20))
        story.append(Paragraph("<b>COORDONNÉES</b>", heading_style))
        if team.address:
            story.append(Paragraph(f"Adresse: {team.address}", normal_style))
        if team.phone:
            story.append(Paragraph(f"Téléphone: {team.phone}", normal_style))
        if team.email:
            story.append(Paragraph(f"Email: {team.email}", normal_style))
    
    # Business compliance info
    if team.cnie or team.professional_tax_number:
        story.append(Spacer(1, 10))
        if team.cnie:
            story.append(Paragraph(f"CNIE: {team.cnie}", normal_style))
        if team.professional_tax_number:
            story.append(Paragraph(f"Taxe Professionnelle N°: {team.professional_tax_number}", normal_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue() 