
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config({ path: __dirname + '/.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Customer booking routes
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Admin routes
app.use('/api/admin', require('./routes/adminRoutes'));

// Customer-accessible slot route (read-only, any authenticated user)
app.use('/api/slots', require('./routes/slotRoutes'));

// Serve React frontend build
const frontendBuild = path.join(__dirname, '../frontend/build');
app.use(express.static(frontendBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuild, 'index.html'));
});

// Export the app object for testing
if (require.main === module) {
  connectDB();
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

