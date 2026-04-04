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

const PERIODS = ['Morning', 'Afternoon', 'Evening'];

export default function AdminUpdateBooking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const booking = location.state?.booking;

  const [selectedPeriod, setSelectedPeriod] = useState('Afternoon');
  const [newTime, setNewTime] = useState(booking?.timeLabel || '');
  const [contactNumber, setContactNumber] = useState(booking?.contactNumber || '');
  const [pickupNote, setPickupNote] = useState(booking?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    if (!user?.token || !booking?._id) return;
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await axiosInstance.patch(
        `/api/admin/bookings/${booking._id}`,
        { timeLabel: newTime, contactNumber, notes: pickupNote, period: selectedPeriod },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSuccessMessage('Booking updated successfully.');
      setTimeout(() => navigate('/manage-bookings'), 1000);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-white px-[20px] pt-[10px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate('/manage-bookings')}
          className="mt-[10px] flex w-fit items-center gap-[2px] text-[15px] font-medium text-black"
        >
          <span>{'<'}</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          className="mt-[10px] w-full h-[46px] rounded-[8px] bg-[#5c9df5] text-[18px] font-semibold text-white"
        >
          Update Booking
        </button>

        <p className="mt-[18px] text-[16px] font-semibold text-[#222222]">
          Booking ID: {booking?.bookingId || 'N/A'}
        </p>

        <div className="mt-[14px] flex gap-[10px]">
          <button
            type="button"
            className="h-[34px] rounded-[6px] border border-[#d0d0d0] bg-white px-[14px] text-[14px] text-[#666666]"
          >
            {booking?.dateLabel || '17 Mar'}
          </button>
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPeriod(p)}
              className={`h-[34px] rounded-[6px] px-[14px] text-[14px] font-semibold ${
                selectedPeriod === p
                  ? 'bg-[#5c9df5] text-white'
                  : 'border border-[#d0d0d0] bg-white text-[#666666]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {errorMessage && (
          <div className="mt-[12px] rounded-[8px] bg-red-100 px-4 py-2 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-[12px] rounded-[8px] bg-green-100 px-4 py-2 text-[13px] text-green-700">
            {successMessage}
          </div>
        )}

        <div className="mt-[20px] space-y-[16px]">
          <div>
            <p className="text-[15px] font-semibold text-[#222222]">New time</p>
            <input
              type="text"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="13:30-14:00"
              className="mt-[6px] h-[44px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] text-[15px] text-[#333333] outline-none focus:border-[#5c9df5]"
            />
          </div>

          <div>
            <p className="text-[15px] font-semibold text-[#222222]">Contact Number</p>
            <input
              type="text"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              placeholder="044 873 7692"
              className="mt-[6px] h-[44px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] text-[15px] text-[#333333] outline-none focus:border-[#5c9df5]"
            />
          </div>

          <div>
            <p className="text-[15px] font-semibold text-[#222222]">Pickup Note</p>
            <textarea
              value={pickupNote}
              onChange={(e) => setPickupNote(e.target.value)}
              placeholder="They are fragile items, please be careful"
              rows={4}
              className="mt-[6px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] py-[10px] text-[15px] text-[#333333] outline-none focus:border-[#5c9df5] resize-none"
            />
          </div>
        </div>

        <div className="mt-auto pb-[30px] pt-[20px]">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="w-full h-[50px] rounded-[8px] bg-[#5c9df5] text-[17px] font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
