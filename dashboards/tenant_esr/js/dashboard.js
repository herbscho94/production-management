/**
 * EVENTS GREEN RENTALS - Dashboard JavaScript
 * LED Wall Management System
 * Tenant ID: tenant_esr
 */

const API_BASE_URL = 'http://87.106.176.134/api'; // Production server
const TENANT_ID = 'tenant_esr';

// Session management
let session = null;
let token = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Events Green Rentals Dashboard initializing...');
    
    // Check authentication
    checkAuth();
    
    // Load dashboard data
    await loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial CRM data for global access
    await loadInitialCRMData();
});

/**
 * Check if user is authenticated
 */
function checkAuth() {
    const sessionData = localStorage.getItem('vbs_production_management_session');
    
    if (!sessionData) {
        redirectToLogin();
        return;
    }
    
    try {
        session = JSON.parse(sessionData);
        token = session.token;
        
        // Check if session is expired
        if (session.expiresAt < Date.now()) {
            console.log('Session expired');
            redirectToLogin();
            return;
        }
        
        // Check if correct tenant
        if (session.tenantId !== TENANT_ID) {
            console.error('Wrong tenant! Expected:', TENANT_ID, 'Got:', session.tenantId);
            alert('Access denied. You do not belong to this tenant.');
            redirectToLogin();
            return;
        }
        
        // Display user info
        displayUserInfo();
        
    } catch (error) {
        console.error('Session error:', error);
        redirectToLogin();
    }
}

/**
 * Display user information
 */
function displayUserInfo() {
    const userName = document.getElementById('userName');
    if (userName && session) {
        userName.textContent = `${session.firstName} ${session.lastName}`;
    }
}

/**
 * Load dashboard data from API
 */
async function loadDashboardData() {
    try {
        // Load equipment
        await loadEquipment();
        
        // Load statistics
        await loadStatistics();
        
        // Load activity feed
        await loadActivityFeed();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

/**
 * Load initial CRM data for global access
 */
async function loadInitialCRMData() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/crm`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            // Make data globally available for other modules
            window.customersData = data.customers || [];
            window.communicationsData = data.communications || [];
            window.quotesData = data.quotes || [];
            window.invoicesData = data.invoices || [];
            window.bookingsData = data.bookings || [];
        }
    } catch (error) {
        console.error('Error loading CRM data:', error);
    }
}

/**
 * Load equipment from API
 */
async function loadEquipment() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/equipment`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load equipment');
        }
        
        const data = await response.json();
        const equipment = data.data || [];
        
        // Update stats
        document.getElementById('totalEquipment').textContent = equipment.length;
        
        const available = equipment.filter(e => e.status === 'available').length;
        document.getElementById('availableEquipment').textContent = available;
        
        // Display in table
        displayEquipment(equipment);
        
    } catch (error) {
        console.error('Error loading equipment:', error);
        if (error.message.includes('401')) {
            redirectToLogin();
        }
    }
}

/**
 * Display equipment in table
 */
function displayEquipment(equipment) {
    const tbody = document.getElementById('equipmentTableBody');
    
    if (!equipment || equipment.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Keine LED-Wände vorhanden</td></tr>';
        return;
    }
    
    tbody.innerHTML = equipment.map(eq => `
        <tr>
            <td><strong>${eq.name}</strong></td>
            <td>${eq.type}</td>
            <td><span class="status-badge status-${eq.status}">${getStatusTextGerman(eq.status)}</span></td>
            <td>${eq.location}</td>
            <td><strong>${eq.daily_rental_rate ? formatCurrency(eq.daily_rental_rate) : '-'}</strong></td>
            <td>
                <button class="btn-sm" onclick="viewEquipment('${eq.id}')">Details</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Get status text in German
 */
function getStatusTextGerman(status) {
    const statusMap = {
        'available': 'Verfügbar',
        'rented': 'Vermietet',
        'maintenance': 'Wartung'
    };
    return statusMap[status] || status;
}

/**
 * Load statistics
 */
async function loadStatistics() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/crm`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Update bookings count
            const activeBookings = (data.bookings || []).filter(b => b.status === 'confirmed').length;
            document.getElementById('activeBookings').textContent = activeBookings;
            
            // Update customers count
            const activeCustomers = (data.customers || []).filter(c => c.status === 'active').length;
            document.getElementById('activeCustomers').textContent = activeCustomers;
        }
    } catch (error) {
        console.error('Error loading statistics:', error);
        document.getElementById('activeBookings').textContent = '0';
        document.getElementById('activeCustomers').textContent = '0';
    }
}

/**
 * Load activity feed
 */
async function loadActivityFeed() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/crm`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            const activities = [];
            
            // Add recent quotes
            (data.quotes || []).slice(0, 3).forEach(quote => {
                activities.push({
                    type: 'quote',
                    date: new Date(quote.date),
                    title: `Angebot ${quote.quote_number} erstellt`,
                    description: `Für ${getCustomerNameFromData(quote.customer_id, data.customers)}`,
                    icon: 'document',
                    color: 'blue'
                });
            });
            
            // Add recent communications
            (data.communications || []).slice(0, 3).forEach(comm => {
                activities.push({
                    type: 'communication',
                    date: new Date(comm.date),
                    title: comm.subject,
                    description: `${comm.channel} - ${getCustomerNameFromData(comm.customer_id, data.customers)}`,
                    icon: 'chat',
                    color: 'green'
                });
            });
            
            // Sort by date
            activities.sort((a, b) => b.date - a.date);
            
            // Render activities
            if (activities.length > 0) {
                activityList.innerHTML = activities.slice(0, 5).map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon bg-${activity.color}">
                            ${getActivityIcon(activity.icon)}
                        </div>
                        <div class="activity-content">
                            <p class="activity-title">${activity.title}</p>
                            <p class="activity-time">${activity.description} · ${formatActivityTime(activity.date)}</p>
                        </div>
                    </div>
                `).join('');
            }
        }
    } catch (error) {
        console.error('Error loading activity feed:', error);
    }
}

/**
 * Get customer name from data
 */
function getCustomerNameFromData(customerId, customers) {
    const customer = (customers || []).find(c => c.id === customerId);
    return customer ? customer.company_name : 'Unbekannt';
}

/**
 * Get activity icon SVG
 */
function getActivityIcon(type) {
    const icons = {
        'document': '<svg viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" stroke-width="2"/><path d="M14 2V8H20" stroke="currentColor" stroke-width="2"/></svg>',
        'chat': '<svg viewBox="0 0 24 24" fill="none"><path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" stroke-width="2"/></svg>',
        'clock': '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2"/></svg>'
    };
    return icons[type] || icons['clock'];
}

/**
 * Format activity time
 */
function formatActivityTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
        return `vor ${diffMins} Min.`;
    } else if (diffHours < 24) {
        return `vor ${diffHours} Std.`;
    } else if (diffDays < 7) {
        return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    } else {
        return date.toLocaleDateString('de-DE');
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // New booking button
    const btnNewBooking = document.getElementById('btnNewBooking');
    if (btnNewBooking) {
        btnNewBooking.addEventListener('click', () => {
            // Switch to calendar view
            switchView('calendar');
            // Update active nav
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-view') === 'calendar') {
                    item.classList.add('active');
                }
            });
        });
    }
    
    // Equipment button
    const btnAddEquipment = document.getElementById('btnAddEquipment');
    if (btnAddEquipment) {
        btnAddEquipment.addEventListener('click', () => {
            alert('LED-Wand hinzufügen - Feature in Entwicklung!');
        });
    }
    
    // Quick Actions
    setupQuickActions();
    
    // View links
    setupViewLinks();
}

/**
 * Setup quick action buttons
 */
function setupQuickActions() {
    const quickActionBooking = document.getElementById('quickActionBooking');
    if (quickActionBooking) {
        quickActionBooking.addEventListener('click', () => {
            switchToView('calendar');
        });
    }
    
    const quickActionQuote = document.getElementById('quickActionQuote');
    if (quickActionQuote) {
        quickActionQuote.addEventListener('click', () => {
            switchToView('quotes');
        });
    }
    
    const quickActionCustomer = document.getElementById('quickActionCustomer');
    if (quickActionCustomer) {
        quickActionCustomer.addEventListener('click', () => {
            switchToView('customers');
        });
    }
    
    const quickActionInvoice = document.getElementById('quickActionInvoice');
    if (quickActionInvoice) {
        quickActionInvoice.addEventListener('click', () => {
            switchToView('invoices');
        });
    }
}

/**
 * Setup view links
 */
function setupViewLinks() {
    const viewLinks = document.querySelectorAll('[data-view-link]');
    viewLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view-link');
            switchToView(view);
        });
    });
}

/**
 * Switch to a view (wrapper for navigation.js)
 */
function switchToView(viewName) {
    if (typeof switchView === 'function') {
        switchView(viewName);
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-view') === viewName) {
                item.classList.add('active');
            }
        });
    }
}

/**
 * Load equipment grid view
 */
async function loadEquipmentGrid() {
    const container = document.getElementById('equipmentGrid');
    if (!container) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/equipment`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load equipment');
        }
        
        const data = await response.json();
        const equipment = data.data || [];
        
        if (equipment.length === 0) {
            container.innerHTML = '<p class="empty-state">Keine LED-Wände vorhanden</p>';
            return;
        }
        
        const html = equipment.map(eq => `
            <div class="equipment-card">
                <div class="equipment-card-header">
                    <h3 class="equipment-card-title">${eq.name}</h3>
                    <span class="status-badge status-${eq.status}">${eq.status}</span>
                </div>
                <div class="equipment-card-body">
                    <div class="equipment-spec">
                        <span class="spec-label">Typ:</span>
                        <span class="spec-value">${eq.type}</span>
                    </div>
                    <div class="equipment-spec">
                        <span class="spec-label">Hersteller:</span>
                        <span class="spec-value">${eq.manufacturer || '-'}</span>
                    </div>
                    <div class="equipment-spec">
                        <span class="spec-label">Modell:</span>
                        <span class="spec-value">${eq.model || '-'}</span>
                    </div>
                    <div class="equipment-spec">
                        <span class="spec-label">Standort:</span>
                        <span class="spec-value">${eq.location}</span>
                    </div>
                    ${eq.daily_rental_rate ? `
                        <div class="equipment-price">
                            <span class="price-label">Tagespreis:</span>
                            <span class="price-value">${formatCurrency(eq.daily_rental_rate)} / Tag</span>
                        </div>
                    ` : ''}
                </div>
                <div class="equipment-card-footer">
                    <button class="btn-sm" onclick="viewEquipment('${eq.id}')">Details</button>
                    <button class="btn-sm primary" onclick="rentEquipment('${eq.id}')">Vermieten</button>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading equipment grid:', error);
        container.innerHTML = '<p class="empty-state">Fehler beim Laden der Equipment-Daten</p>';
    }
}

/**
 * Rent equipment
 */
function rentEquipment(equipmentId) {
    alert(`LED-Wand ${equipmentId} vermieten - Feature in Entwicklung!`);
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

/**
 * Logout function
 */
function logout() {
    localStorage.removeItem('vbs_production_management_session');
    redirectToLogin();
}

/**
 * Redirect to login page
 */
function redirectToLogin() {
    window.location.href = '/index.html';
}

/**
 * View equipment details (placeholder)
 */
function viewEquipment(equipmentId) {
    alert(`View equipment ${equipmentId} - Feature coming soon!`);
}

