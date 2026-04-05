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

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[8px] border border-[#d0d0d0] bg-white px-[14px] py-[10px]">
      <p className="text-[12px] text-[#888888]">{label}</p>
      <p className="mt-[2px] text-[15px] text-[#333333]">{value || '—'}</p>
    </div>
  );
}

export default function AdminProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await axiosInstance.delete('/api/admin/account', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      logout();
      navigate('/');
    } catch {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="relative w-[390px] min-h-[844px] bg-white px-[20px] pt-[10px] flex flex-col">
        <StatusBar />

        <button
          type="button"
          onClick={() => navigate('/admin-dashboard')}
          className="mt-[10px] flex w-fit items-center gap-[2px] text-[15px] font-medium text-black"
        >
          <span>{'<'}</span>
          <span>Back</span>
        </button>

        <button
          type="button"
          className="mt-[10px] w-full h-[46px] rounded-[8px] bg-[#5c9df5] text-[18px] font-semibold text-white"
        >
          Admin Details
        </button>

        <div className="mt-[20px] space-y-[10px]">
          <InfoRow
            label="Name"
            value={user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : ''}
          />
          <InfoRow label="Email" value={user?.email || ''} />
          <InfoRow label="Date Of Birth" value={user?.dob || ''} />
          <InfoRow label="Gender" value={user?.gender || ''} />
          <InfoRow label="Staff ID" value={user?.adminId || ''} />
        </div>

        <div className="mt-auto pb-[30px] pt-[30px] space-y-[12px]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-[50px] rounded-[8px] border border-[#d0d0d0] bg-white text-[16px] font-semibold text-[#222222]"
          >
            Log Out
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="w-full h-[50px] rounded-[8px] border border-[#d0d0d0] bg-white text-[16px] font-semibold text-[#ef4444]"
          >
            Delete Account
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-[inherit]">
            <div className="mx-[30px] w-full rounded-[12px] bg-white px-[24px] py-[24px] shadow-lg">
              <p className="text-center text-[16px] font-bold text-[#222222]">
                Delete account confirmation
              </p>
              <p className="mt-[10px] text-center text-[14px] text-[#666666]">
                Are you sure you want to delete your account?
              </p>
              <div className="mt-[20px] flex gap-[12px]">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-[42px] rounded-[8px] border border-[#5c9df5] bg-white text-[15px] font-semibold text-[#5c9df5]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
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
