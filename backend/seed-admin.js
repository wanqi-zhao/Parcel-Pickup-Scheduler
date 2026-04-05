require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteOne({ adminId: 'N12544591' });

    const admin = await User.create({
      firstName: 'Wanqi',
      lastName: 'Zhao',
      adminId: 'N12544591',
      email: 'n12544591@qut.edu.au',
      password: 'admin1234',
      role: 'admin',
    });

    console.log('Admin created:');
    console.log({
      _id: admin._id.toString(),
      firstName: admin.firstName,
      lastName: admin.lastName,
      adminId: admin.adminId,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
