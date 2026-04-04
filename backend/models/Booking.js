const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // Link each booking to the signed-in customer.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Human-readable booking number shown in the UI.
    bookingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    // These labels match the current front-end UI wording.
    dateLabel: {
      type: String,
      required: true,
      trim: true,
    },
    timeLabel: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
      default: 'Parcel Counter A',
    },

    status: {
      type: String,
      enum: ['Upcoming', 'Completed', 'Cancelled'],
      default: 'Upcoming',
      index: true,
    },

    contactNumber: {
      type: String,
      trim: true,
      default: '',
    },

    pickupNote: {
      type: String,
      trim: true,
      default: '',
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
