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
const { getDashboardStats } = require('../controllers/adminController');

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

// Dashboard stats API - Protected by admin middleware
router.get('/dashboard-stats', protect, isAdmin, getDashboardStats);

module.exports = router;
