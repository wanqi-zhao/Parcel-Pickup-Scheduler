import { Link, useLocation } from 'react-router-dom';
import trackIcon from '../assets/track.jpeg';
import homeIcon from '../assets/home.jpeg';
import bookingIcon from '../assets/booking.jpeg';
import profileIcon from '../assets/profile1.jpeg';

const navItems = [
  { path: '/track', label: 'Track', icon: trackIcon },
  { path: '/tasks', label: 'Home', icon: homeIcon },
  { path: '/my-bookings', label: 'Bookings', icon: bookingIcon },
  { path: '/profile', label: 'Profile', icon: profileIcon },
];

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/my-bookings') {
      return location.pathname === '/my-bookings' || location.pathname.startsWith('/update-booking');
    }

    if (path === '/track') {
      return location.pathname === '/track' || location.pathname.startsWith('/tracking');
    }

    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-[12px] left-1/2 z-50 w-[360px] -translate-x-1/2 rounded-[10px] border border-[#d2d2d2] bg-[#f8f8f8] px-4 py-2 shadow-sm">
      <div className="flex items-end justify-between">
        {navItems.map((item) => {
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="h-[24px] w-[24px] object-contain"
              />
              <span
                className={`text-[10px] leading-none ${
                  active ? 'text-[#5c9df5]' : 'text-black'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;