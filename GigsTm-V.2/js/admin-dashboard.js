// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = '/admin-login.html';
        return;
    }

    // Set admin name if available
    const adminName = localStorage.getItem('adminName');
    if (adminName) {
        const adminNameElement = document.querySelector('.admin-name');
        if (adminNameElement) {
            adminNameElement.textContent = adminName;
        }
    }

    // Initialize the dashboard
    initializeDashboard();

    // Logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminName');
            window.location.href = '/admin-login.html';
        });
    }
});

async function initializeDashboard() {
    try {
        // Load dashboard data
        const data = await fetchDashboardData();
        
        // Update UI with the fetched data
        updateDashboardUI(data);
        
        // Initialize charts
        if (data.charts) {
            renderCharts(data.charts);
        }
        
        // Load recent activities
        await loadRecentActivities();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showAlert('Failed to load dashboard data', 'error');
    }
}

async function fetchDashboardData() {
    const token = localStorage.getItem('adminToken');
    const response = await fetch('/api/v1/auth/admin/dashboard-stats', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        credentials: 'include'  // Important for cookies/sessions if using them
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
    }
    
    const result = await response.json();
    if (!result.success) {
        throw new Error(result.message || 'Failed to load dashboard data');
    }
    
    return result.data;
}

function updateDashboardUI(data) {
    if (!data || !data.stats) return;
    
    const stats = data.stats;
    
    // Update stats cards
    if (stats.totalUsers !== undefined) {
        document.getElementById('total-users').textContent = stats.totalUsers.toLocaleString();
    }
    
    if (stats.activeUsers !== undefined) {
        document.getElementById('active-users').textContent = stats.activeUsers.toLocaleString();
    }
    
    if (stats.newUsers !== undefined) {
        document.getElementById('new-users').textContent = stats.newUsers.toLocaleString();
        
        // Calculate and display growth percentage
        if (stats.totalUsers > 0) {
            const growthPercentage = Math.round((stats.newUsers / stats.totalUsers) * 100);
            const growthElement = document.getElementById('growth-percentage');
            if (growthElement) {
                growthElement.innerHTML = `
                    <i class="fas fa-arrow-up mr-1"></i> ${growthPercentage}%
                    <span class="text-xs text-gray-500 ml-1">vs last period</span>
                `;
            }
        }
    }
    
    // Update other stats if available
    if (stats.pendingRequests !== undefined) {
        document.getElementById('pending-requests').textContent = stats.pendingRequests.toLocaleString();
    }
    
    if (stats.issuesCount !== undefined) {
        document.getElementById('issues-count').textContent = stats.issuesCount.toLocaleString();
    }
}

function renderCharts(chartsData) {
    if (!chartsData || !chartsData.usersByMonth) return;
    
    const ctx = document.getElementById('usersChart').getContext('2d');
    
    // Format data for the chart
    const months = [];
    const userCounts = [];
    
    chartsData.usersByMonth.forEach(item => {
        const month = new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' });
        months.push(`${month} ${item._id.year}`);
        userCounts.push(item.count);
    });
    
    // Initialize chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'New Users',
                data: userCounts,
                borderColor: 'rgba(79, 70, 229, 1)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        drawBorder: false
                    },
                    ticks: {
                        precision: 0
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

async function loadRecentActivities() {
    try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/admin/recent-activities', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch recent activities');
        }
        
        const result = await response.json();
        if (result.success && result.data) {
            updateRecentActivitiesUI(result.data);
        }
    } catch (error) {
        console.error('Error loading recent activities:', error);
        // Don't show error to user for this non-critical feature
    }
}

function updateRecentActivitiesUI(activities) {
    const container = document.getElementById('recentActivities');
    if (!container) return;
    
    if (!activities || activities.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">No recent activities</p>';
        return;
    }
    
    const activitiesHtml = activities.map(activity => `
        <div class="flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm">
                    <span class="font-semibold">${activity.user}</span> ${activity.action}
                </p>
                <p class="text-xs text-gray-500">${formatTimeAgo(activity.timestamp)}</p>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = activitiesHtml;
}

function getActivityIcon(activityType) {
    const icons = {
        'user': 'user-plus',
        'gig': 'briefcase',
        'payment': 'credit-card',
        'message': 'envelope',
        'system': 'cog'
    };
    return icons[activityType] || 'bell';
}

function formatTimeAgo(timestamp) {
    if (!timestamp) return '';
    
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return interval === 1 ? `${interval} ${unit} ago` : `${interval} ${unit}s ago`;
        }
    }
    
    return 'Just now';
}

function showAlert(message, type = 'error') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 p-4 rounded-md ${
        type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 
        type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' :
        'bg-blue-100 text-blue-700 border border-blue-300'
    }`;
    alertDiv.role = 'alert';
    
    alertDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'error' ? 'fa-exclamation-circle' : 
                type === 'success' ? 'fa-check-circle' : 'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remove alert after 5 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
