import { useNavigate } from 'react-router-dom';

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

export default function Profile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/customer-login');
  };

  const handleDeleteAccount = () => {
    navigate('/delete-account');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[10px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-[12px] flex w-fit items-center gap-[4px] text-[16px] font-medium text-black"
        >
          <span>{'<'}</span>
        </button>

        <div className="mt-[14px] flex justify-center">
          <div className="min-w-[162px] rounded-[8px] bg-[#5c9df5] px-4 py-[8px] text-center">
            <h1 className="text-[18px] font-semibold text-white">Personal Details</h1>
          </div>
        </div>

        <div className="mt-[14px] space-y-[8px]">
          <DetailCard label="Name" value="Wanqi Zhao" />
          <DetailCard label="Email" value="n12544591@qut.edu.au" />
          <DetailCard label="Date Of Birth" value="11/23/2001" />
          <DetailCard label="Gender" value="Female" />
        </div>

        <div className="mt-auto space-y-[14px]">
          <button
            type="button"
            onClick={handleLogout}
            className="h-[48px] w-full rounded-[8px] border border-[#d0d0d0] bg-white text-[18px] font-semibold text-[#222222]"
          >
            Log Out
          </button>

          <button
            type="button"
            onClick={handleDeleteAccount}
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

            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img src={homeIcon} alt="Home" className="h-[28px] w-[28px] object-contain opacity-70" />
              <span className="text-[10px] leading-none text-black">Home</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/my-bookings')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img src={bookingIcon} alt="Bookings" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Bookings</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img src={profileIcon} alt="Profile" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-[#5c9df5]">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}