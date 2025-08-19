// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// DOM Elements
const loggedInName = document.getElementById('logged-in-name');
const loggedInEmail = document.getElementById('logged-in-email');
const messageContainer = document.getElementById('message-container');
const logoutBtn = document.getElementById('logout-btn');

// Check authentication state
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        updateUIForUser(user);
    } else {
        // No user is signed in
        updateUIForGuest();
    }
});

// Update UI for authenticated user
function updateUIForUser(user) {
    loggedInName.textContent = `Welcome, ${user.displayName || 'User'}`;
    loggedInEmail.textContent = user.email;
    
    // Update user profile in the sidebar
    const userPhoto = document.getElementById('user-photo');
    const userNameDisplay = document.getElementById('user-display-name');
    const userEmailDisplay = document.getElementById('user-email');
    
    if (user.photoURL) {
        userPhoto.src = user.photoURL;
    } else {
        userPhoto.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=random`;
    }
    
    userNameDisplay.textContent = user.displayName || 'User';
    userEmailDisplay.textContent = user.email;
    
    // Show logout button
    if (logoutBtn) logoutBtn.style.display = 'block';
    
    // Populate form fields if needed
    populateUserProfile(user);
}

// Update UI for guest user
function updateUIForGuest() {
    loggedInName.textContent = 'Welcome, Guest';
    loggedInEmail.textContent = 'Not signed in';
    
    // Hide logout button
    if (logoutBtn) logoutBtn.style.display = 'none';
    
    // Redirect to login page if not already there
    if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Sign out function
function signOutUser() {
    firebase.auth().signOut().then(() => {
        // Sign-out successful
        showMessage('Successfully signed out', 'success');
        updateUIForGuest();
    }).catch((error) => {
        // An error happened
        console.error('Sign out error:', error);
        showMessage('Error signing out: ' + error.message, 'error');
    });
}

// Show message to user
function showMessage(message, type = 'info') {
    if (!messageContainer) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Clear previous messages
    messageContainer.innerHTML = '';
    messageContainer.appendChild(messageElement);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}

// Populate user profile in the form
function populateUserProfile(user) {
    // This function should be customized based on your user profile structure
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    
    if (nameField) nameField.value = user.displayName || '';
    if (emailField) emailField.value = user.email || '';
    
    // You can add more fields as needed
}

// Make signOutUser available globally
window.signOutUser = signOutUser;
