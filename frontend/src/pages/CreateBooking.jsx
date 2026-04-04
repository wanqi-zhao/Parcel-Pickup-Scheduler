import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

import trackIcon from '../assets/track.jpeg';
import homeIcon from '../assets/home.jpeg';
import bookingIcon from '../assets/booking.jpeg';
import profileIcon from '../assets/profile1.jpeg';

const slotData = [
  {
    id: 'slot-1',
    dateLabel: 'Tue, 17 Mar',
    timeLabel: '8:30-9:00',
    remainingText: '10 spots left',
    status: 'available',
  },
  {
    id: 'slot-2',
    dateLabel: 'Tue, 17 Mar',
    timeLabel: '9:00-9:30',
    remainingText: '1 spots left',
    status: 'available',
  },
  {
    id: 'slot-3',
    dateLabel: 'Tue, 17 Mar',
    timeLabel: '9:30-10:00',
    remainingText: 'Full',
    status: 'unavailable',
  },
];

const defaultSelectedSlot = {
  id: 'slot-2',
  dateLabel: 'Tue, 17 Mar',
  timeLabel: '9:00-9:30',
  remainingText: '1 spots left',
  status: 'available',
};

function StatusBar() {
  return (
    <div className="flex items-center justify-between px-[2px]">
      <span className="text-[16px] font-semibold tracking-[-0.2px] text-black">
        9:41
      </span>

      <div className="flex items-center gap-[6px]">
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="1" y="7" width="2.2" height="4" rx="1" fill="#000000" />
          <rect x="5" y="5.5" width="2.2" height="5.5" rx="1" fill="#000000" />
          <rect x="9" y="4" width="2.2" height="7" rx="1" fill="#000000" />
          <rect x="13" y="2.5" width="2.2" height="8.5" rx="1" fill="#000000" />
        </svg>

        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path
            d="M1 4.5C4.7 1.4 11.3 1.4 15 4.5"
            stroke="#000000"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M3.5 7C6 4.9 10 4.9 12.5 7"
            stroke="#000000"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M6.3 9.3C7.2 8.6 8.8 8.6 9.7 9.3"
            stroke="#000000"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
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

export default function CreateBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const slots = useMemo(() => slotData, []);
  const initialSlot = location.state?.selectedSlot || defaultSelectedSlot;

  const [selectedSlot, setSelectedSlot] = useState(initialSlot);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Create one booking in MongoDB instead of writing to localStorage.
  const handleSelectBooking = async (slot) => {
    if (!user?.token) {
      setErrorMessage('Please log in again before creating a booking.');
      return;
    }

    try {
      setSelectedSlot(slot);
      setIsSubmitting(true);
      setErrorMessage('');

      await axiosInstance.post(
        '/api/bookings',
        {
          dateLabel: slot.dateLabel,
          timeLabel: slot.timeLabel,
          location: 'Parcel Counter A',
          contactNumber: user.phone || '',
          pickupNote: '',
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      navigate('/my-bookings');
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || 'Failed to create booking. Please try again.';
      setErrorMessage(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate('/tasks')}
          className="mt-[14px] flex w-fit items-center gap-[6px] text-[16px] font-medium text-black"
        >
          <span>{'<'}</span>
          <span>Back</span>
        </button>

        <div className="mt-[16px] flex justify-center">
          <div className="rounded-[8px] bg-[#5c9df5] px-4 py-2">
            <h1 className="text-[18px] font-semibold text-white">
              Create New Booking
            </h1>
          </div>
        </div>

        <div className="mt-[26px]">
          <p className="text-[18px] font-bold text-[#2f2f2f]">Selected Slot:</p>
          <p className="mt-[6px] text-[18px] font-semibold leading-[1.2] text-[#5c9df5]">
            {selectedSlot.dateLabel} | {selectedSlot.timeLabel}
          </p>
        </div>

        {errorMessage && (
          <div className="mt-[16px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[18px] space-y-[18px]">
          {slots.map((slot) => {
            const isAvailable = slot.status === 'available';

            return (
              <div key={slot.id}>
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
                      disabled={!isAvailable || isSubmitting}
                      onClick={() => isAvailable && handleSelectBooking(slot)}
                      className={`h-[40px] min-w-[100px] rounded-[8px] px-3 text-[18px] font-semibold text-white ${
                        isAvailable ? 'bg-[#45d463]' : 'bg-[#cfcfcf]'
                      } ${isSubmitting ? 'opacity-70' : ''}`}
                    >
                      {isSubmitting && selectedSlot.id === slot.id
                        ? 'Saving...'
                        : isAvailable
                        ? 'Book Now'
                        : 'Unavailable'}
                    </button>
                  </div>
                </div>

                <p
                  className={`mt-[6px] pl-[10px] text-[16px] ${
                    isAvailable ? 'text-[#6acb5f]' : 'text-[#ff4747]'
                  }`}
                >
                  {slot.remainingText}
                </p>
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-[16px] left-[14px] right-[14px] rounded-[10px] border border-[#d2d2d2] bg-[#f8f8f8] px-4 py-2 shadow-sm">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img
                src={trackIcon}
                alt="Track"
                className="h-[28px] w-[28px] object-contain"
              />
              <span className="text-[10px] leading-none text-black">Track</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img
                src={homeIcon}
                alt="Home"
                className="h-[28px] w-[28px] object-contain"
              />
              <span className="text-[10px] leading-none text-[#5c9df5]">
                Home
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img
                src={bookingIcon}
                alt="Bookings"
                className="h-[28px] w-[28px] object-contain"
              />
              <span className="text-[10px] leading-none text-black">
                Bookings
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img
                src={profileIcon}
                alt="Profile"
                className="h-[28px] w-[28px] object-contain"
              />
              <span className="text-[10px] leading-none text-black">
                Profile
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}