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

const TABS = ['All', 'Confirmed', 'Cancelled'];

export default function ManageBookings() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchBookings = async (tab) => {
    if (!user?.token) return;

    try {
      setIsLoading(true);
      setErrorMessage('');

      const params = tab !== 'All' ? `?status=${tab}` : '';

      const res = await axiosInstance.get(`/api/admin/bookings${params}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setBookings(res.data || []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;

    try {
      await axiosInstance.delete(`/api/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setBookings((prev) => prev.filter((booking) => booking._id !== id));
    } catch {
      setErrorMessage('Failed to delete booking.');
    }
  };

  const filteredBookings = bookings.filter((booking) => {
    const query = searchText.trim().toLowerCase();
    const bookingId = String(booking.bookingId || '').toLowerCase();
    const customerName = String(
      booking.customerName ||
        `${booking.userId?.firstName || ''} ${booking.userId?.lastName || ''}`.trim() ||
        'Customer'
    ).toLowerCase();

    return bookingId.includes(query) || customerName.includes(query);
  });

  const getStatusLabel = (status) => {
    if (status === 'Upcoming') return 'Confirmed';
    return status || 'Unknown';
  };

  const getStatusClass = (status) => {
    const label = getStatusLabel(status);

    if (label === 'Confirmed') return 'text-[#22c55e]';
    if (label === 'Cancelled') return 'text-[#ff4a43]';
    return 'text-[#8a8a8a]';
  };

  const isUpcoming = (status) => status === 'Upcoming' || status === 'Confirmed';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-white px-[18px] pt-[10px] pb-[24px] flex flex-col">
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
          className="mt-[12px] h-[46px] w-full rounded-[8px] bg-[#5c9df5] text-[18px] font-semibold text-white"
        >
          Manage Bookings
        </button>

        <div className="mt-[20px]">
          <input
            type="text"
            placeholder="Search booking ID/ User"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="h-[42px] w-full rounded-[8px] border border-[#d7d7d7] bg-white px-[14px] text-[14px] text-[#333333] placeholder:text-[#b5b5b5] outline-none"
          />
        </div>

        {errorMessage && (
          <div className="mt-[10px] rounded-[8px] bg-red-100 px-4 py-2 text-[13px] text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-[16px] flex-1">
          {isLoading ? (
            <p className="mt-[40px] text-center text-[14px] text-[#8a8a8a]">Loading...</p>
          ) : filteredBookings.length === 0 ? (
            <p className="mt-[40px] text-center text-[14px] text-[#8a8a8a]">
              No bookings found.
            </p>
          ) : (
            <div className="space-y-[14px]">
              {filteredBookings.map((booking) => {
                const customerName =
                  booking.customerName ||
                  `${booking.userId?.firstName || ''} ${booking.userId?.lastName || ''}`.trim() ||
                  'Customer';

                return (
                  <div
                    key={booking._id}
                    className="rounded-[8px] border border-[#d7d7d7] bg-white px-[10px] py-[10px]"
                  >
                    <p className="text-[16px] font-bold leading-none text-[#303030]">
                      {booking.bookingId || 'BK-000'} | {customerName}
                    </p>

                    <p className="mt-[10px] text-[14px] font-semibold leading-none text-[#4f98ff]">
                      {booking.dateLabel || 'Tue, 17 Mar'}|{booking.timeLabel || '9:00-9:30'}
                    </p>

                    <p className={`mt-[9px] text-[14px] leading-none ${getStatusClass(booking.status)}`}>
                      Status: {getStatusLabel(booking.status)}
                    </p>

                    <div className="mt-[10px] flex justify-end gap-[8px]">
                      {isUpcoming(booking.status) ? (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              navigate('/admin-update-booking', { state: { booking } })
                            }
                            className="h-[30px] rounded-[6px] bg-[#5c9df5] px-[12px] text-[13px] font-semibold text-white"
                          >
                            Update
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(booking._id)}
                            className="h-[30px] rounded-[6px] bg-[#ff4a43] px-[12px] text-[13px] font-semibold text-white"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            navigate('/admin-update-booking', { state: { booking } })
                          }
                          className="h-[30px] rounded-[6px] bg-[#5c9df5] px-[14px] text-[13px] font-semibold text-white"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-[16px] pb-[6px] flex justify-center">
          <div className="flex gap-[6px]">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`h-[30px] min-w-[72px] rounded-[6px] px-[14px] text-[13px] font-medium ${
                  activeTab === tab
                    ? 'bg-[#5c9df5] text-white'
                    : 'border border-[#cfcfcf] bg-white text-[#7a7a7a]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}