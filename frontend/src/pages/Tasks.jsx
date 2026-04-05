import { useEffect, useMemo, useState } from 'react';
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

export default function Tasks() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch available slots from the backend when the page loads.
  useEffect(() => {
    const fetchSlots = async () => {
      if (!user?.token) {
        setErrorMessage('Please log in again to view available slots.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');

        const response = await axiosInstance.get('/api/slots', {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        const allSlots = response.data || [];
        // Only show slots that are available to customers.
        const availableSlots = allSlots.filter((slot) => slot.status === 'available');
        setSlots(availableSlots);
      } catch (error) {
        const serverMessage =
          error?.response?.data?.message || 'Failed to load available slots.';
        setErrorMessage(serverMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSlots();
  }, [user]);

  // Pass the selected slot to CreateBooking so it can post it to the backend.
  const handleBookNow = (slot) => {
    navigate('/create-booking', { state: { selectedSlot: slot } });
  };

  // Build the display text for how many spots are left.
  const normalizedSlots = useMemo(
    () =>
      slots.map((slot) => {
        const cap = Number(slot.capacity);
        return {
          ...slot,
          remainingText:
            Number.isNaN(cap) || cap < 0
              ? 'Available'
              : cap === 0
              ? 'Full'
              : cap === 1
              ? '1 spot left'
              : `${cap} spots left`,
        };
      }),
    [slots]
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <div className="mt-[26px] flex justify-center">
          <div className="rounded-[8px] bg-[#5c9df5] px-4 py-2">
            <h1 className="text-[18px] font-semibold text-white">Available Pickup Slots</h1>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-[18px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[26px] space-y-[18px]">
          {isLoading ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">Loading slots...</p>
            </div>
          ) : normalizedSlots.length === 0 ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-8 text-center">
              <p className="text-[15px] text-[#8a8a8a]">No available slots at the moment.</p>
            </div>
          ) : (
            normalizedSlots.map((slot) => {
              const isAvailable = slot.status === 'available' && Number(slot.capacity) !== 0;

              return (
                <div key={slot._id}>
                  <div className="rounded-[8px] border border-[#d3d3d3] bg-[#f7f7f7] px-[16px] py-[14px]">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[18px] font-bold leading-none text-[#303030]">
                          {slot.dateLabel}
                        </p>
                        <p className="mt-[8px] text-[18px] font-bold leading-none text-[#4b4b4b]">
                          {slot.timeLabel}
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => isAvailable && handleBookNow(slot)}
                        className={`h-[40px] min-w-[100px] rounded-[8px] px-3 text-[18px] font-semibold text-white ${
                          isAvailable ? 'bg-[#45d463]' : 'bg-[#cfcfcf]'
                        }`}
                      >
                        {isAvailable ? 'Book Now' : 'Unavailable'}
                      </button>
                    </div>
                  </div>

                  <p className={`mt-[6px] pl-[10px] text-[16px] ${isAvailable ? 'text-[#6acb5f]' : 'text-[#ff4747]'}`}>
                    {slot.remainingText}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-[16px] left-[14px] right-[14px] rounded-[10px] border border-[#d2d2d2] bg-[#f8f8f8] px-4 py-2 shadow-sm">
          <div className="flex items-end justify-between">
            <button type="button" onClick={() => navigate('/track')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={trackIcon} alt="Track" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Track</span>
            </button>
            <button type="button" onClick={() => navigate('/tasks')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={homeIcon} alt="Home" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-[#5c9df5]">Home</span>
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
