const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Simple reusable validators.
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{8,15}$/;

// Normalize phone input so login and registration use the same format.
const normalizePhone = (value = '') => value.replace(/[\s\-()]/g, '');

const isValidEmail = (value = '') => emailRegex.test(value.trim().toLowerCase());
const isValidPhone = (value = '') => phoneRegex.test(normalizePhone(value));

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Return a consistent response shape for the frontend.
const buildUserResponse = (user) => ({
  id: user.id,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email || '',
  phone: user.phone || '',
  adminId: user.adminId || '',
  university: user.university || '',
  address: user.address || '',
  token: generateToken(user.id),
});

// POST /api/auth/customer/register
const registerCustomer = async (req, res) => {
  const { firstName, lastName, phone, password, email = '' } = req.body;

  try {
    if (!firstName || !lastName || !phone || !password) {
      return res.status(400).json({
        message: 'Please complete all required fields.',
      });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({
        message: 'Please enter a valid phone number.',
      });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedPhone = normalizePhone(phone);
    const normalizedEmail = email ? email.trim().toLowerCase() : '';

    const existingPhone = await User.findOne({ phone: normalizedPhone });
    if (existingPhone) {
      return res.status(400).json({
        message: 'This phone number is already registered.',
      });
    }

    if (normalizedEmail) {
      const existingEmail = await User.findOne({ email: normalizedEmail });
      if (existingEmail) {
        return res.status(400).json({
          message: 'This email address is already registered.',
        });
      }
    }

    const user = await User.create({
      role: 'customer',
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: normalizedPhone,
      email: normalizedEmail,
      password,
    });

    return res.status(201).json(buildUserResponse(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/customer/login
const loginCustomer = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({
        message: 'Please enter your email or phone number and password.',
      });
    }

    const cleanIdentifier = identifier.trim();
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

    const user = await User.findOne(query);

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid email/phone number or password.',
      });
    }

    return res.status(200).json(buildUserResponse(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /api/auth/admin/login
const loginAdmin = async (req, res) => {
  const { adminId, email, password } = req.body;

  try {
    if (!adminId || !email || !password) {
      return res.status(400).json({
        message: 'Please enter your admin ID, work email, and password.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: 'Please enter a valid work email address.',
      });
    }

    const user = await User.findOne({
      role: 'admin',
      adminId: adminId.trim(),
      email: email.trim().toLowerCase(),
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        message: 'Invalid admin ID, work email, or password.',
      });
    }

    return res.status(200).json(buildUserResponse(user));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    return res.status(200).json({
      id: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || '',
      phone: user.phone || '',
      adminId: user.adminId || '',
      university: user.university || '',
      address: user.address || '',
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  const { firstName, lastName, email, phone, university, address } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (email && !isValidEmail(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address.',
      });
    }

    if (phone && !isValidPhone(phone)) {
      return res.status(400).json({
        message: 'Please enter a valid phone number.',
      });
    }

    user.firstName = firstName?.trim() || user.firstName;
    user.lastName = lastName?.trim() || user.lastName;
    user.email = email ? email.trim().toLowerCase() : user.email;
    user.phone = phone ? normalizePhone(phone) : user.phone;
    user.university = university?.trim() ?? user.university;
    user.address = address?.trim() ?? user.address;

    const updatedUser = await user.save();

    return res.status(200).json(buildUserResponse(updatedUser));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getProfile,
  updateUserProfile,
};
