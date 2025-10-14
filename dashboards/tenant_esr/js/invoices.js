/**
 * INVOICES MODULE
 * Handles invoice management and display
 */

let invoicesData = [];
let currentInvoiceFilter = 'all';

/**
 * Load invoices data
 */
async function loadInvoices() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/crm`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load invoices');
        }
        
        const data = await response.json();
        invoicesData = data.invoices || [];
        
        renderInvoices();
        setupInvoicesEventListeners();
        
    } catch (error) {
        console.error('Error loading invoices:', error);
        invoicesData = [];
    }
}

/**
 * Render invoices grid
 */
function renderInvoices(filter = 'all') {
    const container = document.getElementById('invoicesGrid');
    if (!container) return;
    
    let filteredInvoices = invoicesData;
    if (filter !== 'all') {
        filteredInvoices = invoicesData.filter(invoice => {
            if (filter === 'overdue') {
                return invoice.payment_status === 'pending' && new Date(invoice.due_date) < new Date();
            }
            return invoice.payment_status === filter;
        });
    }
    
    if (filteredInvoices.length === 0) {
        container.innerHTML = '<p class="empty-state">Keine Rechnungen vorhanden</p>';
        return;
    }
    
    const html = filteredInvoices.map(invoice => {
        const isOverdue = invoice.payment_status === 'pending' && new Date(invoice.due_date) < new Date();
        
        return `
            <div class="invoice-card" onclick="viewInvoice('${invoice.id}')">
                <div class="invoice-header">
                    <div>
                        <h3 class="invoice-number">${invoice.invoice_number}</h3>
                        <p class="invoice-customer">${getCustomerName(invoice.customer_id)}</p>
                    </div>
                    <span class="invoice-payment-status ${isOverdue ? 'overdue' : invoice.payment_status}">
                        ${getPaymentStatusText(invoice.payment_status, isOverdue)}
                    </span>
                </div>
                <div class="invoice-details">
                    <div class="invoice-detail-row">
                        <span class="invoice-detail-label">Rechnungsdatum:</span>
                        <span class="invoice-detail-value">${formatDate(invoice.date)}</span>
                    </div>
                    <div class="invoice-detail-row">
                        <span class="invoice-detail-label">Fällig am:</span>
                        <span class="invoice-detail-value">${formatDate(invoice.due_date)}</span>
                    </div>
                </div>
                <div class="invoice-items">
                    ${invoice.items.map(item => `
                        <div class="invoice-item">
                            <span class="invoice-item-description">${item.description}</span>
                            <span class="invoice-item-amount">${formatCurrency(item.total, invoice.currency)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="invoice-totals">
                    <div class="invoice-total-row">
                        <span class="invoice-total-label">Zwischensumme:</span>
                        <span class="invoice-total-value">${formatCurrency(invoice.subtotal, invoice.currency)}</span>
                    </div>
                    <div class="invoice-total-row">
                        <span class="invoice-total-label">MwSt (${invoice.tax_rate}%):</span>
                        <span class="invoice-total-value">${formatCurrency(invoice.tax_amount, invoice.currency)}</span>
                    </div>
                    <div class="invoice-total-row grand-total">
                        <span class="invoice-total-label grand">Gesamt:</span>
                        <span class="invoice-total-value grand">${formatCurrency(invoice.total, invoice.currency)}</span>
                    </div>
                </div>
                ${isOverdue ? `
                    <div class="invoice-due-warning overdue">
                        <svg class="invoice-due-warning-icon" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 8V12" stroke="currentColor" stroke-width="2"/>
                            <circle cx="12" cy="16" r="1" fill="currentColor"/>
                        </svg>
                        Überfällig seit ${getDaysOverdue(invoice.due_date)} Tagen
                    </div>
                ` : ''}
                <div class="invoice-actions" onclick="event.stopPropagation()">
                    <button class="invoice-btn" onclick="downloadInvoice('${invoice.id}')">
                        <svg class="invoice-btn-icon" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2"/>
                            <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 15V3" stroke="currentColor" stroke-width="2"/>
                        </svg>
                        PDF
                    </button>
                    ${invoice.payment_status === 'pending' ? `
                        <button class="invoice-btn primary" onclick="markAsPaid('${invoice.id}')">
                            Als bezahlt markieren
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

/**
 * Setup invoices event listeners
 */
function setupInvoicesEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('#view-invoices .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            currentInvoiceFilter = filter;
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Render filtered invoices
            renderInvoices(filter);
        });
    });
    
    // Create invoice button
    const btnCreateInvoice = document.getElementById('btnCreateInvoice');
    if (btnCreateInvoice) {
        btnCreateInvoice.addEventListener('click', () => {
            alert('Neue Rechnung - Feature in Entwicklung!');
        });
    }
}

/**
 * View invoice details
 */
function viewInvoice(invoiceId) {
    const invoice = invoicesData.find(inv => inv.id === invoiceId);
    if (invoice) {
        alert(`Rechnung: ${invoice.invoice_number}\n\nDetails-Ansicht in Entwicklung!`);
    }
}

/**
 * Download invoice as PDF
 */
function downloadInvoice(invoiceId) {
    alert(`Rechnung ${invoiceId} als PDF herunterladen - Feature in Entwicklung!`);
}

/**
 * Mark invoice as paid
 */
function markAsPaid(invoiceId) {
    if (confirm('Möchten Sie diese Rechnung als bezahlt markieren?')) {
        alert(`Rechnung ${invoiceId} als bezahlt markieren - Feature in Entwicklung!`);
    }
}

/**
 * Get payment status text
 */
function getPaymentStatusText(status, isOverdue = false) {
    if (isOverdue) return 'Überfällig';
    
    const statusMap = {
        'pending': 'Ausstehend',
        'paid': 'Bezahlt',
        'partially_paid': 'Teilweise bezahlt',
        'overdue': 'Überfällig'
    };
    return statusMap[status] || status;
}

/**
 * Calculate days overdue
 */
function getDaysOverdue(dueDate) {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today - due;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

