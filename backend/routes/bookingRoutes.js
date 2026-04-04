const express = require('express');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  trackBookingByBookingId,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, getMyBookings);

router.get('/track/:bookingId', protect, trackBookingByBookingId);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.patch('/:id/cancel', protect, cancelBooking);

module.exports = router;
