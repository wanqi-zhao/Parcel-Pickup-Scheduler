import { useState } from 'react';
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

function ProfileIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#333333" strokeWidth="1.8" />
      <path d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21" stroke="#333333" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function AddNewSlot() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [dateLabel, setDateLabel] = useState('');
  const [timeLabel, setTimeLabel] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('Available');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async () => {
    if (!dateLabel.trim() || !timeLabel.trim() || !capacity) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await axiosInstance.post(
        '/api/admin/slots',
        {
          dateLabel: dateLabel.trim(),
          timeLabel: timeLabel.trim(),
          capacity: Number(capacity),
          status: status.toLowerCase(),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      navigate('/manage-slots');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to add slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-white px-[20px] pt-[10px] flex flex-col">
        <StatusBar />

        <div className="mt-[10px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/manage-slots')}
            className="flex items-center gap-[2px] text-[15px] font-medium text-black"
          >
            <span>{'<'}</span>
            <span>Back</span>
          </button>

          <button type="button" onClick={() => navigate('/admin-profile')}>
            <ProfileIcon />
          </button>
        </div>

        <button
          type="button"
          className="mt-[10px] w-full h-[46px] rounded-[8px] bg-[#5c9df5] text-[18px] font-semibold text-white"
        >
          Add New Slot
        </button>

        {errorMessage && (
          <div className="mt-[10px] rounded-[8px] bg-red-100 px-4 py-2 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[22px] space-y-[14px]">
          <div>
            <p className="text-[14px] text-[#555555]">Date</p>
            <input
              type="text"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
              placeholder="18 Mar 2026"
              className="mt-[6px] h-[44px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] text-[15px] text-[#333333] placeholder-[#b0b0b0] outline-none focus:border-[#5c9df5]"
            />
          </div>

          <div>
            <p className="text-[14px] text-[#555555]">Time</p>
            <input
              type="text"
              value={timeLabel}
              onChange={(e) => setTimeLabel(e.target.value)}
              placeholder="12:00-12:30"
              className="mt-[6px] h-[44px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] text-[15px] text-[#333333] placeholder-[#b0b0b0] outline-none focus:border-[#5c9df5]"
            />
          </div>

          <div>
            <p className="text-[14px] text-[#555555]">Capacity</p>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="10"
              className="mt-[6px] h-[44px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] text-[15px] text-[#333333] placeholder-[#b0b0b0] outline-none focus:border-[#5c9df5]"
            />
          </div>
        </div>

        <div className="mt-[20px] flex gap-[12px]">
          <button
            type="button"
            onClick={() => setStatus('Available')}
            className={`h-[38px] rounded-[8px] px-[24px] text-[15px] font-semibold ${
              status === 'Available'
                ? 'bg-[#5c9df5] text-white'
                : 'border border-[#d0d0d0] bg-white text-[#666666]'
            }`}
          >
            Available
          </button>

          <button
            type="button"
            onClick={() => setStatus('Closed')}
            className={`h-[38px] rounded-[8px] px-[24px] text-[15px] font-semibold ${
              status === 'Closed'
                ? 'bg-[#5c9df5] text-white'
                : 'border border-[#d0d0d0] bg-white text-[#666666]'
            }`}
          >
            Closed
          </button>
        </div>

        <div className="mt-auto pb-[30px] pt-[24px] space-y-[12px]">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSave}
            className="w-full h-[50px] rounded-[8px] bg-[#22c55e] text-[17px] font-semibold text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save Slot'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/manage-slots')}
            className="w-full h-[50px] rounded-[8px] bg-[#d0d0d0] text-[17px] font-semibold text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}