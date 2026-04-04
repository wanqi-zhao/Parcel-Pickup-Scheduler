import { useEffect, useState } from 'react';
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

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[8px] border border-[#e0e0e0] bg-white px-[14px] py-[10px]">
      <p className="text-[12px] text-[#9a9a9a]">{label}</p>
      <p className="mt-[2px] text-[16px] font-semibold text-[#222222]">{value || '—'}</p>
    </div>
  );
}

const statusColor = (status) => {
  if (status === 'Upcoming') return 'text-[#5c9df5]';
  if (status === 'Completed') return 'text-[#43c25c]';
  if (status === 'Cancelled') return 'text-[#ff4a43]';
  return 'text-[#888888]';
};

export default function AdminUserDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const customer = location.state?.customer;
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  useEffect(() => {
    if (!customer?._id || !user?.token) return;

    const fetchUserBookings = async () => {
      try {
        setIsLoadingBookings(true);
        const response = await axiosInstance.get(
          `/api/admin/users/${customer._id}/bookings`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setBookings(response.data || []);
      } catch {
        // silently ignore
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchUserBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!customer) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] flex flex-col">
          <StatusBar />
          <p className="mt-[40px] text-center text-[16px] text-[#8a8a8a]">Customer not found.</p>
          <button
            type="button"
            onClick={() => navigate('/admin-users')}
            className="mt-[20px] mx-auto h-[46px] w-[200px] rounded-[8px] bg-[#5c9df5] text-white text-[16px] font-semibold"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[110px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate('/admin-users')}
          className="mt-[12px] flex w-fit items-center gap-[4px] text-[16px] font-medium text-black"
        >
          <span>{'<'}</span>
          <span>Back</span>
        </button>

        <div className="mt-[14px] flex justify-center">
          <div className="rounded-[8px] bg-[#5c9df5] px-4 py-[8px]">
            <h1 className="text-[18px] font-semibold text-white">Customer Detail</h1>
          </div>
        </div>

        <div className="mt-[18px] flex justify-center">
          <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#e8f0fe]">
            <span className="text-[28px] font-bold text-[#5c9df5]">
              {(customer.firstName || 'U')[0].toUpperCase()}
            </span>
          </div>
        </div>

        <div className="mt-[16px] space-y-[8px]">
          <InfoRow label="First Name" value={customer.firstName} />
          <InfoRow label="Last Name" value={customer.lastName} />
          <InfoRow label="Email" value={customer.email} />
          <InfoRow label="Phone" value={customer.phone} />
          <InfoRow label="Date of Birth" value={customer.dob} />
          <InfoRow label="Gender" value={customer.gender} />
        </div>

        <div className="mt-[22px]">
          <p className="text-[15px] font-semibold text-[#333333]">Booking History</p>
          <div className="mt-[10px] space-y-[8px]">
            {isLoadingBookings ? (
              <p className="text-[14px] text-[#8a8a8a]">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <div className="rounded-[10px] border border-[#d4d4d4] bg-white px-4 py-5 text-center">
                <p className="text-[14px] text-[#8a8a8a]">No bookings for this customer.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <button
                  key={booking._id}
                  type="button"
                  onClick={() => navigate('/admin-booking-detail', { state: { booking } })}
                  className="w-full rounded-[10px] border border-[#d4d4d4] bg-white px-[14px] py-[10px] text-left"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-[#333333]">{booking.bookingId}</p>
                    <span className={`text-[13px] font-semibold ${statusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="mt-[2px] text-[13px] text-[#9a9a9a]">
                    {booking.dateLabel} | {booking.timeLabel}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="absolute bottom-[16px] left-[14px] right-[14px] rounded-[10px] border border-[#d2d2d2] bg-[#f8f8f8] px-4 py-2 shadow-sm">
          <div className="flex items-end justify-between">
            <button
              type="button"
              onClick={() => navigate('/admin-dashboard')}
              className="flex min-w-[64px] flex-col items-center justify-center gap-[2px]"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke="#888888" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] leading-none text-black">Dashboard</span>
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
                <circle cx="9" cy="7" r="4" stroke="#5c9df5" strokeWidth="2" />
                <path d="M1 21C1 16.6 4.6 13 9 13C13.4 13 17 16.6 17 21" stroke="#5c9df5" strokeWidth="2" strokeLinecap="round" />
                <path d="M17 11C19.2 11 21 12.8 21 15V21" stroke="#5c9df5" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17" cy="7" r="3" stroke="#5c9df5" strokeWidth="2" />
              </svg>
              <span className="text-[10px] leading-none text-[#5c9df5]">Customers</span>
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
