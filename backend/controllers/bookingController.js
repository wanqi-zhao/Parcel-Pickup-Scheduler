const Booking = require('../models/Booking');

const allowedStatuses = ['Upcoming', 'Completed', 'Cancelled'];

// Create a readable booking number such as BK-001.
const generateBookingId = async () => {
  let bookingId = '';
  let exists = true;

  while (exists) {
    const randomNumber = Math.floor(Math.random() * 1000) + 1;
    bookingId = `BK-${String(randomNumber).padStart(3, '0')}`;
    exists = await Booking.findOne({ bookingId });
  }

  return bookingId;
};

// Create a new booking for the currently signed-in user.
const createBooking = async (req, res) => {
  try {
    const {
      dateLabel,
      timeLabel,
      location,
      contactNumber,
      pickupNote,
    } = req.body;

    if (!dateLabel || !timeLabel) {
      return res.status(400).json({
        message: 'Please provide the booking date and time.',
      });
    }

    const booking = await Booking.create({
      userId: req.user._id,
      bookingId: await generateBookingId(),
      dateLabel: String(dateLabel).trim(),
      timeLabel: String(timeLabel).trim(),
      location: location ? String(location).trim() : 'Parcel Counter A',
      contactNumber: contactNumber ? String(contactNumber).trim() : '',
      pickupNote: pickupNote ? String(pickupNote).trim() : '',
      status: 'Upcoming',
    });

    return res.status(201).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all bookings for the signed-in user, optionally filtered by status.
const getMyBookings = async (req, res) => {
  try {
    const query = { userId: req.user._id };

    if (req.query.status) {
      const normalizedStatus = String(req.query.status).trim();

      if (!allowedStatuses.includes(normalizedStatus)) {
        return res.status(400).json({
          message: 'Invalid booking status filter.',
        });
      }

      query.status = normalizedStatus;
    }

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get a single booking that belongs to the signed-in user.
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Allow the customer to edit selected booking fields.
const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status !== 'Upcoming') {
      return res.status(400).json({
        message: 'Only upcoming bookings can be updated.',
      });
    }

    booking.dateLabel = req.body.dateLabel ? String(req.body.dateLabel).trim() : booking.dateLabel;
    booking.timeLabel = req.body.timeLabel ? String(req.body.timeLabel).trim() : booking.timeLabel;
    booking.location = req.body.location ? String(req.body.location).trim() : booking.location;
    booking.contactNumber = req.body.contactNumber !== undefined
      ? String(req.body.contactNumber).trim()
      : booking.contactNumber;
    booking.pickupNote = req.body.pickupNote !== undefined
      ? String(req.body.pickupNote).trim()
      : booking.pickupNote;

    if (req.body.status) {
      const normalizedStatus = String(req.body.status).trim();

      if (!allowedStatuses.includes(normalizedStatus)) {
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

// Mark one booking as cancelled.
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    booking.status = 'Cancelled';
    const updatedBooking = await booking.save();

    return res.status(200).json(updatedBooking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Find a booking by its visible booking number for the tracking page.
const trackBookingByBookingId = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: String(req.params.bookingId).trim(),
      userId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  trackBookingByBookingId,
};
