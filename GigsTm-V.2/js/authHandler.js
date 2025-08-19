// API base URL
const API_BASE_URL = 'http://localhost:3001/api';
// expose for inline scripts that may check window.API_BASE_URL
window.API_BASE_URL = API_BASE_URL;

// Check if user is logged in
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Redirect to login if not authenticated
function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Handle user login
async function handleLogin(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }

        // Store token and user data (keep both keys for compatibility)
        localStorage.setItem('token', data.token);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true, data };
    } catch (error) {
        console.error('Login error:', error);
        return { 
            success: false, 
            message: error.message || 'An error occurred during login' 
        };
    }
}

// Handle user registration
async function handleRegister(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed');
        }

        // Store token and user data (keep both keys for compatibility)
        localStorage.setItem('token', data.token);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return { success: true, data };
    } catch (error) {
        console.error('Registration error:', error);
        return { 
            success: false, 
            message: error.message || 'An error occurred during registration' 
        };
    }
}

// Handle user logout
function handleLogout() {
    // Clear all auth data
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    
    // Redirect to home page
    window.location.href = 'index.html';
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Update UI based on auth state
function updateAuthUI() {
    const user = getCurrentUser();
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const userInfo = document.getElementById('user-info');
    const userGreeting = document.getElementById('user-greeting');

    if (user) {
        if (userGreeting) {
            userGreeting.textContent = `Hello, ${user.fullName || user.email}`;
        }
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'block';
        if (userInfo) userInfo.style.display = 'block';
    } else {
        if (loginLink) loginLink.style.display = 'block';
        if (logoutLink) logoutLink.style.display = 'none';
        if (userInfo) userInfo.style.display = 'none';
    }
}

// Initialize auth state when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a protected page
    const protectedPages = ['userform.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update UI
    updateAuthUI();
    
    // Add logout handler
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Expose a namespaced API to avoid collisions with inline handlers
window.Auth = {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated,
    requireAuth,
    getCurrentUser,
    updateAuthUI
};
