from weasyprint import HTML, CSS
from jinja2 import Template
import os
from datetime import datetime

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
    # Optimized single-page invoice template
    html_template = Template('''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice #{{ invoice.number }}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.4;
                color: #1a202c;
                font-size: 12px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 10px;
                min-height: 100vh;
            }
            
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.25);
                overflow: hidden;
                position: relative;
            }
            
            /* Compact Header */
            .invoice-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 24px;
                position: relative;
            }
            
            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                gap: 24px;
            }
            
            .company-info {
                flex: 1;
            }
            
            .company-logo-container {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .company-logo {
                width: 40px;
                height: 40px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 12px;
                font-size: 18px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
            
            .company-logo-img {
                width: 40px;
                height: 40px;
                border-radius: 12px;
                margin-right: 12px;
                object-fit: cover;
                border: 2px solid rgba(255, 255, 255, 0.3);
            }
            
            .company-name {
                font-size: 22px;
                font-weight: 800;
                margin-bottom: 2px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .company-tagline {
                font-size: 12px;
                opacity: 0.9;
                font-weight: 300;
            }
            
            .invoice-meta {
                text-align: right;
                background: rgba(255, 255, 255, 0.15);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                padding: 16px;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .invoice-title {
                font-size: 28px;
                font-weight: 800;
                margin-bottom: 4px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            .invoice-number {
                font-size: 14px;
                font-weight: 600;
                opacity: 0.9;
                margin-bottom: 8px;
            }
            
            .invoice-date {
                font-size: 12px;
                font-weight: 400;
                opacity: 0.8;
            }
            
            /* Compact Body */
            .invoice-body {
                padding: 20px;
            }
            
            /* Compact Cards Layout */
            .info-cards {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
                margin-bottom: 20px;
            }
            
            .info-card {
                background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                border-radius: 12px;
                padding: 16px;
                border: 1px solid #e2e8f0;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                position: relative;
            }
            
            .info-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px 12px 0 0;
            }
            
            .card-title {
                font-size: 10px;
                font-weight: 700;
                color: #667eea;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 10px;
            }
            
            .card-content {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .card-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .card-label {
                font-weight: 500;
                color: #64748b;
                font-size: 11px;
            }
            
            .card-value {
                font-weight: 600;
                color: #1e293b;
                font-size: 12px;
            }
            
            .client-name {
                font-size: 16px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 10px;
            }
            
            /* Compact Status Badge */
            .status-badge {
                display: inline-flex;
                align-items: center;
                padding: 4px 8px;
                border-radius: 16px;
                font-size: 9px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .status-paid {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
            }
            
            .status-unpaid {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
            }
            
            .status-overdue {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
            }
            
            /* Compact Service Table */
            .services-section {
                margin: 16px 0;
            }
            
            .section-title {
                font-size: 16px;
                font-weight: 700;
                color: #1e293b;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .section-title::before {
                content: '';
                width: 3px;
                height: 16px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 2px;
            }
            
            .service-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                border: 1px solid #e2e8f0;
                margin-bottom: 16px;
            }
            
            .service-table th {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 10px;
                text-align: left;
                font-weight: 600;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .service-table th:last-child {
                text-align: right;
            }
            
            .service-table td {
                padding: 10px;
                border-bottom: 1px solid #f1f5f9;
                background: white;
                font-size: 12px;
            }
            
            .service-table tbody tr:last-child td {
                border-bottom: none;
            }
            
            .service-table .description {
                font-weight: 600;
                color: #1e293b;
            }
            
            .service-table .quantity,
            .service-table .unit-price {
                text-align: center;
                color: #64748b;
                font-weight: 500;
            }
            
            .service-table .total {
                text-align: right;
                font-weight: 700;
                color: #1e293b;
            }
            
            /* Compact Total Section */
            .total-section {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                border-radius: 12px;
                padding: 16px;
                margin: 16px 0;
                color: white;
            }
            
            .total-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                font-size: 12px;
            }
            
            .total-row:last-child {
                margin-bottom: 0;
                padding-bottom: 0;
                border-bottom: none;
                font-size: 16px;
                font-weight: 800;
            }
            
            .total-label {
                font-weight: 500;
                opacity: 0.9;
            }
            
            .total-value {
                font-weight: 700;
            }
            
            /* Compact Amount in Words */
            .amount-words {
                background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                border: 2px solid #0ea5e9;
                border-radius: 12px;
                padding: 12px;
                margin: 12px 0;
                text-align: center;
                font-size: 11px;
            }
            
            .amount-words-text {
                font-weight: 600;
                color: #0c4a6e;
                line-height: 1.3;
            }
            
            .signature-area {
                margin-top: 8px;
                text-align: right;
                padding-top: 8px;
                border-top: 1px dashed #0ea5e9;
                font-size: 10px;
            }
            
            /* Compact Footer */
            .invoice-footer {
                background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                color: white;
                padding: 16px;
                position: relative;
            }
            
            .invoice-footer::before {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 3px;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            }
            
            .footer-title {
                font-size: 12px;
                font-weight: 700;
                margin-bottom: 10px;
                color: #67e8f9;
            }
            
            .footer-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-bottom: 10px;
            }
            
            .footer-item {
                display: flex;
                gap: 4px;
                align-items: center;
                font-size: 10px;
            }
            
            .footer-label {
                font-weight: 600;
                color: #94a3b8;
                min-width: 40px;
            }
            
            .footer-value {
                color: white;
                font-weight: 500;
            }
            
            .tax-note {
                background: rgba(103, 232, 249, 0.1);
                border: 1px solid #67e8f9;
                border-radius: 8px;
                padding: 8px;
                margin-top: 8px;
                text-align: center;
            }
            
            .tax-note-text {
                color: #67e8f9;
                font-size: 9px;
                font-weight: 600;
                font-style: italic;
            }
            
            /* Print Optimizations */
            @media print {
                body {
                    padding: 0;
                    background: white;
                }
                .invoice-container {
                    max-width: none;
                    border-radius: 0;
                    box-shadow: none;
                }
            }
            
            @page {
                size: A4;
                margin: 0.3in;
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            <!-- Compact Header -->
            <div class="invoice-header">
                <div class="header-content">
                    <div class="company-info">
                        <div class="company-logo-container">
                            {% if logo_url %}
                            <img src="{{ logo_url }}" alt="Company Logo" class="company-logo-img" />
                            {% else %}
                            <div class="company-logo">🧾</div>
                            {% endif %}
                            <div class="company-details">
                                <div class="company-name">{{ team.name }}</div>
                                <div class="company-tagline">Professional Invoice Services</div>
                            </div>
                        </div>
                    </div>
                    <div class="invoice-meta">
                        <div class="invoice-title">FACTURE</div>
                        <div class="invoice-number">#{{ "{:06d}".format(invoice.number|int) }}</div>
                        <div class="invoice-date">{{ invoice.created_at.strftime('%d/%m/%Y') if invoice.created_at else now.strftime('%d/%m/%Y') }}</div>
                    </div>
                </div>
            </div>
            
            <!-- Compact Body -->
            <div class="invoice-body">
                <!-- Client & Invoice Info Cards -->
                <div class="info-cards">
                    <div class="info-card">
                        <div class="card-title">Facturé à</div>
                        <div class="client-name">{{ client.name }}</div>
                        <div class="card-content">
                            {% if client.phone %}
                            <div class="card-row">
                                <span class="card-label">Téléphone</span>
                                <span class="card-value">{{ client.phone }}</span>
                            </div>
                            {% endif %}
                            {% if client.ice %}
                            <div class="card-row">
                                <span class="card-label">ICE</span>
                                <span class="card-value">{{ client.ice }}</span>
                            </div>
                            {% endif %}
                            {% if client.if_number %}
                            <div class="card-row">
                                <span class="card-label">IF</span>
                                <span class="card-value">{{ client.if_number }}</span>
                            </div>
                            {% endif %}
                        </div>
                    </div>
                    
                    <div class="info-card">
                        <div class="card-title">Détails de la facture</div>
                        <div class="card-content">
                            <div class="card-row">
                                <span class="card-label">Statut</span>
                                <span class="status-badge status-{{ invoice.status }}">{{ invoice.status|title }}</span>
                            </div>
                            <div class="card-row">
                                <span class="card-label">Date d'émission</span>
                                <span class="card-value">{{ invoice.created_at.strftime('%d/%m/%Y') if invoice.created_at else now.strftime('%d/%m/%Y') }}</span>
                            </div>
                            {% if invoice.due_date %}
                            <div class="card-row">
                                <span class="card-label">Date d'échéance</span>
                                <span class="card-value">{{ invoice.due_date.strftime('%d/%m/%Y') }}</span>
                            </div>
                            {% endif %}
                            <div class="card-row">
                                <span class="card-label">Devise</span>
                                <span class="card-value">{{ invoice.currency }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Services Section -->
                <div class="services-section">
                    <h2 class="section-title">Services & Prestations</h2>
                    <table class="service-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th style="text-align: center;">Qté</th>
                                <th style="text-align: center;">Prix unitaire</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {% if invoice.items %}
                                {% for item in invoice.items %}
                                <tr>
                                    <td class="description">{{ item.description }}</td>
                                    <td class="quantity">{{ "{:g}".format(item.quantity) }}</td>
                                    <td class="unit-price">{{ "{:,.2f}".format(item.unit_price) }}</td>
                                    <td class="total">{{ "{:,.2f}".format(item.total) }}</td>
                                </tr>
                                {% endfor %}
                            {% else %}
                                <tr>
                                    <td class="description">Prestation de service</td>
                                    <td class="quantity">1</td>
                                    <td class="unit-price">{{ "{:,.2f}".format(invoice.amount) }}</td>
                                    <td class="total">{{ "{:,.2f}".format(invoice.amount) }}</td>
                                </tr>
                            {% endif %}
                        </tbody>
                    </table>
                </div>
                
                <!-- Compact Total Section -->
                <div class="total-section">
                    <div class="total-row">
                        <span class="total-label">Sous-total HT</span>
                        <span class="total-value">{{ "{:,.2f}".format(invoice.amount) }} MAD</span>
                    </div>
                    <div class="total-row">
                        <span class="total-label">TVA (Exonéré*)</span>
                        <span class="total-value">0.00 MAD</span>
                    </div>
                    <div class="total-row">
                        <span class="total-label">TOTAL À PAYER</span>
                        <span class="total-value">{{ "{:,.2f}".format(invoice.amount) }} MAD</span>
                    </div>
                </div>
                
                <!-- Compact Amount in Words -->
                <div class="amount-words">
                    <div class="amount-words-text">
                        ARRÊTÉ LA PRÉSENTE FACTURE À :<br>
                        <strong>{{ "{:,.2f}".format(invoice.amount) }} {{ invoice.currency }} ({{ number_to_words_french(invoice.amount) }})</strong>
                    </div>
                    <div class="signature-area">
                        <strong>Signature & Cachet</strong>
                    </div>
                </div>
            </div>
            
            <!-- Compact Footer -->
            <div class="invoice-footer">
                <div class="footer-title">Informations légales & Contact</div>
                
                <div class="footer-grid">
                    <div class="footer-item">
                        <span class="footer-label">Auto-entrepreneur :</span>
                        <span class="footer-value">{{ team.name or "Entrepreneur" }}</span>
                    </div>
                    <div class="footer-item">
                        <span class="footer-label">ICE :</span>
                        <span class="footer-value">{{ team.ice or "Non défini" }}</span>
                    </div>
                    <div class="footer-item">
                        <span class="footer-label">IF :</span>
                        <span class="footer-value">{{ team.if_number or "Non défini" }}</span>
                    </div>
                    {% if team.cnie %}
                    <div class="footer-item">
                        <span class="footer-label">CNIE :</span>
                        <span class="footer-value">{{ team.cnie }}</span>
                    </div>
                    {% endif %}
                    {% if team.professional_tax_number %}
                    <div class="footer-item">
                        <span class="footer-label">Taxe Prof. :</span>
                        <span class="footer-value">{{ team.professional_tax_number }}</span>
                    </div>
                    {% endif %}
                    <div class="footer-item">
                        <span class="footer-label">Téléphone :</span>
                        <span class="footer-value">{{ team.phone or "Non défini" }}</span>
                    </div>
                    <div class="footer-item">
                        <span class="footer-label">Email :</span>
                        <span class="footer-value">{{ team.email or "Non défini" }}</span>
                    </div>
                    <div class="footer-item">
                        <span class="footer-label">Adresse :</span>
                        <span class="footer-value">{{ team.address or "Non définie" }}</span>
                    </div>
                </div>
                
                <div class="tax-note">
                    <div class="tax-note-text">
                        *Exonéré de TVA selon l'article 91-II-L du Code Général des Impôts
                    </div>
                </div>
            </div>
        </div>
    </body>
    </html>
    ''')
    
    # Render the template with current timestamp
    html = html_template.render(
        invoice=invoice, 
        client=client, 
        team=team, 
        logo_url=f"file://{logo_url}" if logo_url else None,
        now=datetime.now(),
        number_to_words_french=number_to_words_french
    )
    
    # Generate PDF with optimized settings
    pdf = HTML(string=html).write_pdf(
        stylesheets=[],
        presentational_hints=True,
        optimize_images=True
    )
    
    return pdf 