const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    // Display labels used directly by the current frontend UI.
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

    // Number of available places for this slot.
    capacity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Slot status used by admin pages.
    status: {
      type: String,
      enum: ['available', 'full', 'closed'],
      default: 'available',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate slots with the same date and time.
slotSchema.index({ dateLabel: 1, timeLabel: 1 }, { unique: true });

module.exports = mongoose.model('Slot', slotSchema);