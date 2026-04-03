const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    // User role separates customer and admin access.
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },

    // Basic identity fields.
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    // Email can be optional for customers, but it is useful for login and profile.
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    // Phone is mainly used by customer registration and login.
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    // Admin ID is only used by admin accounts.
    adminId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    university: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving a new or updated user.
userSchema.pre('save', async function savePassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare a plain password with the stored hashed password.
userSchema.methods.matchPassword = async function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
