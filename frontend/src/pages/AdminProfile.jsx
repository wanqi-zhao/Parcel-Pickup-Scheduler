import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminProfile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-[#ececec] flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-[#ececec] px-6 pt-6">
        <div className="flex items-center justify-between text-[14px] font-semibold text-black">
          <span>9:41</span>
          <div className="flex items-center gap-2">
            <div className="w-4 h-2 border border-black rounded-sm" />
            <div className="w-5 h-2 border border-black rounded-sm" />
            <div className="w-6 h-3 border border-black rounded-sm" />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center text-center">
          <div className="w-[120px] h-[120px] rounded-full bg-white shadow-md flex items-center justify-center">
            <span className="text-[18px] font-bold text-[#4f4f4f]">Admin</span>
          </div>

          <h1 className="mt-6 text-[28px] font-bold text-black">Admin Profile</h1>
          <p className="mt-2 text-[14px] text-gray-600">Parcel Pickup Scheduler</p>
        </div>

        <div className="mt-10 rounded-[16px] bg-white p-5 shadow-sm space-y-4">
          <div>
            <p className="text-[12px] text-gray-500">First Name</p>
            <p className="text-[16px] font-semibold text-black">{user?.firstName || 'Wanqi'}</p>
          </div>

          <div>
            <p className="text-[12px] text-gray-500">Last Name</p>
            <p className="text-[16px] font-semibold text-black">{user?.lastName || 'Zhao'}</p>
          </div>

          <div>
            <p className="text-[12px] text-gray-500">Admin ID</p>
            <p className="text-[16px] font-semibold text-black">{user?.adminId || 'N12544591'}</p>
          </div>

          <div>
            <p className="text-[12px] text-gray-500">Work Email</p>
            <p className="text-[16px] font-semibold text-black">{user?.email || 'admin@parcelpickup.com'}</p>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full h-[48px] rounded-[12px] border border-black bg-white text-black text-[16px] font-semibold"
          >
            Back to Welcome
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full h-[48px] rounded-[12px] bg-black text-white text-[16px] font-semibold"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
