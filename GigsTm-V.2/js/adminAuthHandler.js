// API base URL
const API_BASE_URL = '/api/v1';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('adminLoginForm');
    const errorMessage = document.getElementById('login-error'); // Updated ID to match the new HTML

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Basic validation
            if (!email || !password) {
                errorMessage.textContent = 'Please enter both email and password';
                errorMessage.classList.remove('hidden');
                return;
            }
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Signing in...';
            errorMessage.classList.add('hidden');

            try {
                const response = await fetch(`${API_BASE_URL}/admin/login`, {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(data.message || 'Login failed. Please check your credentials.');
                }

                // Save token to localStorage
                if (data.token) {
                    localStorage.setItem('adminToken', data.token);
                    // Redirect to admin dashboard
                    window.location.href = '/admin/dashboard';
                } else {
                    throw new Error('No authentication token received');
                }
            } catch (error) {
                console.error('Login error:', error);
                errorMessage.textContent = error.message || 'Login failed. Please try again.';
                errorMessage.classList.remove('hidden');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

    // Check if user is already logged in
    const checkAdminAuth = () => {
        const token = localStorage.getItem('adminToken');
        if (token && window.location.pathname === '/admin-login.html') {
            // Verify token is still valid
            // If valid, redirect to dashboard
            window.location.href = '/admin/dashboard.html';
        } else if (!token && window.location.pathname !== '/admin-login.html') {
            // If no token and not on login page, redirect to login
            window.location.href = '/admin-login.html';
        }
    };

    // Check auth status on page load
    checkAdminAuth();
});

// Logout function
const adminLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login.html';
};
