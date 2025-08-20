const express = require('express');
const router = express.Router();
const { saveProfile, getProfile, getAllProfiles } = require('../controllers/profileController');
const { deleteProfile } = require('../controllers/deleteProfile');
const { auth } = require('../middleware/auth');

// GET /api/profile/all - Get all users' profiles (public endpoint)
router.get('/all', getAllProfiles);

// Protected routes (require authentication)
router.use(auth);

// GET /api/profile - Get user profile
router.get('/', getProfile);

// POST /api/profile - Save or update user profile
router.post('/', saveProfile);

// DELETE /api/profile/:id - Delete user profile (admin only)
router.delete('/:id', deleteProfile);

module.exports = router;
