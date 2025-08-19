const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth'); // You'll need to implement this

// Protected routes (require authentication)
router.post('/', auth, profileController.saveProfile);
router.get('/', auth, profileController.getProfile);

module.exports = router;
