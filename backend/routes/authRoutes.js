const express = require('express');
const {
  registerCustomer,
  loginCustomer,
  loginAdmin,
  getProfile,
  updateUserProfile,
  deleteUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/customer/register', registerCustomer);
router.post('/customer/login', loginCustomer);
router.post('/admin/login', loginAdmin);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUserProfile);

module.exports = router;
