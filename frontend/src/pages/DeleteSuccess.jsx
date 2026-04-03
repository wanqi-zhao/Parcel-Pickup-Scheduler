import { useNavigate } from 'react-router-dom';

import plantsImage from '../assets/plants.jpeg';
import facebookIcon from '../assets/facebook.jpeg';
import googleIcon from '../assets/google.jpeg';
import emailIcon from '../assets/email.jpeg';
import phoneIcon from '../assets/phone.jpeg';

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

export default function DeleteSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-white px-[14px] pt-[10px] pb-[24px] flex flex-col">
        <StatusBar />

        <div className="mt-[54px] flex justify-center">
          <img
            src={plantsImage}
            alt="Plants"
            className="w-[160px] object-contain select-none"
          />
        </div>

        <div className="mt-[88px] px-[8px] text-center">
          <p className="text-[18px] font-semibold text-[#ff3b30]">
            Your account has been deleted successfully!
          </p>
        </div>

        <div className="mt-auto pb-[10px]">
          <div className="flex items-center justify-center gap-[12px]">
            <div className="h-[1px] w-[88px] bg-[#8a8a8a]" />
            <span className="text-[15px] text-black">Log in with</span>
            <div className="h-[1px] w-[88px] bg-[#8a8a8a]" />
          </div>

          <div className="mt-[18px] flex items-center justify-center gap-[22px]">
            <img src={facebookIcon} alt="Facebook" className="h-[34px] w-[34px] object-contain" />
            <img src={googleIcon} alt="Google" className="h-[34px] w-[34px] object-contain" />
            <img src={emailIcon} alt="Email" className="h-[34px] w-[34px] object-contain" />
            <img src={phoneIcon} alt="Phone" className="h-[34px] w-[34px] object-contain" />
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer-login')}
            className="mt-[16px] h-[34px] w-full rounded-[8px] bg-[#d3d3d3] text-[16px] font-semibold text-white"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}