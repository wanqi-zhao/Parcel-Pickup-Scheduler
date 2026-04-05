import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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

const statusColor = {
  Upcoming: '#5c9df5',
  Completed: '#43c25c',
  Cancelled: '#ef4d4d',
};

export default function TrackingDetail() {
  const navigate = useNavigate();
  const location = useLocation();

  // Receive real booking data passed from Track.jsx via navigate state.
  const trackingData = useMemo(() => {
    return location.state?.trackingData || null;
  }, [location.state]);

  if (!trackingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-[390px] bg-white px-[14px] pt-[10px] flex flex-col items-center gap-4">
          <p className="text-[16px] text-[#8a8a8a]">No tracking data found.</p>
          <button
            type="button"
            onClick={() => navigate('/track')}
            className="h-[44px] rounded-[8px] bg-[#5c9df5] px-6 text-[16px] font-semibold text-white"
          >
            Go to Track
          </button>
        </div>
      </div>
    );
  }

  const color = statusColor[trackingData.status] || '#8a8a8a';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate('/track')}
          className="mt-[12px] flex w-fit items-center gap-[4px] text-[16px] font-medium text-black"
        >
          <span>{'<'}</span>
          <span>Back</span>
        </button>

        <div className="mt-[18px] text-center">
          <h1 className="text-[22px] font-medium tracking-[0.3px] text-[#333333]">TRACKING</h1>
        </div>

        {/* Booking summary card */}
        <div className="mt-[18px] rounded-[8px] border border-[#d4d4d4] bg-white px-[12px] py-[10px]">
          <p className="text-[16px] text-[#9a9a9a]">{trackingData.trackingNumber}</p>
          <p className="mt-[6px] text-[20px] font-medium" style={{ color }}>
            {trackingData.status}
          </p>
          {trackingData.dateLabel && (
            <p className="mt-[4px] text-[15px] text-[#6a6a6a]">
              {trackingData.dateLabel} | {trackingData.timeLabel}
            </p>
          )}
          {trackingData.location && (
            <p className="mt-[2px] text-[14px] text-[#9a9a9a]">{trackingData.location}</p>
          )}
          {trackingData.contactNumber && (
            <p className="mt-[2px] text-[14px] text-[#9a9a9a]">
              Contact: {trackingData.contactNumber}
            </p>
          )}
          {trackingData.pickupNote && (
            <p className="mt-[4px] text-[14px] italic text-[#9a9a9a]">
              Note: {trackingData.pickupNote}
            </p>
          )}
        </div>

        {/* Tracking history */}
        <div className="mt-[8px] overflow-hidden rounded-[8px] border border-[#d4d4d4] bg-white">
          <div className="border-b border-[#dcdcdc] px-[12px] py-[8px]">
            <p className="text-[20px] font-medium text-[#333333]">Tracking history</p>
          </div>

          {trackingData.history.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className={`px-[12px] py-[10px] ${
                index !== trackingData.history.length - 1 ? 'border-b border-[#dcdcdc]' : ''
              }`}
            >
              <p className="text-[20px] font-medium leading-[1.15] text-[#333333]">{item.title}</p>
              <p className="mt-[4px] text-[18px] leading-[1.2] text-[#a6a6a6]">{item.location}</p>
              <p className="mt-[4px] text-[18px] leading-[1.2] text-[#a6a6a6]">{item.time}</p>
            </div>
          ))}
        </div>

        {/* Bottom nav */}
        <div className="absolute bottom-[12px] left-[14px] right-[14px] rounded-[10px] border border-[#cfcfcf] bg-white px-4 py-2">
          <div className="flex items-end justify-between">
            <button type="button" onClick={() => navigate('/track')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={trackIcon} alt="Track" className="h-[32px] w-[32px] object-contain" />
              <span className="text-[10px] leading-none text-[#5c9df5]">Track</span>
            </button>
            <button type="button" onClick={() => navigate('/tasks')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={homeIcon} alt="Home" className="h-[28px] w-[28px] object-contain opacity-70" />
              <span className="text-[10px] leading-none text-black">Home</span>
            </button>
            <button type="button" onClick={() => navigate('/my-bookings')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={bookingIcon} alt="Bookings" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Bookings</span>
            </button>
            <button type="button" onClick={() => navigate('/profile')} className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]">
              <img src={profileIcon} alt="Profile" className="h-[28px] w-[28px] object-contain" />
              <span className="text-[10px] leading-none text-black">Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
