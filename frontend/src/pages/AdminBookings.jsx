import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-[2px]">
      <span className="text-[16px] font-semibold tracking-[-0.2px] text-black">9:41</span>
      <div className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="1" y="7" width="2.2" height="4" rx="1" fill="#000000" />
          <rect x="5" y="5.5" width="2.2" height="5.5" rx="1" fill="#000000" />
          <rect x="9" y="4" width="2.2" height="7" rx="1" fill="#000000" />
          <rect x="13" y="2.5" width="2.2" height="8.5" rx="1" fill="#000000" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M1 4.5C4.7 1.4 11.3 1.4 15 4.5" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M3.5 7C6 4.9 10 4.9 12.5 7" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M6.3 9.3C7.2 8.6 8.8 8.6 9.7 9.3" stroke="#000000" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="8" cy="10.4" r="1" fill="#000000" />
        </svg>
        <div className="relative h-[12px] w-[25px] rounded-[3px] border-[1.6px] border-black">
          <div className="absolute left-[1.5px] top-[1.5px] h-[7px] w-[18px] rounded-[2px] bg-black" />
          <div className="absolute -right-[3px] top-[3px] h-[4px] w-[2px] rounded-r-[1px] bg-black" />
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[28px] rounded-[6px] px-[10px] text-[12px] font-medium ${
        isActive ? 'bg-[#5c9df5] text-white' : 'border border-[#d0d0d0] bg-white text-[#9a9a9a]'
      }`}
    >
      {label}
    </button>
  );
}

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const statusColor = (status) => {
  if (status === 'Upcoming') return 'text-[#5c9df5]';
  if (status === 'Completed') return 'text-[#43c25c]';
  if (status === 'Cancelled') return 'text-[#ff4a43]';
  return 'text-[#888888]';
};

export default function AdminBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchBookings = async (tab) => {
    if (!user?.token) {
      setErrorMessage('Please log in again.');
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage('');
      const params = tab !== 'All' ? `?status=${tab}` : '';
      const response = await axiosInstance.get(`/api/admin/bookings${params}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings(response.data || []);
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || 'Failed to load bookings.';
      setErrorMessage(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <div className="mt-[18px] flex justify-center">
          <div className="rounded-[8px] bg-[#5c9df5] px-4 py-[8px]">
            <h1 className="text-[18px] font-semibold text-white">All Bookings</h1>
          </div>
        </div>

        <div className="mt-[16px] flex items-center gap-[8px] overflow-x-auto pb-[2px]">
          {TABS.map((tab) => (
            <TabButton
              key={tab}
              label={tab}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>

        {errorMessage && (
          <div className="mt-[12px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[16px] flex-1 space-y-[12px]">
          {isLoading ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">
                No {activeTab !== 'All' ? activeTab.toLowerCase() : ''} bookings found.
              </p>
            </div>
          ) : (
            bookings.map((booking) => (
              <button
                key={booking._id}
                type="button"
                onClick={() => navigate('/admin-booking-detail', { state: { booking } })}
                className="w-full rounded-[10px] border border-[#d4d4d4] bg-white px-[16px] py-[14px] text-left"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[16px] font-bold text-[#333333]">{booking.bookingId}</p>
                  <span className={`text-[13px] font-semibold ${statusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <p className="mt-[6px] text-[14px] font-medium text-[#5c5c5c]">
                  {booking.customerName || booking.userId?.firstName || 'Customer'}
                </p>
                <p className="mt-[4px] text-[13px] text-[#9a9a9a]">
                  {booking.dateLabel} | {booking.timeLabel}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="absolute bottom-[16px] left-[14px] right-[14px] rounded-[10px] border border-[#d2d2d2] bg-[#f8f8f8] px-4 py-2 shadow-sm">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="#888888" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] leading-none text-black">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin-bookings')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#5c9df5" strokeWidth="2" />
                <path d="M16 2V6M8 2V6M3 10H21" stroke="#5c9df5" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] leading-none text-[#5c9df5]">Bookings</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin-users')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="4" stroke="#888888" strokeWidth="2" />
                <path d="M1 21C1 16.6 4.6 13 9 13C13.4 13 17 16.6 17 21" stroke="#888888" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 11C19.2 11 21 12.8 21 15V21" stroke="#888888" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17" cy="7" r="3" stroke="#888888" strokeWidth="2" />
              </svg>
              <span className="text-[10px] leading-none text-black">Customers</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin-profile')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#888888" strokeWidth="2" />
                <path d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21" stroke="#888888" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] leading-none text-black">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
