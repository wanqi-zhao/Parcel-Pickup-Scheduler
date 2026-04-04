import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

import trackIcon from '../assets/track.jpeg';
import homeIcon from '../assets/home.jpeg';
import bookingIcon from '../assets/booking.jpeg';
import profileIcon from '../assets/profile1.jpeg';

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
      className={`h-[28px] rounded-[6px] px-[12px] text-[13px] font-medium ${
        isActive ? 'bg-[#5c9df5] text-white' : 'border border-[#d0d0d0] bg-white text-[#9a9a9a]'
      }`}
    >
      {label}
    </button>
  );
}

export default function MyBookings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancellingId, setIsCancellingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load upcoming bookings from MongoDB when the page opens.
  const fetchUpcomingBookings = async () => {
    if (!user?.token) {
      setErrorMessage('Please log in again to view your bookings.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await axiosInstance.get('/api/bookings?status=Upcoming', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
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
    fetchUpcomingBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.state?.activeTab === 'completed') {
      navigate('/bookings-completed', { replace: true });
    }

    if (location.state?.activeTab === 'cancelled') {
      navigate('/bookings-cancelled', { replace: true });
    }
  }, [location.state, navigate]);

  // Normalize the API response to the shape expected by the existing UI.
  const upcomingBookings = useMemo(
    () =>
      bookings.map((booking) => ({
        ...booking,
        id: booking.bookingId,
      })),
    [bookings]
  );

  const handleEditBooking = (booking) => {
    navigate('/update-booking', {
      state: {
        booking: {
          ...booking,
          id: booking.bookingId,
          _id: booking._id,
        },
      },
    });
  };

  const handleCancelBooking = async (bookingMongoId) => {
    if (!user?.token) {
      setErrorMessage('Please log in again to cancel your booking.');
      return;
    }

    try {
      setIsCancellingId(bookingMongoId);
      setErrorMessage('');

      await axiosInstance.patch(
        `/api/bookings/${bookingMongoId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setBookings((prev) => prev.filter((item) => item._id !== bookingMongoId));
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || 'Failed to cancel booking.';
      setErrorMessage(serverMessage);
    } finally {
      setIsCancellingId('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate('/create-booking')}
          className="mt-[12px] flex w-fit items-center gap-[4px] text-[16px] font-medium text-black"
        >
          <span>{'<'}</span>
          <span>Back</span>
        </button>

        <div className="mt-[18px] flex justify-center">
          <div className="min-w-[170px] rounded-[8px] bg-[#5c9df5] px-4 py-[8px] text-center">
            <h1 className="text-[18px] font-semibold text-white">My Bookings</h1>
          </div>
        </div>

        <div className="mt-[20px] flex items-center gap-[12px]">
          <TabButton label="Upcoming" isActive={true} onClick={() => navigate('/my-bookings')} />
          <TabButton label="Completed" isActive={false} onClick={() => navigate('/bookings-completed')} />
          <TabButton label="Cancelled" isActive={false} onClick={() => navigate('/bookings-cancelled')} />
        </div>

        {errorMessage && (
          <div className="mt-[16px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[28px] flex-1 space-y-[20px]">
          {isLoading ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">Loading bookings...</p>
            </div>
          ) : upcomingBookings.length === 0 ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">No upcoming bookings found.</p>
            </div>
          ) : (
            upcomingBookings.map((booking) => (
              <div key={booking._id} className="rounded-[10px] border border-[#d4d4d4] bg-white px-[18px] py-[16px]">
                <p className="text-[18px] font-bold text-[#333333]">{booking.id}</p>

                <p className="mt-[8px] text-[18px] font-semibold leading-none text-[#5c9df5]">
                  {booking.dateLabel}|{booking.timeLabel}
                </p>

                <p className="mt-[10px] text-[18px] font-medium leading-none text-[#43c25c]">
                  Status: {booking.status}
                </p>

                <div className="mt-[18px] flex justify-end gap-[12px]">
                  <button
                    type="button"
                    onClick={() => handleEditBooking(booking)}
                    className="h-[36px] rounded-[6px] bg-[#5c9df5] px-[16px] text-[18px] font-semibold text-white"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={isCancellingId === booking._id}
                    onClick={() => handleCancelBooking(booking._id)}
                    className="h-[36px] rounded-[6px] bg-[#ff4a43] px-[14px] text-[18px] font-semibold text-white disabled:opacity-70"
                  >
                    {isCancellingId === booking._id ? 'Cancelling...' : 'Cancel'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-[12px] left-[14px] right-[14px] rounded-[10px] border border-[#cfcfcf] bg-white px-4 py-2">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img src={trackIcon} alt="Track" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Track</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img src={homeIcon} alt="Home" className="h-[28px] w-[28px] object-contain opacity-70" />
              <span className="text-[10px] leading-none text-black">Home</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img src={bookingIcon} alt="Bookings" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-[#5c9df5]">Bookings</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img src={profileIcon} alt="Profile" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}