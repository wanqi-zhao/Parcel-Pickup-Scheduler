import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'parcel_pickup_mock_bookings';

const fallbackBooking = {
  id: 'BK-001',
  dateLabel: 'Tue, 17 Mar',
  timeLabel: '9:00-9:30',
  status: 'Confirmed',
  contactNumber: '044 873 7692',
  pickupNote: 'They are fragile items, please be careful',
};

function readStoredBookings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return {
        upcoming: [],
        completed: [],
        cancelled: [],
      };
    }

    return JSON.parse(saved);
  } catch (error) {
    console.error('Failed to read bookings from localStorage:', error);
    return {
      upcoming: [],
      completed: [],
      cancelled: [],
    };
  }
}

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

  const currentBooking = useMemo(() => {
    return location.state?.booking || fallbackBooking;
  }, [location.state]);

  const [selectedDate] = useState('17 Mar');
  const [selectedPeriod] = useState('Afternoon');
  const [newTime, setNewTime] = useState('13:30-14:00');
  const [contactNumber, setContactNumber] = useState(
    currentBooking.contactNumber || '044 873 7692'
  );
  const [pickupNote, setPickupNote] = useState(
    currentBooking.pickupNote || 'They are fragile items, please be careful'
  );

  const handleSaveChanges = () => {
    const storedBookings = readStoredBookings();

    const updatedUpcoming = (storedBookings.upcoming || []).map((booking) => {
      if (booking.id !== currentBooking.id) {
        return booking;
      }

      return {
        ...booking,
        timeLabel: newTime,
        contactNumber,
        pickupNote,
      };
    });

    const updatedBookings = {
      ...storedBookings,
      upcoming: updatedUpcoming,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBookings));
    navigate('/my-bookings');
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
          <p className="text-[20px] font-medium text-black">Booking ID: {currentBooking.id}</p>
        </div>

        <div className="mt-[22px] flex items-center gap-[18px]">
          <button
            type="button"
            className="h-[40px] min-w-[76px] rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] text-[14px] font-medium text-[#9a9a9a]"
          >
            {selectedDate}
          </button>

          <button
            type="button"
            className="h-[40px] min-w-[112px] rounded-[8px] bg-[#5c9df5] px-[14px] text-[16px] font-semibold text-white"
          >
            {selectedPeriod}
          </button>

          <button
            type="button"
            className="h-[40px] min-w-[76px] rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] text-[14px] font-medium text-[#9a9a9a]"
          >
            Details
          </button>
        </div>

        <div className="mt-[28px]">
          <label className="block text-[18px] font-medium text-black">New time</label>
          <input
            type="text"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="mt-[10px] h-[42px] w-full rounded-[10px] border border-[#d0d0d0] bg-white px-[18px] text-[16px] font-semibold text-[#b0b0b0] outline-none"
          />
        </div>

        <div className="mt-[34px]">
          <label className="block text-[18px] font-medium text-black">Contact Number</label>
          <input
            type="text"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="mt-[10px] h-[42px] w-full rounded-[10px] border border-[#d0d0d0] bg-white px-[18px] text-[16px] font-semibold text-[#b0b0b0] outline-none"
          />
        </div>

        <div className="mt-[34px]">
          <label className="block text-[18px] font-medium text-black">Pickup Note</label>
          <textarea
            value={pickupNote}
            onChange={(e) => setPickupNote(e.target.value)}
            rows={3}
            className="mt-[10px] w-full rounded-[10px] border border-[#d0d0d0] bg-white px-[14px] py-[12px] text-center text-[16px] font-semibold leading-[1.9] text-[#b0b0b0] outline-none resize-none"
          />
        </div>

        <button
          type="button"
          onClick={handleSaveChanges}
          className="mt-[28px] h-[46px] w-full rounded-[8px] bg-[#5c9df5] text-[20px] font-semibold text-white"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}