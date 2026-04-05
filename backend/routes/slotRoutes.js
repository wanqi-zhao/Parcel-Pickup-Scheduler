const express = require('express');
const { getAdminSlots } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Any authenticated user (customer or admin) can view available slots.
router.get('/', protect, getAdminSlots);

module.exports = router;
