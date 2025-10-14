/**
 * MULTI-TENANT LOGIN FUNCTIONALITY
 * Production Management Platform - VBS Complete Production & Resource Management
 * 
 * This script handles multi-tenant user authentication.
 * Each tenant has their own data in separate folders.
 * Username format: username@tenant_id (e.g., j.miller@tenant_001)
 */

// =====================================================
// CONFIGURATION
// =====================================================

const CONFIG = {
    // API Configuration
    useAPI: true, // Set to false to use local JSON files (development)
    apiBaseUrl: 'http://87.106.176.134/api', // Production server
    
    // Legacy JSON paths (if useAPI = false)
    tenantsDataPath: './data/tenants.json',
    
    // Session & Security
    sessionStorageKey: 'vbs_production_management_session',
    dashboardUrl: './dashboard.html',
    maxLoginAttempts: 5,
    lockoutDuration: 300000, // 5 minutes in milliseconds
};

// =====================================================
// STATE MANAGEMENT
// =====================================================

let tenantsData = null;
let currentTenantData = null;
let loginAttempts = 0;
let isLocked = false;

// =====================================================
// DOM ELEMENTS
// =====================================================

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const togglePasswordButton = document.getElementById('togglePassword');
const eyeIcon = document.getElementById('eyeIcon');
const eyeOffIcon = document.getElementById('eyeOffIcon');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const loginButton = document.getElementById('loginButton');
const loginButtonText = document.getElementById('loginButtonText');
const loginSpinner = document.getElementById('loginSpinner');

// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Multi-Tenant login page initialized');
    console.log(`Mode: ${CONFIG.useAPI ? 'API' : 'JSON'}`);
    
    // Check if user is already logged in
    checkExistingSession();
    
    // Load tenants data (only if using JSON mode)
    if (!CONFIG.useAPI) {
        await loadTenantsData();
    } else {
        console.log('Using Backend API - skipping JSON load');
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Check for lockout
    checkLockout();
    
    // Focus on username input
    usernameInput.focus();
});

// =====================================================
// DATA LOADING
// =====================================================

/**
 * Loads tenants registry from the central tenants.json file
 */
async function loadTenantsData() {
    try {
        const response = await fetch(CONFIG.tenantsDataPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        tenantsData = await response.json();
        console.log('Tenants data loaded successfully:', tenantsData.tenants.length, 'tenants');
        
    } catch (error) {
        console.error('Error loading tenants data:', error);
        showError('Error loading tenant data. Please contact support.');
    }
}

/**
 * Loads user data for a specific tenant
 */
async function loadTenantUsers(tenantId) {
    try {
        const tenant = tenantsData.tenants.find(t => t.tenant_id === tenantId);
        
        if (!tenant) {
            throw new Error('Tenant not found');
        }
        
        if (!tenant.is_active) {
            throw new Error('Tenant account is inactive');
        }
        
        const usersPath = `./data/${tenant.data_path}/users.json`;
        const response = await fetch(usersPath);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const userData = await response.json();
        console.log('Users loaded for tenant:', tenantId);
        
        return {
            tenant: tenant,
            users: userData
        };
        
    } catch (error) {
        console.error('Error loading tenant users:', error);
        throw error;
    }
}

// =====================================================
// SESSION MANAGEMENT
// =====================================================

/**
 * Checks if there's an existing valid session
 */
function checkExistingSession() {
    const session = getSession();
    
    if (session && session.username && session.tenant_id && session.expiresAt > Date.now()) {
        console.log('Valid session found for tenant:', session.tenant_id);
        // redirectToDashboard();
        console.log('Session active for user:', session.username, 'in tenant:', session.tenant_id);
    } else {
        clearSession();
    }
}

/**
 * Retrieves the current session from localStorage
 */
function getSession() {
    try {
        const sessionData = localStorage.getItem(CONFIG.sessionStorageKey);
        return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
        console.error('Error reading session:', error);
        return null;
    }
}

/**
 * Stores session data in localStorage
 */
function setSession(userData, tenantData, rememberMe = false) {
    const expirationTime = rememberMe 
        ? Date.now() + (30 * 24 * 60 * 60 * 1000) // 30 days
        : Date.now() + (24 * 60 * 60 * 1000); // 24 hours
    
    const sessionData = {
        userId: userData.user_id,
        username: userData.access_credentials.username,
        tenantId: tenantData.tenant_id,
        tenantName: tenantData.tenant_name,
        userType: userData.user_type,
        role: userData.access_credentials.role,
        permissions: userData.access_credentials.permissions,
        firstName: userData.personal_info.first_name,
        lastName: userData.personal_info.last_name,
        loginTime: new Date().toISOString(),
        expiresAt: expirationTime,
        rememberMe: rememberMe
    };
    
    try {
        localStorage.setItem(CONFIG.sessionStorageKey, JSON.stringify(sessionData));
        console.log('Session created successfully for tenant:', tenantData.tenant_id);
        return true;
    } catch (error) {
        console.error('Error storing session:', error);
        showError('Error saving session.');
        return false;
    }
}

/**
 * Clears the current session
 */
function clearSession() {
    localStorage.removeItem(CONFIG.sessionStorageKey);
    console.log('Session cleared');
}

// =====================================================
// EVENT LISTENERS
// =====================================================

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Toggle password visibility
    togglePasswordButton.addEventListener('click', togglePasswordVisibility);
    
    // Clear error on input
    usernameInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);
    
    // Enter key on inputs
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
}

// =====================================================
// LOGIN LOGIC
// =====================================================

/**
 * Handles the login form submission
 */
async function handleLogin(event) {
    event.preventDefault();
    
    // Check if locked out
    if (isLocked) {
        showError('Too many failed login attempts. Please wait a few minutes.');
        return;
    }
    
    // Get form values
    const fullUsername = usernameInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    
    // Validate inputs
    if (!fullUsername || !password) {
        showError('Please enter username and password.');
        return;
    }
    
    // Validate username@tenant_id format
    if (!fullUsername.includes('@')) {
        showError('Invalid username format. Use: username@tenant_id');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        if (CONFIG.useAPI) {
            // Use Backend API
            await loginWithAPI(fullUsername, password, rememberMe);
        } else {
            // Use local JSON files (legacy)
            await loginWithJSON(fullUsername, password, rememberMe);
        }
        
    } catch (error) {
        // Failed login
        loginAttempts++;
        console.log(`Login failed. Attempt ${loginAttempts} of ${CONFIG.maxLoginAttempts}`);
        
        if (loginAttempts >= CONFIG.maxLoginAttempts) {
            lockAccount();
        } else {
            const attemptsLeft = CONFIG.maxLoginAttempts - loginAttempts;
            showError(`Invalid credentials. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`);
        }
        
        // Clear password field
        passwordInput.value = '';
        passwordInput.focus();
    }
    
    // Hide loading state
    setLoadingState(false);
}

/**
 * Login using Backend API
 */
async function loginWithAPI(username, password, rememberMe) {
    try {
        const response = await fetch(`${CONFIG.apiBaseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (!response.ok || !data.success) {
            throw new Error(data.error?.message || 'Login failed');
        }
        
        // Store session with API token
        const sessionData = {
            token: data.access_token,
            userId: data.user.user_id,
            username: data.user.username,
            tenantId: data.user.tenant_id,
            tenantName: data.user.tenant_name,
            role: data.user.role,
            permissions: data.user.permissions,
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            loginTime: new Date().toISOString(),
            expiresAt: Date.now() + (rememberMe ? 30 : 24) * 24 * 60 * 60 * 1000,
            rememberMe: rememberMe
        };
        
        localStorage.setItem(CONFIG.sessionStorageKey, JSON.stringify(sessionData));
        console.log('Session created with API token');
        
        // Store session for redirect
        window.session = sessionData;
        
        // Reset login attempts
        loginAttempts = 0;
        
        // Show success
        showSuccess();
        
        // Redirect to tenant dashboard
        setTimeout(() => {
            window.location.href = `/dashboards/${sessionData.tenantId}/pages/index.html`;
        }, 1000);
        
    } catch (error) {
        console.error('API login error:', error);
        throw error;
    }
}

/**
 * Login using local JSON files (legacy)
 */
async function loginWithJSON(fullUsername, password, rememberMe) {
    const usernameParts = parseUsername(fullUsername);
    if (!usernameParts) {
        throw new Error('Invalid username format');
    }
    
    const { username, tenantId } = usernameParts;
    
    if (!tenantsData) {
        throw new Error('System not ready');
    }
    
    await delay(500); // Simulate network delay
    
    // Load tenant and users
    const tenantData = await loadTenantUsers(tenantId);
    currentTenantData = tenantData;
    
    // Authenticate user
    const user = authenticateUser(username, password, tenantData.users);
    
    if (!user) {
        throw new Error('Invalid credentials');
    }
    
    // Successful login
    console.log('Login successful (JSON mode)');
    
    // Create session
    const sessionCreated = setSession(user, tenantData.tenant, rememberMe);
    
    if (sessionCreated) {
        loginAttempts = 0;
        showSuccess();
        
        setTimeout(() => {
            redirectToDashboard();
        }, 1000);
    }
}

/**
 * Parses username in format username@tenant_id
 */
function parseUsername(fullUsername) {
    const parts = fullUsername.split('@');
    
    if (parts.length !== 2) {
        return null;
    }
    
    return {
        username: parts[0],
        tenantId: parts[1]
    };
}

/**
 * Authenticates a user against the tenant's user database
 */
function authenticateUser(username, password, usersData) {
    if (!usersData || !usersData.users) {
        return null;
    }
    
    // Find user by username (without @tenant_id part)
    const user = usersData.users.find(u => 
        u.access_credentials && 
        u.access_credentials.username === username + '@' + usersData.tenant_id &&
        u.access_credentials.is_active === true
    );
    
    if (!user) {
        console.log('User not found or inactive:', username);
        return null;
    }
    
    const credentials = user.access_credentials;
    
    // Check if user has a password set
    if (credentials.password) {
        // Validate password (plain text comparison for demo)
        // In production, use proper password hashing (bcrypt, Argon2, etc.)
        if (credentials.password === password) {
            return user;
        } else {
            console.log('Invalid password for user:', username);
            return null;
        }
    } else {
        // If no password is set, accept any non-empty password
        if (password.length > 0) {
            console.log('Warning: User has no password set, accepting any password');
            return user;
        }
    }
    
    return null;
}

// =====================================================
// LOCKOUT MANAGEMENT
// =====================================================

/**
 * Locks the account after too many failed attempts
 */
function lockAccount() {
    isLocked = true;
    const lockoutEnd = Date.now() + CONFIG.lockoutDuration;
    localStorage.setItem('lockout_until', lockoutEnd);
    
    showError(`Too many failed login attempts. Account locked for ${CONFIG.lockoutDuration / 60000} minutes.`);
    
    // Disable form
    usernameInput.disabled = true;
    passwordInput.disabled = true;
    loginButton.disabled = true;
    
    // Set timeout to unlock
    setTimeout(() => {
        unlockAccount();
    }, CONFIG.lockoutDuration);
}

/**
 * Unlocks the account
 */
function unlockAccount() {
    isLocked = false;
    loginAttempts = 0;
    localStorage.removeItem('lockout_until');
    
    // Enable form
    usernameInput.disabled = false;
    passwordInput.disabled = false;
    loginButton.disabled = false;
    
    clearError();
    console.log('Account unlocked');
}

/**
 * Checks if account is currently locked
 */
function checkLockout() {
    const lockoutUntil = localStorage.getItem('lockout_until');
    
    if (lockoutUntil) {
        const lockoutTime = parseInt(lockoutUntil);
        
        if (lockoutTime > Date.now()) {
            isLocked = true;
            const remainingTime = Math.ceil((lockoutTime - Date.now()) / 60000);
            showError(`Account locked. Please try again in ${remainingTime} minute${remainingTime !== 1 ? 's' : ''}.`);
            
            usernameInput.disabled = true;
            passwordInput.disabled = true;
            loginButton.disabled = true;
            
            setTimeout(() => {
                unlockAccount();
            }, lockoutTime - Date.now());
        } else {
            unlockAccount();
        }
    }
}

// =====================================================
// UI HELPERS
// =====================================================

/**
 * Toggles password visibility
 */
function togglePasswordVisibility() {
    const isPassword = passwordInput.type === 'password';
    
    passwordInput.type = isPassword ? 'text' : 'password';
    eyeIcon.style.display = isPassword ? 'none' : 'block';
    eyeOffIcon.style.display = isPassword ? 'block' : 'none';
    
    // Refocus on password input
    passwordInput.focus();
}

/**
 * Shows an error message
 */
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    
    // Shake animation
    errorMessage.classList.add('shake');
    setTimeout(() => {
        errorMessage.classList.remove('shake');
    }, 500);
}

/**
 * Clears the error message
 */
function clearError() {
    errorMessage.style.display = 'none';
    errorText.textContent = '';
}

/**
 * Shows success state
 */
function showSuccess() {
    loginButton.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    loginButtonText.textContent = 'Login successful!';
}

/**
 * Sets the loading state of the form
 */
function setLoadingState(loading) {
    if (loading) {
        loginButton.disabled = true;
        loginButtonText.style.display = 'none';
        loginSpinner.style.display = 'block';
        usernameInput.disabled = true;
        passwordInput.disabled = true;
    } else {
        loginButton.disabled = false;
        loginButtonText.style.display = 'block';
        loginSpinner.style.display = 'none';
        usernameInput.disabled = false;
        passwordInput.disabled = false;
    }
}

/**
 * Redirects to the tenant-specific dashboard
 */
function redirectToDashboard() {
    if (!session || !session.tenantId) {
        console.error('No session data available');
        return;
    }
    
    // Redirect to tenant-specific dashboard
    const dashboardUrl = `/dashboards/${session.tenantId}/pages/index.html`;
    console.log('Redirecting to tenant dashboard:', dashboardUrl);
    
    window.location.href = dashboardUrl;
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Delays execution for specified milliseconds
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Exports session data (for debugging)
 */
function exportSession() {
    const session = getSession();
    console.log('Current session:', session);
    return session;
}

// Make exportSession available globally for debugging
window.exportSession = exportSession;

// =====================================================
// ERROR HANDLING
// =====================================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

