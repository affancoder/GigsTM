document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        // Redirect to login if not authenticated
        window.location.href = '/admin-login.html';
        return;
    }
    
    // Fetch dashboard stats
    fetchDashboardStats();
});

async function fetchDashboardStats() {
    try {
        const response = await fetch('/api/admin/dashboard-stats', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }
        
        const data = await response.json();
        
        if (data.success) {
            updateDashboardUI(data.data);
            renderCharts(data.data.charts);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('Failed to load dashboard data', 'error');
    }
}

function updateDashboardUI(data) {
    // Update stats cards
    document.getElementById('total-users').textContent = data.stats.totalUsers.toLocaleString();
    document.getElementById('active-users').textContent = data.stats.activeUsers.toLocaleString();
    document.getElementById('new-users').textContent = data.stats.newUsers.toLocaleString();
    
    // Calculate growth percentage (example calculation)
    const growthPercentage = data.stats.newUsers > 0 ? 
        Math.round((data.stats.newUsers / data.stats.totalUsers) * 100) : 0;
    document.getElementById('growth-percentage').textContent = `${growthPercentage}%`;
}

function renderCharts(chartsData) {
    // Format data for the chart
    const months = [];
    const userCounts = [];
    
    chartsData.usersByMonth.forEach(item => {
        const month = new Date(0, item._id.month - 1).toLocaleString('default', { month: 'short' });
        months.push(`${month} ${item._id.year}`);
        userCounts.push(item.count);
    });
    
    // Initialize chart using Chart.js (make sure it's included in your HTML)
    const ctx = document.getElementById('usersChart').getContext('2d');
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
                        stepSize: 1
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

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 p-4 rounded-md ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`;
    alertDiv.textContent = message;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Logout functionality
document.getElementById('logout-btn')?.addEventListener('click', function() {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin-login.html';
});
