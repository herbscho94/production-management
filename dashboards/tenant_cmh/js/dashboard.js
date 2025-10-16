/**
 * CLIPMYHORSE.TV - Dashboard JavaScript
 * Tenant ID: tenant_cmh
 */

const API_BASE_URL = 'http://87.106.176.134/api'; // Production server
const TENANT_ID = 'tenant_cmh';

// Session management
let session = null;
let token = null;
let dashboardConfig = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    console.log('CMH Dashboard initializing...');
    
    // Check authentication
    checkAuth();
    
    // Load dashboard config first
    await loadDashboardConfig();
    
    // Load dashboard data
    await loadDashboardData();
    
    // Setup event listeners
    setupEventListeners();
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
 * Load dashboard configuration
 */
async function loadDashboardConfig() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/dashboard-config`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            dashboardConfig = await response.json();
            console.log('Dashboard config loaded:', dashboardConfig);
            
            // Apply branding from config
            applyBranding();
        }
    } catch (error) {
        console.error('Error loading dashboard config:', error);
    }
}

/**
 * Apply branding from dashboard config
 */
function applyBranding() {
    if (!dashboardConfig || !dashboardConfig.branding) return;
    
    const branding = dashboardConfig.branding;
    
    // Update company name in header
    const brandName = document.getElementById('tenantBrandName');
    if (brandName) {
        brandName.textContent = branding.company_name || 'Production Management';
    }
    
    // Update subtitle
    const subtitle = document.querySelector('.brand-subtitle');
    if (subtitle) {
        subtitle.textContent = branding.platform_subtitle || 'Production Management Platform';
    }
    
    // Update logo
    const logoImg = document.querySelector('.brand-logo img');
    const logoFallback = document.querySelector('.brand-logo div');
    if (logoImg && branding.logo_url) {
        logoImg.src = branding.logo_url;
        logoImg.style.display = 'block';
        if (logoFallback) logoFallback.style.display = 'none';
    } else if (logoFallback && branding.logo_fallback_text) {
        logoFallback.textContent = branding.logo_fallback_text;
        logoFallback.style.display = 'block';
    }
    
    // Update footer
    const footerName = document.getElementById('tenantFooterName');
    if (footerName) {
        footerName.textContent = branding.company_name || 'VBS Visionary Broadcast Services';
    }
    
    // Update page title
    document.title = `${branding.company_name} - ${branding.platform_subtitle}`;
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
        // Load equipment (cameras)
        await loadEquipment();
        
        // Load statistics
        await loadStatistics();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
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
        
        // Calculate live streams (for demo, set to 0)
        document.getElementById('liveStreams').textContent = '0';
        
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
        tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No cameras found. Add your first camera!</td></tr>';
        return;
    }
    
    tbody.innerHTML = equipment.map(eq => `
        <tr>
            <td><strong>${eq.name}</strong></td>
            <td>${eq.type}</td>
            <td><span class="status-badge status-${eq.status}">${eq.status}</span></td>
            <td>${eq.location}</td>
            <td>
                <button class="btn-sm" onclick="viewEquipment(${eq.id})">View</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Load statistics
 */
async function loadStatistics() {
    // Set team members from session
    document.getElementById('teamMembers').textContent = '12';
    
    // For now, set placeholder values
    document.getElementById('totalProductions').textContent = '0';
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
    alert(`View camera ${equipmentId} - Feature coming soon!`);
}

