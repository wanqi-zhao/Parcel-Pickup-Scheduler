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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalBookings: 0,
    activeSlots: 0,
    completedPickups: 0,
  });

  useEffect(() => {
    if (!user?.token) return;
    axiosInstance
      .get('/api/admin/stats', { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, [user]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-white px-[20px] pt-[10px] flex flex-col">
        <StatusBar />

        <div className="mt-[10px] flex justify-end">
          <button type="button" onClick={() => navigate('/admin-profile')}>
            <ProfileIcon />
          </button>
        </div>

        <button
          type="button"
          className="mt-[10px] w-full h-[46px] rounded-[8px] bg-[#5c9df5] text-[18px] font-semibold text-white"
        >
          Admin Dashboard
        </button>

        <div className="mt-[24px] flex gap-[10px]">
          <div className="flex-1 rounded-[8px] border border-[#e0e0e0] px-[10px] py-[14px]">
            <p className="text-[12px] text-[#666666] leading-tight">Total Bookings</p>
            <p className="mt-[6px] text-[28px] font-bold text-[#5c9df5]">{stats.totalBookings}</p>
          </div>
          <div className="flex-1 rounded-[8px] border border-[#e0e0e0] px-[10px] py-[14px]">
            <p className="text-[12px] text-[#666666] leading-tight">Active Slots</p>
            <p className="mt-[6px] text-[28px] font-bold text-[#22c55e]">{stats.activeSlots}</p>
          </div>
          <div className="flex-1 rounded-[8px] border border-[#e0e0e0] px-[10px] py-[14px]">
            <p className="text-[12px] text-[#666666] leading-tight">Completed Pickups</p>
            <p className="mt-[6px] text-[28px] font-bold text-[#f59e0b]">{stats.completedPickups}</p>
          </div>
        </div>

        <div className="mt-[40px] space-y-[14px]">
          <button
            type="button"
            onClick={() => navigate('/manage-slots')}
            className="w-full h-[50px] rounded-[8px] bg-[#5c9df5] text-[17px] font-semibold text-white"
          >
            Manage Slots
          </button>
          <button
            type="button"
            onClick={() => navigate('/manage-bookings')}
            className="w-full h-[50px] rounded-[8px] bg-[#5c9df5] text-[17px] font-semibold text-white"
          >
            Manage Bookings
          </button>
          <button
            type="button"
            onClick={() => navigate('/add-new-slot')}
            className="w-full h-[50px] rounded-[8px] bg-[#5c9df5] text-[17px] font-semibold text-white"
          >
            Add New Slot
          </button>
        </div>
      </div>
    </div>
  );
}
