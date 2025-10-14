/**
 * COMMUNICATION MODULE
 * Handles communication tracking and display
 * (This is loaded as part of the CRM module)
 */

/**
 * Add new communication entry
 */
function addCommunication(customerId, data) {
    // TODO: Implement API call to add communication
    console.log('Add communication for customer:', customerId, data);
    alert('Kommunikation hinzufügen - Feature in Entwicklung!');
}

/**
 * Edit communication entry
 */
function editCommunication(commId, data) {
    // TODO: Implement API call to edit communication
    console.log('Edit communication:', commId, data);
    alert('Kommunikation bearbeiten - Feature in Entwicklung!');
}

/**
 * Delete communication entry
 */
function deleteCommunication(commId) {
    if (confirm('Möchten Sie diesen Kommunikationseintrag wirklich löschen?')) {
        // TODO: Implement API call to delete communication
        console.log('Delete communication:', commId);
        alert('Kommunikation löschen - Feature in Entwicklung!');
    }
}

/**
 * Filter communications by customer
 */
function filterCommunicationsByCustomer(customerId) {
    if (!communicationsData) return [];
    return communicationsData.filter(comm => comm.customer_id === customerId);
}

/**
 * Filter communications by date range
 */
function filterCommunicationsByDateRange(startDate, endDate) {
    if (!communicationsData) return [];
    return communicationsData.filter(comm => {
        const commDate = new Date(comm.date);
        return commDate >= new Date(startDate) && commDate <= new Date(endDate);
    });
}

/**
 * Filter communications by channel
 */
function filterCommunicationsByChannel(channel) {
    if (!communicationsData) return [];
    return communicationsData.filter(comm => comm.channel === channel);
}

/**
 * Get communication statistics
 */
function getCommunicationStats() {
    if (!communicationsData) return {};
    
    const stats = {
        total: communicationsData.length,
        byChannel: {},
        byCustomer: {},
        recent: communicationsData.slice(0, 5).sort((a, b) => new Date(b.date) - new Date(a.date))
    };
    
    // Count by channel
    communicationsData.forEach(comm => {
        stats.byChannel[comm.channel] = (stats.byChannel[comm.channel] || 0) + 1;
        stats.byCustomer[comm.customer_id] = (stats.byCustomer[comm.customer_id] || 0) + 1;
    });
    
    return stats;
}

/**
 * Export communications to CSV
 */
function exportCommunicationsToCSV() {
    if (!communicationsData || communicationsData.length === 0) {
        alert('Keine Kommunikationsdaten zum Exportieren vorhanden');
        return;
    }
    
    // TODO: Implement CSV export
    alert('CSV-Export - Feature in Entwicklung!');
}

