const express = require('express');
const router = express.Router();
const { saveProfile, getProfile } = require('../controllers/profileController');
const { auth } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(auth);

// GET /api/profile - Get user profile
router.get('/', getProfile);

// POST /api/profile - Save or update user profile
router.post('/', saveProfile);

module.exports = router;
