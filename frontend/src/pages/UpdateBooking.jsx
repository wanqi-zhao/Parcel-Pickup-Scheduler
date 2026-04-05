import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

export default function UpdateBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const currentBooking = location.state?.booking;

  const [newTime, setNewTime] = useState(currentBooking?.timeLabel || '');
  const [contactNumber, setContactNumber] = useState(currentBooking?.contactNumber || '');
  const [pickupNote, setPickupNote] = useState(currentBooking?.pickupNote || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Guard: if no booking was passed via navigation state, go back.
  if (!currentBooking?._id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-[390px] bg-white px-[10px] pt-[20px] text-center">
          <p className="text-[16px] text-[#8a8a8a]">No booking selected.</p>
          <button
            type="button"
            onClick={() => navigate('/my-bookings')}
            className="mt-[16px] h-[44px] w-full rounded-[8px] bg-[#5c9df5] text-white text-[16px] font-semibold"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  // Save changes to MongoDB via the customer booking update API.
  const handleSaveChanges = async () => {
    if (!user?.token) {
      setErrorMessage('Please log in again.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      await axiosInstance.put(
        `/api/bookings/${currentBooking._id}`,
        {
          timeLabel: newTime || currentBooking.timeLabel,
          contactNumber,
          pickupNote,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setSuccessMessage('Booking updated successfully!');
      setTimeout(() => navigate('/my-bookings'), 1000);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to update booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-white px-[10px] pt-[10px] pb-[24px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate('/my-bookings')}
          className="mt-[12px] flex w-fit items-center gap-[4px] text-[16px] font-medium text-black"
        >
          <span>{'<'}</span>
          <span>Back</span>
        </button>

        <div className="mt-[18px] flex justify-center">
          <div className="w-full rounded-[8px] bg-[#5c9df5] py-[10px] text-center">
            <h1 className="text-[18px] font-semibold text-white">Update Booking</h1>
          </div>
        </div>

        <div className="mt-[28px]">
          <p className="text-[20px] font-medium text-black">
            Booking ID: {currentBooking.bookingId || currentBooking.id}
          </p>
          <p className="mt-[6px] text-[15px] text-[#6a6a6a]">
            Current slot: {currentBooking.dateLabel} | {currentBooking.timeLabel}
          </p>
        </div>

        {errorMessage && (
          <div className="mt-[14px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-[14px] rounded-[8px] bg-green-100 px-4 py-3 text-[13px] text-green-700">
            {successMessage}
          </div>
        )}

        <div className="mt-[28px]">
          <label className="block text-[18px] font-medium text-black">New time</label>
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            placeholder="e.g. 13:30-14:00"
            className="mt-[10px] h-[42px] w-full rounded-[10px] border border-[#d0d0d0] bg-white px-[18px] text-[16px] text-[#333333] outline-none focus:border-[#5c9df5]"
          />
        </div>

        <div className="mt-[28px]">
          <label className="block text-[18px] font-medium text-black">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="e.g. 044 873 7692"
            className="mt-[10px] h-[42px] w-full rounded-[10px] border border-[#d0d0d0] bg-white px-[18px] text-[16px] text-[#333333] outline-none focus:border-[#5c9df5]"
          />
        </div>

        <div className="mt-[28px]">
          <label className="block text-[18px] font-medium text-black">Pickup Note</label>
          <textarea
            value={pickupNote}
            onChange={(e) => setPickupNote(e.target.value)}
            placeholder="e.g. Fragile items, please handle with care"
            rows={3}
            className="mt-[10px] w-full rounded-[10px] border border-[#d0d0d0] bg-white px-[14px] py-[12px] text-[16px] text-[#333333] outline-none focus:border-[#5c9df5] resize-none"
          />
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleSaveChanges}
          className="mt-[28px] h-[46px] w-full rounded-[8px] bg-[#5c9df5] text-[20px] font-semibold text-white disabled:opacity-70"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
