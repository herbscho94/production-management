/**
 * CALENDAR MODULE
 * Handles calendar display and booking management
 */

let currentDate = new Date();
let bookingsData = [];

/**
 * Load calendar view
 */
async function loadCalendar() {
    await loadBookingsData();
    renderCalendar();
    renderBookingsList();
    setupCalendarEventListeners();
}

/**
 * Load bookings data from CRM
 */
async function loadBookingsData() {
    try {
        const response = await fetch(`${API_BASE_URL}/tenants/${TENANT_ID}/crm`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load bookings');
        }
        
        const data = await response.json();
        bookingsData = data.bookings || [];
        
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsData = [];
    }
}

/**
 * Render calendar grid
 */
function renderCalendar() {
    const container = document.getElementById('calendarContainer');
    const monthDisplay = document.getElementById('calendarMonth');
    
    if (!container) return;
    
    // Update month display
    const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                       'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    monthDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    
    // Get calendar data
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday = 0
    
    // Build calendar HTML
    let html = '<div class="calendar-header">';
    const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-name">${day}</div>`;
    });
    html += '</div><div class="calendar-grid">';
    
    // Previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
        html += '<div class="calendar-day other-month"></div>';
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDay = new Date(year, month, day);
        const isToday = currentDay.toDateString() === today.toDateString();
        const bookingsOnDay = getBookingsForDay(currentDay);
        const hasBooking = bookingsOnDay.length > 0;
        
        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${hasBooking ? 'has-booking' : ''}" 
                 data-date="${currentDay.toISOString().split('T')[0]}">
                <div class="calendar-day-number">${day}</div>
                ${hasBooking ? `<div class="calendar-booking-indicator">${'<div class="booking-dot"></div>'.repeat(Math.min(bookingsOnDay.length, 3))}</div>` : ''}
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Get bookings for a specific day
 */
function getBookingsForDay(date) {
    const dateStr = date.toISOString().split('T')[0];
    return bookingsData.filter(booking => {
        const start = new Date(booking.start_date).toISOString().split('T')[0];
        const end = new Date(booking.end_date).toISOString().split('T')[0];
        return dateStr >= start && dateStr <= end;
    });
}

/**
 * Render bookings list
 */
function renderBookingsList() {
    const container = document.getElementById('bookingsList');
    if (!container) return;
    
    if (bookingsData.length === 0) {
        container.innerHTML = '<p class="empty-state">Keine Buchungen vorhanden</p>';
        return;
    }
    
    const html = bookingsData.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <div>
                    <h3 class="booking-title">${booking.event_name}</h3>
                    <p class="booking-subtitle">${booking.event_location}</p>
                </div>
                <span class="booking-status ${booking.status}">${getStatusText(booking.status)}</span>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <span class="booking-detail-label">Zeitraum:</span>
                    <span class="booking-detail-value">${formatDateRange(booking.start_date, booking.end_date)}</span>
                </div>
            </div>
            <div class="booking-equipment">
                ${(booking.equipment_ids || []).map(equipId => {
                    const equipmentData = window.equipmentData || [];
                    const equip = equipmentData.find(e => e.id === equipId);
                    return `<span class="equipment-badge">${equip ? equip.name : equipId}</span>`;
                }).join('')}
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
}

/**
 * Setup calendar event listeners
 */
function setupCalendarEventListeners() {
    // Previous month button
    const btnPrev = document.getElementById('btnPrevMonth');
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    
    // Next month button
    const btnNext = document.getElementById('btnNextMonth');
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
    
    // New booking button
    const btnNewBooking = document.getElementById('btnNewCalendarBooking');
    if (btnNewBooking) {
        btnNewBooking.addEventListener('click', () => {
            alert('Neue Buchung - Feature in Entwicklung!');
        });
    }
}

/**
 * Format date range
 */
function formatDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return `${startDate.toLocaleDateString('de-DE', options)} - ${endDate.toLocaleDateString('de-DE', options)}`;
}

/**
 * Get status text in German
 */
function getStatusText(status) {
    const statusMap = {
        'confirmed': 'Bestätigt',
        'pending': 'Ausstehend',
        'cancelled': 'Storniert'
    };
    return statusMap[status] || status;
}

