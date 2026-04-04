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

function ProfileIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#333333" strokeWidth="1.8" />
      <path d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21" stroke="#333333" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

// mode: 'view' | 'edit' | 'delete'
export default function ManageSlots() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [slots, setSlots] = useState([]);
  const [mode, setMode] = useState('view');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [confirmSlot, setConfirmSlot] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.token) return;

    setIsLoading(true);
    setErrorMessage('');

    axiosInstance
      .get('/api/admin/slots', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setSlots(res.data || []))
      .catch(() => setErrorMessage('Failed to load slots.'))
      .finally(() => setIsLoading(false));
  }, [user]);

  const handleQuantityChange = (id, delta) => {
    setSlots((prev) =>
      prev.map((slot) =>
        slot._id === id
          ? { ...slot, capacity: Math.max(0, Number(slot.capacity || 0) + delta) }
          : slot
      )
    );
  };

  const handleSaveEdit = async () => {
    if (!user?.token) return;

    try {
      setErrorMessage('');

      await Promise.all(
        slots.map((slot) =>
          axiosInstance.patch(
            `/api/admin/slots/${slot._id}`,
            { capacity: Number(slot.capacity) },
            { headers: { Authorization: `Bearer ${user.token}` } }
          )
        )
      );

      setMode('view');
    } catch {
      setErrorMessage('Failed to save changes.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmSlot || !user?.token) return;

    try {
      setIsDeleting(true);
      setErrorMessage('');

      await axiosInstance.delete(`/api/admin/slots/${confirmSlot._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setSlots((prev) => prev.filter((slot) => slot._id !== confirmSlot._id));
      setConfirmSlot(null);
    } catch {
      setErrorMessage('Failed to delete slot.');
      setConfirmSlot(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const getSlotStatusLabel = (slot) => {
    const rawStatus = String(slot.status || '').toLowerCase();

    if (rawStatus === 'closed') return 'Closed';
    if (rawStatus === 'full') return 'Full';
    if (rawStatus === 'available') return 'Available';

    return Number(slot.capacity) > 0 ? 'Available' : 'Full';
  };

  const getSlotStatusClass = (slot) => {
    const label = getSlotStatusLabel(slot);

    if (label === 'Available') {
      return 'rounded-[4px] border border-[#22c55e] px-[8px] py-[2px] text-[12px] font-semibold text-[#22c55e]';
    }

    if (label === 'Closed') {
      return 'rounded-[4px] border border-[#9ca3af] px-[8px] py-[2px] text-[12px] font-semibold text-[#6b7280]';
    }

    return 'rounded-[4px] border border-[#ef4444] px-[8px] py-[2px] text-[12px] font-semibold text-[#ef4444]';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[20px] pt-[10px] flex flex-col">
        <StatusBar />

        <div className="mt-[10px] flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin-dashboard')}
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
          Manage Slot
        </button>

        <div className="mt-[14px] flex gap-[10px]">
          <button
            type="button"
            className="h-[34px] rounded-[6px] bg-[#5c9df5] px-[20px] text-[15px] font-semibold text-white"
          >
            Slots
          </button>

          <button
            type="button"
            onClick={() => navigate('/manage-bookings')}
            className="h-[34px] rounded-[6px] border border-[#d0d0d0] bg-white px-[20px] text-[15px] font-semibold text-[#666666]"
          >
            Bookings
          </button>
        </div>

        {errorMessage && (
          <div className="mt-[10px] rounded-[8px] bg-red-100 px-4 py-2 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[14px] overflow-hidden rounded-[8px] border border-[#d0d0d0]">
          <div className="flex bg-[#5a6a7c] px-[14px] py-[10px]">
            <span className="flex-1 text-[14px] font-semibold text-white">Date</span>
            <span className="flex-1 text-[14px] font-semibold text-white">Time</span>
            <span className="flex-1 text-[14px] font-semibold text-white">Quantity</span>
            {mode !== 'edit' && (
              <span className="flex-1 text-[14px] font-semibold text-white">Status</span>
            )}
          </div>

          {isLoading ? (
            <p className="px-4 py-6 text-center text-[14px] text-[#8a8a8a]">Loading...</p>
          ) : slots.length === 0 ? (
            <p className="px-4 py-6 text-center text-[14px] text-[#8a8a8a]">No slots found.</p>
          ) : (
            slots.map((slot) => (
              <div
                key={slot._id}
                className="flex items-center border-t border-[#e8e8e8] px-[14px] py-[12px]"
              >
                <span className="flex-1 text-[14px] text-[#333333]">
                  {slot.dateLabel}
                </span>

                <span className="flex-1 text-[14px] text-[#333333]">
                  {slot.timeLabel}
                </span>

                {mode === 'edit' ? (
                  <div className="flex-1 flex items-center gap-[8px]">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(slot._id, -1)}
                      className="w-[20px] text-[18px] font-bold text-[#333333]"
                    >
                      −
                    </button>

                    <span className="min-w-[20px] text-center text-[14px] font-semibold text-[#333333]">
                      {slot.capacity}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleQuantityChange(slot._id, 1)}
                      className="w-[20px] text-[18px] font-bold text-[#333333]"
                    >
                      +
                    </button>
                  </div>
                ) : mode === 'delete' ? (
                  <>
                    <span className="flex-1 text-[14px] text-[#333333]">
                      {slot.capacity}
                    </span>

                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => setConfirmSlot(slot)}
                        className="rounded-[4px] border border-[#22c55e] px-[10px] py-[2px] text-[12px] font-semibold text-[#22c55e]"
                      >
                        delete
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-[14px] text-[#333333]">
                      {slot.capacity}
                    </span>

                    <div className="flex-1">
                      <span className={getSlotStatusClass(slot)}>
                        {getSlotStatusLabel(slot)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-auto pb-[30px] pt-[24px] space-y-[12px]">
          <button
            type="button"
            onClick={() => navigate('/add-new-slot')}
            className="w-full h-[48px] rounded-[8px] bg-[#5c9df5] text-[16px] font-semibold text-white"
          >
            Add Slots
          </button>

          <button
            type="button"
            onClick={() => {
              if (mode === 'edit') {
                handleSaveEdit();
              } else {
                setMode('edit');
              }
            }}
            className="w-full h-[48px] rounded-[8px] bg-[#2c4770] text-[16px] font-semibold text-white"
          >
            {mode === 'edit' ? 'Save Changes' : 'Edit Existing Slots'}
          </button>

          <button
            type="button"
            onClick={() => setMode(mode === 'delete' ? 'view' : 'delete')}
            className="w-full h-[48px] rounded-[8px] bg-[#ef4444] text-[16px] font-semibold text-white"
          >
            {mode === 'delete' ? 'Done' : 'Delete Existing Slots'}
          </button>
        </div>

        {confirmSlot && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="mx-[30px] w-full rounded-[12px] bg-white px-[24px] py-[24px] shadow-lg">
              <p className="text-center text-[16px] font-bold text-[#222222]">
                Confirm Delete
              </p>

              <p className="mt-[10px] text-center text-[14px] text-[#666666]">
                Delete slot{' '}
                <span className="font-semibold text-[#333333]">
                  {confirmSlot.dateLabel} {confirmSlot.timeLabel}
                </span>
                ?
              </p>

              <div className="mt-[20px] flex gap-[12px]">
                <button
                  type="button"
                  onClick={() => setConfirmSlot(null)}
                  className="flex-1 h-[42px] rounded-[8px] border border-[#5c9df5] bg-white text-[15px] font-semibold text-[#5c9df5]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="flex-1 h-[42px] rounded-[8px] border border-[#ef4444] bg-white text-[15px] font-semibold text-[#ef4444] disabled:opacity-60"
                >
                  {isDeleting ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}