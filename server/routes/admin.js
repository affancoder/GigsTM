const express = require('express');
const router = express.Router();
const path = require('path');
const { protect, isAdmin } = require('../middleware/adminAuth');
const {
    login,
    register,
    getMe,
    logout
} = require('../controllers/adminAuthController');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.use(protect);
router.use(isAdmin);

// Admin routes
router.route('/me')
    .get(getMe);

router.route('/logout')
    .get(logout);

// Admin dashboard route
router.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../../GigsTm-V.2/admin-dashboard.html'));
});

module.exports = router;
