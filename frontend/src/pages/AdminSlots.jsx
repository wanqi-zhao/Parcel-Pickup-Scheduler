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

const INITIAL_FORM = { dateLabel: '', timeLabel: '', capacity: '' };

export default function AdminSlots() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchSlots = async () => {
    if (!user?.token) return;
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/admin/slots', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSlots(response.data || []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load slots.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddSlot = async () => {
    if (!form.dateLabel.trim() || !form.timeLabel.trim() || !form.capacity) {
      setErrorMessage('Please fill in all fields.');
      return;
    }
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');
      const response = await axiosInstance.post(
        '/api/admin/slots',
        { dateLabel: form.dateLabel, timeLabel: form.timeLabel, capacity: Number(form.capacity) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSlots((prev) => [response.data, ...prev]);
      setForm(INITIAL_FORM);
      setSuccessMessage('Slot added successfully.');
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to add slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      setDeletingId(slotId);
      setErrorMessage('');
      await axiosInstance.delete(`/api/admin/slots/${slotId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSlots((prev) => prev.filter((s) => s._id !== slotId));
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to delete slot.');
    } finally {
      setDeletingId('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <div className="mt-[18px] flex justify-center">
          <div className="rounded-[8px] bg-[#5c9df5] px-4 py-[8px]">
            <h1 className="text-[18px] font-semibold text-white">Manage Slots</h1>
          </div>
        </div>

        {/* Add Slot Form */}
        <div className="mt-[16px] rounded-[10px] border border-[#d4d4d4] bg-[#f8f8f8] px-[14px] py-[14px]">
          <p className="text-[14px] font-semibold text-[#333333]">Add New Slot</p>
          <div className="mt-[10px] space-y-[8px]">
            <input
              type="text"
              placeholder="Date (e.g. Tue, 17 Mar)"
              value={form.dateLabel}
              onChange={(e) => setForm({ ...form, dateLabel: e.target.value })}
              className="h-[42px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[12px] text-[14px] outline-none focus:border-[#5c9df5]"
            />
            <input
              type="text"
              placeholder="Time (e.g. 8:30-9:00)"
              value={form.timeLabel}
              onChange={(e) => setForm({ ...form, timeLabel: e.target.value })}
              className="h-[42px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[12px] text-[14px] outline-none focus:border-[#5c9df5]"
            />
            <input
              type="number"
              placeholder="Capacity (e.g. 10)"
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="h-[42px] w-full rounded-[8px] border border-[#d0d0d0] bg-white px-[12px] text-[14px] outline-none focus:border-[#5c9df5]"
            />
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleAddSlot}
              className="h-[44px] w-full rounded-[8px] bg-[#5c9df5] text-[15px] font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Adding...' : 'Add Slot'}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-[10px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mt-[10px] rounded-[8px] bg-green-100 px-4 py-3 text-[13px] text-green-700">
            {successMessage}
          </div>
        )}

        {/* Existing Slots */}
        <p className="mt-[18px] text-[14px] font-semibold text-[#333333]">Existing Slots</p>
        <div className="mt-[10px] flex-1 space-y-[10px]">
          {isLoading ? (
            <p className="text-center text-[14px] text-[#8a8a8a]">Loading slots...</p>
          ) : slots.length === 0 ? (
            <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-6 text-center">
              <p className="text-[14px] text-[#8a8a8a]">No slots yet. Add one above.</p>
            </div>
          ) : (
            slots.map((slot) => (
              <div
                key={slot._id}
                className="flex items-center justify-between rounded-[10px] border border-[#d4d4d4] bg-white px-[14px] py-[12px]"
              >
                <div>
                  <p className="text-[15px] font-bold text-[#333333]">{slot.dateLabel}</p>
                  <p className="mt-[2px] text-[14px] text-[#5c9df5]">{slot.timeLabel}</p>
                  <p className="mt-[2px] text-[12px] text-[#9a9a9a]">
                    {slot.booked ?? 0}/{slot.capacity} booked
                  </p>
                </div>
                <button
                  type="button"
                  disabled={deletingId === slot._id}
                  onClick={() => handleDeleteSlot(slot._id)}
                  className="h-[34px] rounded-[6px] border border-[#ff4a43] px-[12px] text-[13px] font-semibold text-[#ff4a43] disabled:opacity-50"
                >
                  {deletingId === slot._id ? '...' : 'Delete'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Admin Bottom Nav */}
        <div className="absolute bottom-[16px] left-[14px] right-[14px] rounded-[10px] border border-[#d2d2d2] bg-[#f8f8f8] px-4 py-2 shadow-sm">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="#5c9df5" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] leading-none text-[#5c9df5]">Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin-bookings')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#888888" strokeWidth="2" />
                <path d="M16 2V6M8 2V6M3 10H21" stroke="#888888" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] leading-none text-black">Bookings</span>
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
