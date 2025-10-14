/**
 * CUSTOMERS MODULE (CRM)
 * Handles customer management and display
 */

let customersData = [];
let communicationsData = [];

/**
 * Load customers data
 */
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/crm`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load customers');
        }
        
        const data = await response.json();
        customersData = data.customers || [];
        communicationsData = data.communications || [];
        
        renderCustomersTable();
        renderCommunicationList();
        setupCRMEventListeners();
        
    } catch (error) {
        console.error('Error loading customers:', error);
        customersData = [];
    }
}

/**
 * Render customers table
 */
function renderCustomersTable() {
    const tbody = document.getElementById('customersTableBody');
    if (!tbody) return;
    
    if (customersData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Keine Kunden vorhanden</td></tr>';
        return;
    }
    
    const html = customersData.map(customer => `
        <tr>
            <td><strong>${customer.company_name}</strong></td>
            <td>${customer.contact_person}</td>
            <td>
                <div>${customer.email}</div>
                <div style="font-size: 0.813rem; color: var(--text-secondary);">${customer.phone}</div>
            </td>
            <td><span class="customer-status ${customer.status}">${getCustomerStatusText(customer.status)}</span></td>
            <td>${customer.customer_since ? formatDate(customer.customer_since) : '-'}</td>
            <td>
                <button class="btn-sm" onclick="viewCustomer('${customer.id}')">Details</button>
            </td>
        </tr>
    `).join('');
    
    tbody.innerHTML = html;
}

/**
 * Render communication list
 */
function renderCommunicationList() {
    const container = document.getElementById('communicationList');
    if (!container) return;
    
    if (communicationsData.length === 0) {
        container.innerHTML = '<p class="empty-state">Keine Kommunikation vorhanden</p>';
        return;
    }
    
    const html = communicationsData.map(comm => {
        const customer = customersData.find(c => c.id === comm.customer_id);
        return `
            <div class="communication-item">
                <div class="communication-header">
                    <div>
                        <h3 class="communication-subject">${comm.subject}</h3>
                        <p class="communication-customer">${customer ? customer.company_name : 'Unbekannt'}</p>
                    </div>
                    <span class="communication-channel ${comm.channel}">${getChannelText(comm.channel)}</span>
                </div>
                <p class="communication-description">${comm.description}</p>
                <div class="communication-meta">
                    <span class="communication-date">${formatDateTime(comm.date)}</span>
                    <span class="communication-person">${comm.contact_person}</span>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

/**
 * Setup CRM event listeners
 */
function setupCRMEventListeners() {
    // CRM Tab switching
    const crmTabs = document.querySelectorAll('.crm-tab');
    crmTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            
            // Update active tab
            crmTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.crm-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`crm-${tabName}`).classList.add('active');
        });
    });
    
    // Add customer button
    const btnAddCustomer = document.getElementById('btnAddCustomer');
    if (btnAddCustomer) {
        btnAddCustomer.addEventListener('click', () => {
            alert('Neuer Kunde - Feature in Entwicklung!');
        });
    }
}

/**
 * View customer details
 */
function viewCustomer(customerId) {
    const customer = customersData.find(c => c.id === customerId);
    if (customer) {
        alert(`Kunde: ${customer.company_name}\n\nDetails-Ansicht in Entwicklung!`);
    }
}

/**
 * Get customer status text
 */
function getCustomerStatusText(status) {
    const statusMap = {
        'active': 'Aktiv',
        'potential': 'Potenziell',
        'inactive': 'Inaktiv'
    };
    return statusMap[status] || status;
}

/**
 * Get channel text
 */
function getChannelText(channel) {
    const channelMap = {
        'email': 'E-Mail',
        'phone': 'Telefon',
        'meeting': 'Meeting'
    };
    return channelMap[channel] || channel;
}

/**
 * Format date
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/**
 * Format date and time
 */
function formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

