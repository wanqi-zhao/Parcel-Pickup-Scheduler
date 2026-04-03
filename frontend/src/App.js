import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import CustomerLogin from './pages/CustomerLogin';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

import AdminProfile from './pages/AdminProfile';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
      </Routes>
    </Router>
  );
}