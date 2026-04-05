const express = require('express');
const {
  getAdminStats,
  getAdminBookings,
  getAdminBookingById,
  updateAdminBooking,
  deleteAdminBooking,
  getAdminSlots,
  createAdminSlot,
  updateAdminSlot,
  deleteAdminSlot,
  deleteAdminAccount,
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * Dashboard statistics
 * GET /api/admin/stats
 */
router.get('/stats', protect, adminOnly, getAdminStats);

/**
 * Admin booking management
 * GET    /api/admin/bookings
 * GET    /api/admin/bookings/:id
 * PATCH  /api/admin/bookings/:id
 * DELETE /api/admin/bookings/:id
 */
router.get('/bookings', protect, adminOnly, getAdminBookings);
router.get('/bookings/:id', protect, adminOnly, getAdminBookingById);
router.patch('/bookings/:id', protect, adminOnly, updateAdminBooking);
router.delete('/bookings/:id', protect, adminOnly, deleteAdminBooking);

/**
 * Admin slot management
 * GET    /api/admin/slots
 * POST   /api/admin/slots
 * PATCH  /api/admin/slots/:id
 * DELETE /api/admin/slots/:id
 */
router.get('/slots', protect, adminOnly, getAdminSlots);
router.post('/slots', protect, adminOnly, createAdminSlot);
router.patch('/slots/:id', protect, adminOnly, updateAdminSlot);
router.delete('/slots/:id', protect, adminOnly, deleteAdminSlot);

/**
 * Admin account delete
 * DELETE /api/admin/account
 */
router.delete('/account', protect, adminOnly, deleteAdminAccount);

module.exports = router;