/* ===========================================
   API Configuration and Helper Functions
   Easy to understand - just change API_URL if needed!
   =========================================== */

// Change this URL to your backend server address
const API_URL = 'http://localhost:5000/api';

/**
 * Make an API request
 * This function handles all API calls to the backend
 *
 * @param {string} endpoint - The API endpoint (e.g., '/auth/login')
 * @param {string} method - HTTP method (GET, POST, PATCH, DELETE)
 * @param {object} data - Data to send (for POST/PATCH requests)
 * @param {boolean} useAuth - Whether to include authentication token
 * @returns {Promise} - Returns the response data
 */
async function apiRequest(endpoint, method = 'GET', data = null, useAuth = true) {
    // Build the request options
    const options = {
        method: method,
        headers: {}
    };

    // Add authentication token if needed
    if (useAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            options.headers['Authorization'] = token;
        }
    }

    // Add data to request body (for POST/PATCH)
    if (data) {
        // Check if data is FormData (for file uploads)
        if (data instanceof FormData) {
            options.body = data;
            // Don't set Content-Type header - browser will set it automatically with boundary
        } else {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(data);
        }
    }

    try {
        // Make the actual request
        const response = await fetch(API_URL + endpoint, options);

        // Parse the response
        const result = await response.json();

        // Check if request was successful
        if (!response.ok) {
            throw new Error(result.message || 'Something went wrong');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============ AUTHENTICATION API ============

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 */
async function loginUser(email, password) {
    const result = await apiRequest('/auth/login', 'POST', { email, password }, false);
    return result;
}

// ============ CUSTOMER API ============

/**
 * Get customer profile
 */
async function getCustomerProfile() {
    return await apiRequest('/customer/profile');
}

/**
 * Get customer tickets
 */
async function getCustomerTickets() {
    return await apiRequest('/customer/tickets');
}

/**
 * Get customer ticket counts (for dashboard)
 */
async function getCustomerTicketCounts() {
    const [open, closed, unassigned, uat] = await Promise.all([
        apiRequest('/customer/tickets/open/count'),
        apiRequest('/customer/tickets/closed/count'),
        apiRequest('/customer/tickets/unassigned/count'),
        apiRequest('/customer/tickets/uat/count')
    ]);
    return { open, closed, unassigned, uat };
}

/**
 * Create a new ticket (customer)
 * @param {FormData} formData - Ticket data including files
 */
async function createCustomerTicket(formData) {
    return await apiRequest('/customer/ticket', 'POST', formData);
}

/**
 * Get ticket by ID (customer view)
 * @param {number} ticketId - Ticket ID
 */
async function getCustomerTicket(ticketId) {
    return await apiRequest('/customer/view-ticket/' + ticketId);
}

/**
 * Update customer ticket
 * @param {number} ticketId - Ticket ID
 * @param {object} data - Updated ticket data
 */
async function updateCustomerTicket(ticketId, data) {
    return await apiRequest('/Customer/updateTicket/' + ticketId, 'PATCH', data);
}

/**
 * Get ticket comments
 * @param {number} ticketId - Ticket ID
 */
async function getTicketComments(ticketId) {
    return await apiRequest('/customer/ticket/' + ticketId + '/comments');
}

/**
 * Add customer comment
 * @param {number} ticketId - Ticket ID
 * @param {object} commentData - Comment data {subject, text}
 */
async function addCustomerComment(ticketId, commentData) {
    return await apiRequest('/customer/tickets/' + ticketId + '/customer-comment', 'POST', commentData);
}

// ============ MANAGER API ============

/**
 * Get pending tickets for manager approval
 */
async function getManagerPendingTickets() {
    return await apiRequest('/manager/pending-tickets');
}

/**
 * Get approved tickets (manager)
 */
async function getManagerApprovedTickets() {
    return await apiRequest('/manager/tickets/approved');
}

/**
 * Get rejected tickets (manager)
 */
async function getManagerRejectedTickets() {
    return await apiRequest('/manager/tickets/rejected');
}

/**
 * Get customers under manager
 */
async function getManagerCustomers() {
    return await apiRequest('/manager/customers');
}

/**
 * Get ticket by ID (manager view)
 * @param {number} ticketId - Ticket ID
 */
async function getManagerTicket(ticketId) {
    return await apiRequest('/manager/ticket/' + ticketId);
}

/**
 * Approve or reject ticket
 * @param {number} ticketId - Ticket ID
 * @param {string} action - 'Approved' or 'Rejected'
 * @param {string} reason - Rejection reason (required if rejected)
 */
async function approveRejectTicket(ticketId, action, reason = '') {
    return await apiRequest('/manager/ticket/' + ticketId + '/approve', 'PATCH', {
        approval_status: action,
        rejection_reason: reason
    });
}

// ============ AGENT API ============

/**
 * Get unassigned tickets (for agents to pick)
 */
async function getAgentUnassignedTickets() {
    return await apiRequest('/agent/unassigned-tickets');
}

/**
 * Get agent's assigned tickets
 */
async function getAgentAssignedTickets() {
    return await apiRequest('/agent/my-tickets');
}

/**
 * Pick/assign a ticket to self
 * @param {number} ticketId - Ticket ID
 */
async function pickTicket(ticketId) {
    return await apiRequest('/agent/pick/' + ticketId, 'POST');
}

/**
 * Get ticket by ID (agent view)
 * @param {number} ticketId - Ticket ID
 */
async function getAgentTicket(ticketId) {
    return await apiRequest('/agent/ticket/' + ticketId);
}

/**
 * Update agent ticket
 * @param {number} ticketId - Ticket ID
 * @param {object} data - Updated ticket data
 */
async function updateAgentTicket(ticketId, data) {
    return await apiRequest('/agent/tickets/' + ticketId, 'PATCH', data);
}

/**
 * Add agent comment
 * @param {number} ticketId - Ticket ID
 * @param {object} commentData - Comment data {subject, text}
 */
async function addAgentComment(ticketId, commentData) {
    return await apiRequest('/agent/tickets/' + ticketId + '/agent-comment', 'POST', commentData);
}

// ============ ADMIN API ============

/**
 * Add new user (admin only)
 * @param {object} userData - User data
 */
async function addUser(userData) {
    return await apiRequest('/admin/add-user', 'POST', userData);
}

// ============ DELIVERY LEAD API ============

/**
 * Get delivery lead tickets
 */
async function getDeliveryLeadTickets() {
    return await apiRequest('/delivery-lead/tickets');
}

/**
 * Get agents under delivery lead
 */
async function getDeliveryLeadAgents() {
    return await apiRequest('/delivery-lead/users/agents');
}

/**
 * Assign ticket to agent
 * @param {number} ticketId - Ticket ID
 * @param {number} agentId - Agent ID
 */
async function assignTicketToAgent(ticketId, agentId) {
    return await apiRequest('/delivery-lead/ticket/' + ticketId + '/assign', 'POST', { agentId });
}

/**
 * Get delivery lead team tickets
 */
async function getDLTeamTickets() {
    return await apiRequest('/delivery-lead/dl-team-tickets');
}

/**
 * Get delivery lead ticket by ID
 * @param {number} ticketId - Ticket ID
 */
async function getDeliveryLeadTicket(ticketId) {
    return await apiRequest('/delivery-lead/ticket/' + ticketId);
}

/**
 * Update delivery lead ticket
 * @param {number} ticketId - Ticket ID
 * @param {object} data - Updated ticket data
 */
async function updateDeliveryLeadTicket(ticketId, data) {
    return await apiRequest('/delivery-lead/updateTicket/' + ticketId, 'PATCH', data);
}

/**
 * Add delivery lead comment
 * @param {number} ticketId - Ticket ID
 * @param {object} commentData - Comment data {subject, text}
 */
async function addDeliveryLeadComment(ticketId, commentData) {
    return await apiRequest('/delivery-lead/tickets/' + ticketId + '/dl-comment', 'POST', commentData);
}
