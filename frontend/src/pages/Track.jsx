import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

function DocumentIcon() {
  return (
    <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
      <rect x="5" y="3" width="20" height="28" rx="2" stroke="#111111" strokeWidth="2" />
      <path d="M25 10H30V35C30 36.1046 29.1046 37 28 37H10C8.89543 37 8 36.1046 8 35V31" stroke="#111111" strokeWidth="2" />
      <path d="M10 11H19" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 16H19" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 21H17" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Map booking status to a display colour.
const statusColor = {
  Upcoming: '#5c9df5',
  Completed: '#43c25c',
  Cancelled: '#ef4d4d',
};

export default function Track() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch all of the user's bookings to show as trackable items.
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.token) {
        setErrorMessage('Please log in to track your bookings.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');

        // Get all bookings (no status filter) so user can track any of them.
        const response = await axiosInstance.get('/api/bookings', {
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

    fetchBookings();
  }, [user?.token]);

  // Navigate to the detail page, passing the real booking data as tracking data.
  const handleTrackBooking = (booking) => {
    navigate('/tracking-detail', {
      state: {
        trackingData: {
          trackingNumber: booking.bookingId,
          status: booking.status,
          dateLabel: booking.dateLabel,
          timeLabel: booking.timeLabel,
          location: booking.location,
          contactNumber: booking.contactNumber,
          pickupNote: booking.pickupNote,
          // History is built from what we have; real logistics history
          // would require a separate backend field in future.
          history: [
            {
              title: booking.status,
              location: booking.location || 'Parcel Counter A',
              time: booking.dateLabel + ' ' + booking.timeLabel,
            },
          ],
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <div className="mt-[34px] flex justify-center">
          <div className="min-w-[270px] rounded-[8px] bg-[#5c9df5] px-4 py-[8px] text-center">
            <h1 className="text-[18px] font-semibold text-white">Track</h1>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-[16px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[28px] space-y-[14px]">
          {isLoading ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">No bookings to track yet.</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <button
                key={booking._id}
                type="button"
                onClick={() => handleTrackBooking(booking)}
                className="flex w-full items-center gap-[14px] rounded-[10px] border border-[#d4d4d4] bg-white px-[10px] py-[10px] text-left"
              >
                <DocumentIcon />
                <div>
                  <p className="text-[22px] font-bold leading-none text-[#222222]">
                    {booking.bookingId}
                  </p>
                  <p className="mt-[4px] text-[14px] leading-none text-[#8a8a8a]">
                    {booking.dateLabel} | {booking.timeLabel}
                  </p>
                  <p
                    className="mt-[6px] text-[18px] font-medium leading-none"
                    style={{ color: statusColor[booking.status] || '#8a8a8a' }}
                  >
                    {booking.status}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="mt-[24px] px-[20px] text-center">
          <p className="text-[18px] leading-[1.6] text-[#d1d1d1]">
            Items are automatically removed
          </p>
          <p className="text-[18px] leading-[1.6] text-[#d1d1d1]">
            after 90 days of inactivity
          </p>
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-[12px] left-[14px] right-[14px] rounded-[10px] border border-[#cfcfcf] bg-white px-4 py-2">
          <div className="flex items-end justify-between">
            <button type="button" onClick={() => navigate('/track')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={trackIcon} alt="Track" className="h-[35px] w-[35px] object-contain" />
              <span className="text-[10px] leading-none text-[#5c9df5]">Track</span>
            </button>
            <button type="button" onClick={() => navigate('/tasks')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={homeIcon} alt="Home" className="h-[28px] w-[28px] object-contain opacity-70" />
              <span className="text-[10px] leading-none text-black">Home</span>
            </button>
            <button type="button" onClick={() => navigate('/my-bookings')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={bookingIcon} alt="Bookings" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Bookings</span>
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={profileIcon} alt="Profile" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
