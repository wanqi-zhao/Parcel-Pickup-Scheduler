import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';

import Welcome from './pages/Welcome';
import CustomerLogin from './pages/CustomerLogin';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';

import AdminProfile from './pages/AdminProfile';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';

function AppRoutes() {
  const location = useLocation();

  // Keep auth-style pages clean without the bottom navigation.
  const hideNavbarPaths = ['/', '/customer-login', '/register', '/admin-login'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin-login" element={<AdminLogin />} />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}