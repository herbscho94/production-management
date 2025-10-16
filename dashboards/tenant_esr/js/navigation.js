/**
 * NAVIGATION MODULE
 * Handles view switching and navigation
 */

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
});

/**
 * Initialize navigation system
 */
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-view]');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const viewName = item.getAttribute('data-view');
            switchView(viewName);
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

/**
 * Switch to a different view
 * @param {string} viewName - Name of the view to switch to
 */
function switchView(viewName) {
    // Hide all views
    const allViews = document.querySelectorAll('.view-container');
    allViews.forEach(view => view.classList.remove('active'));
    
    // Show selected view
    const targetView = document.getElementById(`view-${viewName}`);
    if (targetView) {
        targetView.classList.add('active');
        
        // Load data for the view if needed
        loadViewData(viewName);
    }
}

/**
 * Load data for a specific view
 * @param {string} viewName - Name of the view
 */
function loadViewData(viewName) {
    switch(viewName) {
        case 'overview':
            // Already loaded on page load
            break;
        case 'calendar':
            if (typeof loadCalendar === 'function') {
                loadCalendar();
            }
            break;
        case 'equipment':
            if (typeof loadEquipmentGrid === 'function') {
                loadEquipmentGrid();
            }
            break;
        case 'customers':
            if (typeof loadCustomers === 'function') {
                loadCustomers();
            }
            break;
        case 'accounting':
            // Load both quotes and invoices for accounting view
            if (typeof loadQuotes === 'function') {
                loadQuotes();
            }
            if (typeof loadInvoices === 'function') {
                loadInvoices();
            }
            break;
        case 'worktime':
            // Worktime view - Coming soon
            break;
    }
}

