const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      role: 'admin',
      firstName: 'Wanqi',
      lastName: 'Zhao',
      adminId: 'N12544591',
      email: 'admin@parcelpickup.com',
      password: 'Admin1234',
    };

    const existingAdmin = await User.findOne({
      $or: [
        { adminId: adminData.adminId },
        { email: adminData.email },
      ],
    });

    if (existingAdmin) {
      console.log('Admin account already exists.');
      console.log(JSON.stringify({
        adminId: existingAdmin.adminId,
        email: existingAdmin.email,
        role: existingAdmin.role,
      }, null, 2));
      process.exit(0);
    }

    const admin = await User.create(adminData);

    console.log('Admin account created successfully.');
    console.log(JSON.stringify({
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
    }, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();
