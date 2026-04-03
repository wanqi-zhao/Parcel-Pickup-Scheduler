import { useMemo } from 'react';
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

function DocumentIcon() {
  return (
    <svg width="34" height="40" viewBox="0 0 34 40" fill="none">
      <rect x="5" y="3" width="20" height="28" rx="2" stroke="#111111" strokeWidth="2" />
      <path d="M25 10H30V35C30 36.1046 29.1046 37 28 37H10C8.89543 37 8 36.1046 8 35V31" stroke="#111111" strokeWidth="2" />
      <path d="M10 11H19" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 16H19" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 21H17" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Track() {
  const navigate = useNavigate();

  const trackingItems = useMemo(
    () => [
      {
        id: 'BK-007',
        status: 'Delivered',
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <div className="mt-[34px] flex justify-center">
          <div className="min-w-[270px] rounded-[8px] bg-[#5c9df5] px-4 py-[8px] text-center">
            <h1 className="text-[18px] font-semibold text-white">Track</h1>
          </div>
        </div>

        <div className="mt-[28px] space-y-[14px]">
          {trackingItems.map((item) => (
  <button
    key={item.id}
    type="button"
    onClick={() =>
      navigate('/tracking-detail', {
        state: {
          trackingData: {
            trackingNumber: '3527364826381YU395',
            status: item.status,
            history: [
              {
                title: 'Delivered',
                location: 'SOUTH BRISBANE QLD',
                time: 'Fri 19 Dec 12:09',
              },
              {
                title: 'Arrive at facility',
                location: 'BRISBANE AIRPORT QLD',
                time: 'Fri 19 Dec 19:09',
              },
              {
                title: 'Shipping information approved by Australia Post',
                location: 'CHULLORA NSW',
                time: 'Thu 18 Dec 17:12',
              },
              {
                title: 'Shipping information received by Australia Post',
                location: 'CHULLORA NSW',
                time: 'Thu 18 Dec 16:12',
              },
            ],
          },
        },
      })
    }
    className="flex w-full items-center gap-[14px] rounded-[10px] border border-[#d4d4d4] bg-white px-[10px] py-[10px] text-left"
  >
    <DocumentIcon />

    <div>
      <p className="text-[22px] font-bold leading-none text-[#222222]">{item.id}</p>
      <p className="mt-[6px] text-[18px] font-medium leading-none text-[#43c25c]">
        {item.status}
      </p>
    </div>
  </button>
))}
        </div>

        <div className="mt-[115px] px-[20px] text-center">
          <p className="text-[18px] leading-[1.6] text-[#d1d1d1]">
            Items are automatically removed
          </p>
          <p className="text-[18px] leading-[1.6] text-[#d1d1d1]">
            after 90 days of inactivity
          </p>
        </div>

        <div className="absolute bottom-[12px] left-[14px] right-[14px] rounded-[10px] border border-[#cfcfcf] bg-white px-4 py-2">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={() => navigate('/track')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img
                src={trackIcon}
                alt="Track"
                className="h-[35px] w-[35px] object-contain"
              />
              <span className="text-[10px] leading-none text-[#5c9df5]">Track</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <img
                src={homeIcon}
                alt="Home"
                className="h-[28px] w-[28px] object-contain opacity-70"
              />
              <span className="text-[10px] leading-none text-black">Home</span>
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
              <span className="text-[10px] leading-none text-black">Bookings</span>
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
              <span className="text-[10px] leading-none text-black">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}