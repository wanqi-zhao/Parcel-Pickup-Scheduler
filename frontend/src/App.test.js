import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import CustomerLogin from './pages/CustomerLogin';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminProfile from './pages/AdminProfile';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import CreateBooking from './pages/CreateBooking';
import MyBookings from './pages/MyBookings';
import BookingsCompleted from './pages/BookingsCompleted';
import BookingsCancelled from './pages/BookingsCancelled';
import UpdateBooking from './pages/UpdateBooking';
import DeleteAccount from './pages/DeleteAccount';
import DeleteSuccess from './pages/DeleteSuccess';
import Track from './pages/Track';
import TrackingDetail from './pages/TrackingDetail';

// ===== New admin pages =====
import AdminDashboard from './pages/AdminDashboard';
import ManageSlots from './pages/ManageSlots';
import AddNewSlot from './pages/AddNewSlot';
import ManageBookings from './pages/ManageBookings';
import AdminUpdateBooking from './pages/AdminUpdateBooking';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ===== Existing user/customer routes ===== */}
        <Route path="/" element={<Welcome />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/create-booking" element={<CreateBooking />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings-completed" element={<BookingsCompleted />} />
        <Route path="/bookings-cancelled" element={<BookingsCancelled />} />
        <Route path="/update-booking" element={<UpdateBooking />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/delete-success" element={<DeleteSuccess />} />
        <Route path="/track" element={<Track />} />
        <Route path="/tracking-detail" element={<TrackingDetail />} />

        {/* ===== New admin routes ===== */}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/manage-slots" element={<ManageSlots />} />
        <Route path="/add-new-slot" element={<AddNewSlot />} />
        <Route path="/manage-bookings" element={<ManageBookings />} />
        <Route path="/admin-update-booking" element={<AdminUpdateBooking />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}