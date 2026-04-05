const Booking = require('../models/Booking');
const Slot = require('../models/Slot');
const User = require('../models/User');

/**
 * Normalize booking status names between frontend and backend.
 * Frontend may send "Confirmed", but the Booking model currently uses "Upcoming".
 */
const normalizeBookingStatus = (status = '') => {
  const value = String(status).trim();

  if (value === 'Confirmed') return 'Upcoming';
  return value;
};

/**
 * Normalize slot status values into a consistent lowercase format.
 */
const normalizeSlotStatus = (status = '') => {
  const value = String(status).trim().toLowerCase();

  if (value === 'available') return 'available';
  if (value === 'full') return 'full';
  if (value === 'closed') return 'closed';

  return '';
};

/**
 * GET /api/admin/stats
 * Dashboard summary cards.
 */
const getAdminStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const completedPickups = await Booking.countDocuments({ status: 'Completed' });

    // "Active slots" means slots that are still usable in the system.
    const activeSlots = await Slot.countDocuments({
      status: { $in: ['available', 'full'] },
    });

    return res.status(200).json({
      totalBookings,
      activeSlots,
      completedPickups,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/admin/bookings
 * Optional query: ?status=Confirmed / Cancelled / Completed / Upcoming
 */
const getAdminBookings = async (req, res) => {
  try {
    const query = {};

    if (req.query.status) {
      const normalizedStatus = normalizeBookingStatus(req.query.status);

      if (!['Upcoming', 'Completed', 'Cancelled'].includes(normalizedStatus)) {
        return res.status(400).json({ message: 'Invalid booking status filter.' });
      }

      query.status = normalizedStatus;
    }

    const bookings = await Booking.find(query)
      .populate('userId', 'firstName lastName email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/admin/bookings/:id
 */
const getAdminBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      'userId',
      'firstName lastName email phone'
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/admin/bookings/:id
 * Supports frontend fields from AdminUpdateBooking.jsx and ManageBookings.jsx.
 */
const updateAdminBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Keep compatibility with both "location" and "address"
    if (req.body.location !== undefined) {
      booking.location = String(req.body.location).trim();
    }

    if (req.body.address !== undefined) {
      booking.location = String(req.body.address).trim();
    }

    if (req.body.dateLabel !== undefined) {
      booking.dateLabel = String(req.body.dateLabel).trim();
    }

    if (req.body.timeLabel !== undefined) {
      booking.timeLabel = String(req.body.timeLabel).trim();
    }

    if (req.body.contactNumber !== undefined) {
      booking.contactNumber = String(req.body.contactNumber).trim();
    }

    // Keep compatibility with both "pickupNote" and "notes"
    if (req.body.pickupNote !== undefined) {
      booking.pickupNote = String(req.body.pickupNote).trim();
    }

    if (req.body.notes !== undefined) {
      booking.pickupNote = String(req.body.notes).trim();
    }

    // Optional status update
    if (req.body.status !== undefined) {
      const normalizedStatus = normalizeBookingStatus(req.body.status);

      if (!['Upcoming', 'Completed', 'Cancelled'].includes(normalizedStatus)) {
        return res.status(400).json({ message: 'Invalid booking status.' });
      }

      booking.status = normalizedStatus;
    }

    const updatedBooking = await booking.save();

    return res.status(200).json(updatedBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/admin/bookings/:id
 */
const deleteAdminBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    await Booking.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/admin/slots
 */
const getAdminSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ createdAt: -1 });
    return res.status(200).json(slots);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/admin/slots
 */
const createAdminSlot = async (req, res) => {
  try {
    const { dateLabel, timeLabel, capacity, status } = req.body;

    if (!dateLabel || !timeLabel || capacity === undefined) {
      return res.status(400).json({
        message: 'Please provide date, time, and capacity.',
      });
    }

    const numericCapacity = Number(capacity);

    if (!Number.isInteger(numericCapacity) || numericCapacity < 0) {
      return res.status(400).json({
        message: 'Capacity must be a whole number greater than or equal to 0.',
      });
    }

    const normalizedStatus = normalizeSlotStatus(status || 'available');

    if (!normalizedStatus) {
      return res.status(400).json({
        message: 'Invalid slot status.',
      });
    }

    const existingSlot = await Slot.findOne({
      dateLabel: String(dateLabel).trim(),
      timeLabel: String(timeLabel).trim(),
    });

    if (existingSlot) {
      return res.status(400).json({
        message: 'A slot with the same date and time already exists.',
      });
    }

    const slot = await Slot.create({
      dateLabel: String(dateLabel).trim(),
      timeLabel: String(timeLabel).trim(),
      capacity: numericCapacity,
      status: normalizedStatus,
    });

    return res.status(201).json(slot);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * PATCH /api/admin/slots/:id
 */
const updateAdminSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found.' });
    }

    if (req.body.dateLabel !== undefined) {
      slot.dateLabel = String(req.body.dateLabel).trim();
    }

    if (req.body.timeLabel !== undefined) {
      slot.timeLabel = String(req.body.timeLabel).trim();
    }

    if (req.body.capacity !== undefined) {
      const numericCapacity = Number(req.body.capacity);

      if (!Number.isInteger(numericCapacity) || numericCapacity < 0) {
        return res.status(400).json({
          message: 'Capacity must be a whole number greater than or equal to 0.',
        });
      }

      slot.capacity = numericCapacity;
    }

    if (req.body.status !== undefined) {
      const normalizedStatus = normalizeSlotStatus(req.body.status);

      if (!normalizedStatus) {
        return res.status(400).json({ message: 'Invalid slot status.' });
      }

      slot.status = normalizedStatus;
    }

    const updatedSlot = await slot.save();

    return res.status(200).json(updatedSlot);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/admin/slots/:id
 */
const deleteAdminSlot = async (req, res) => {
  try {
    const slot = await Slot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({ message: 'Slot not found.' });
    }

    await Slot.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: 'Slot deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE /api/admin/account
 * Deletes the currently logged-in admin account.
 */
const deleteAdminAccount = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found.' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access only.' });
    }

    await User.findByIdAndDelete(req.user._id);

    return res.status(200).json({
      message: 'Admin account deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
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
};