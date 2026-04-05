const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{8,15}$/;

const normalizePhone = (value = '') => value.replace(/[\s\-()]/g, '');

const isValidEmail = (value = '') => emailRegex.test(String(value).trim().toLowerCase());
const isValidPhone = (value = '') => phoneRegex.test(normalizePhone(String(value).trim()));

// Generate a JWT for authenticated users.
const generateToken = (userId, role = 'customer') => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'dev_fallback_secret',
    { expiresIn: '7d' }
  );
};

/**
 * Legacy compatibility function for the provided Mocha sample tests.
 * Do not use this as the main customer registration handler.
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'dev_fallback_secret',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/**
 * Register a new customer for the actual Parcel Pickup Scheduler app.
 */
const registerCustomer = async (req, res) => {
  try {
    const { firstName, lastName, phone, email, password } = req.body;

    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({
        message: 'Please enter your first name, last name, phone number, and password.',
      });
    }

    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email ? String(email).trim().toLowerCase() : '';

    if (!isValidPhone(normalizedPhone)) {
      return res.status(400).json({
        message: 'Please enter a valid phone number.',
      });
    }

    if (normalizedEmail && !isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please enter a valid email address.',
      });
    }

    const duplicateConditions = [{ phone: normalizedPhone }];
    if (normalizedEmail) {
      duplicateConditions.push({ email: normalizedEmail });
    }

    const existingCustomer = await User.findOne({
      role: 'customer',
      $or: duplicateConditions,
    });

    if (existingCustomer) {
      return res.status(400).json({
        message: 'A customer account with these details already exists.',
      });
    }

    const customer = await User.create({
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      phone: normalizedPhone,
      email: normalizedEmail || undefined,
      password,
      role: 'customer',
    });

    return res.status(201).json({
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email,
      role: customer.role,
      token: generateToken(customer._id, customer.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Log in a customer using either email or phone plus password.
 */
const loginCustomer = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Please enter your email or phone number and password.',
      });
    }

    const cleanIdentifier = String(identifier).trim();
    let query = { role: 'customer' };

    if (isValidEmail(cleanIdentifier)) {
      query.email = cleanIdentifier.toLowerCase();
    } else if (isValidPhone(cleanIdentifier)) {
      query.phone = normalizePhone(cleanIdentifier);
    } else {
      return res.status(400).json({
        message: 'Please enter a valid email address or phone number.',
      });
    }

    const customer = await User.findOne(query);

    if (!customer || !(await customer.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid credentials.',
      });
    }

    return res.status(200).json({
      _id: customer._id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
      email: customer.email,
      role: customer.role,
      token: generateToken(customer._id, customer.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * Log in an admin using admin ID, work email, and password.
 */
const loginAdmin = async (req, res) => {
  try {
    const { adminId, email, password } = req.body;

    if (!adminId || !email || !password) {
      return res.status(400).json({
        message: 'Please enter your admin ID, work email, and password.',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        message: 'Please enter a valid work email address.',
      });
    }

    const admin = await User.findOne({
      role: 'admin',
      adminId: String(adminId).trim(),
      email: normalizedEmail,
    });

    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid admin credentials.',
      });
    }

    return res.status(200).json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();

    return res.json({
      _id: updated._id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      token: generateToken(updated._id, updated.role),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await Booking.deleteMany({ userId });
    await User.findByIdAndDelete(userId);

    return res.status(200).json({ message: 'Your account has been deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getProfile,
  updateUserProfile,
  deleteUserProfile,
};