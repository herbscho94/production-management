/**
 * QUOTES MODULE
 * Handles quote management and display
 */

let quotesData = [];
let currentQuoteFilter = 'all';

/**
 * Load quotes data
 */
async function loadQuotes() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/crm`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load quotes');
        }
        
        const data = await response.json();
        quotesData = data.quotes || [];
        
        renderQuotes();
        setupQuotesEventListeners();
        
    } catch (error) {
        console.error('Error loading quotes:', error);
        quotesData = [];
    }
}

/**
 * Render quotes grid
 */
function renderQuotes(filter = 'all') {
    const container = document.getElementById('quotesGrid');
    if (!container) return;
    
    let filteredQuotes = quotesData;
    if (filter !== 'all') {
        filteredQuotes = quotesData.filter(quote => quote.status === filter);
    }
    
    if (filteredQuotes.length === 0) {
        container.innerHTML = '<p class="empty-state">Keine Angebote vorhanden</p>';
        return;
    }
    
    const html = filteredQuotes.map(quote => `
        <div class="quote-card" onclick="viewQuote('${quote.id}')">
            <div class="quote-header">
                <div>
                    <h3 class="quote-number">${quote.quote_number}</h3>
                    <p class="quote-customer">${getCustomerName(quote.customer_id)}</p>
                </div>
                <span class="quote-status ${quote.status}">${getQuoteStatusText(quote.status)}</span>
            </div>
            <div class="quote-details">
                <div class="quote-detail-row">
                    <span class="quote-detail-label">Datum:</span>
                    <span class="quote-detail-value">${formatDate(quote.date)}</span>
                </div>
                <div class="quote-detail-row">
                    <span class="quote-detail-label">Gültig bis:</span>
                    <span class="quote-detail-value">${formatDate(quote.valid_until)}</span>
                </div>
                <div class="quote-detail-row">
                    <span class="quote-detail-label">Zeitraum:</span>
                    <span class="quote-detail-value">${quote.rental_period.days} Tage</span>
                </div>
            </div>
            <div class="quote-equipment-list">
                ${(quote.equipment || []).map(eq => {
                    const equipmentData = window.equipmentData || [];
                    const equip = equipmentData.find(e => e.id === eq.equipment_id);
                    const equipName = equip ? equip.name : (eq.name || eq.equipment_id);
                    return `<div class="quote-equipment-item">${equipName} (${eq.quantity}x)</div>`;
                }).join('')}
            </div>
            <div class="quote-total">
                <span class="quote-total-label">Gesamt:</span>
                <span class="quote-total-value">${formatCurrency(quote.pricing.total, quote.pricing.currency)}</span>
            </div>
            <div class="quote-actions" onclick="event.stopPropagation()">
                <button class="quote-btn" onclick="editQuote('${quote.id}')">Bearbeiten</button>
                <button class="quote-btn primary" onclick="sendQuote('${quote.id}')">Senden</button>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

/**
 * Setup quotes event listeners
 */
function setupQuotesEventListeners() {
    // Filter buttons
    const filterBtns = document.querySelectorAll('#view-quotes .filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            currentQuoteFilter = filter;
            
            // Update active filter
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Render filtered quotes
            renderQuotes(filter);
        });
    });
    
    // Create quote button
    const btnCreateQuote = document.getElementById('btnCreateQuote');
    if (btnCreateQuote) {
        btnCreateQuote.addEventListener('click', () => {
            alert('Neues Angebot - Feature in Entwicklung!');
        });
    }
}

/**
 * View quote details
 */
function viewQuote(quoteId) {
    const quote = quotesData.find(q => q.id === quoteId);
    if (quote) {
        alert(`Angebot: ${quote.quote_number}\n\nDetails-Ansicht in Entwicklung!`);
    }
}

/**
 * Edit quote
 */
function editQuote(quoteId) {
    alert(`Angebot ${quoteId} bearbeiten - Feature in Entwicklung!`);
}

/**
 * Send quote
 */
function sendQuote(quoteId) {
    alert(`Angebot ${quoteId} senden - Feature in Entwicklung!`);
}

/**
 * Get customer name by ID
 */
function getCustomerName(customerId) {
    // This assumes customersData is loaded from customers.js
    if (typeof customersData !== 'undefined') {
        const customer = customersData.find(c => c.id === customerId);
        return customer ? customer.company_name : 'Unbekannt';
    }
    return 'Unbekannt';
}

/**
 * Get quote status text
 */
function getQuoteStatusText(status) {
    const statusMap = {
        'draft': 'Entwurf',
        'sent': 'Gesendet',
        'accepted': 'Angenommen',
        'rejected': 'Abgelehnt'
    };
    return statusMap[status] || status;
}

/**
 * Format currency
 */
function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('de-DE', { 
        style: 'currency', 
        currency: currency 
    }).format(amount);
}

