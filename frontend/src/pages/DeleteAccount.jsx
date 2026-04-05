import { useState } from 'react';
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

function DetailCard({ label, value }) {
  return (
    <div className="rounded-[8px] border border-[#d0d0d0] bg-white px-[10px] py-[8px]">
      <p className="text-[15px] font-semibold text-[#222222]">{label}</p>
      <p className="mt-[4px] text-[16px] text-[#9a9a9a]">{value}</p>
    </div>
  );
}

export default function DeleteAccount() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDelete = async () => {
    if (!user?.token) return;
    try {
      setIsDeleting(true);
      await axiosInstance.delete('/api/auth/profile', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      logout();
      navigate('/delete-success');
    } catch {
      setErrorMessage('Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] overflow-hidden rounded-[18px] bg-white px-[10px] pt-[10px] pb-[110px] flex flex-col">
        <div className="pointer-events-none select-none">
          <StatusBar />

          <button
            type="button"
            className="mt-[12px] flex w-fit items-center gap-[4px] text-[16px] font-medium text-black"
          >
            <span>{'<'}</span>
          </button>

          <div className="mt-[12px] flex justify-center">
            <div className="min-w-[162px] rounded-[8px] bg-[#5c9df5] px-4 py-[8px] text-center">
              <h1 className="text-[18px] font-semibold text-white">Personal Details</h1>
            </div>
          </div>

          <div className="mt-[14px] space-y-[8px]">
            <DetailCard label="Name" value={user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : ''} />
            <DetailCard label="Email" value={user?.email || ''} />
            <DetailCard label="Phone" value={user?.phone || ''} />
          </div>

          <div className="mt-auto space-y-[14px]">
            <button
              type="button"
              className="h-[48px] w-full rounded-[8px] border border-[#d0d0d0] bg-white text-[18px] font-semibold text-[#666666]"
            >
              Log Out
            </button>

            <button
              type="button"
              className="h-[48px] w-full rounded-[8px] border border-[#d0d0d0] bg-white text-[16px] font-semibold text-[#ff3b30]"
            >
              Delete Account
            </button>
          </div>

          <div className="absolute bottom-[12px] left-[14px] right-[14px] rounded-[10px] border border-[#cfcfcf] bg-white px-4 py-2">
            <div className="flex items-end justify-between">
              <button type="button" className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
                <img src={trackIcon} alt="Track" className="h-[28px] w-[28px] object-contain" />
                <span className="text-[10px] leading-none text-black">Track</span>
              </button>

              <button type="button" className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
                <img src={homeIcon} alt="Home" className="h-[28px] w-[28px] object-contain opacity-70" />
                <span className="text-[10px] leading-none text-black">Home</span>
              </button>

              <button type="button" className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
                <img src={bookingIcon} alt="Bookings" className="h-[28px] w-[28px] object-contain" />
                <span className="text-[10px] leading-none text-black">Bookings</span>
              </button>

              <button type="button" className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
                <img src={profileIcon} alt="Profile" className="h-[28px] w-[28px] object-contain" />
                <span className="text-[10px] leading-none text-[#5c9df5]">Profile</span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 z-10 bg-black/5" />

        <div className="absolute left-1/2 top-[415px] z-20 w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-[18px] bg-white px-[18px] py-[18px] shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
          <h2 className="text-center text-[18px] font-semibold text-[#222222]">
            Delete account confirmation
          </h2>

          <p className="mt-[12px] text-center text-[14px] leading-[1.5] text-[#777777]">
            Are you sure you want to delete your account?
          </p>

          {errorMessage && (
            <p className="mt-[8px] text-center text-[12px] text-red-600">{errorMessage}</p>
          )}

          <div className="mt-[16px] flex flex-col items-center gap-[8px]">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex h-[28px] min-w-[74px] items-center justify-center rounded-[16px] border border-[#d0d0d0] bg-white px-[18px] text-[14px] font-semibold text-[#5c9df5]"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={handleDelete}
              className="flex h-[28px] min-w-[74px] items-center justify-center rounded-[16px] border border-[#d0d0d0] bg-white px-[18px] text-[14px] font-semibold text-[#ff3b30] disabled:opacity-60"
            >
              {isDeleting ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
