import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

import facebookIcon from '../assets/facebook.jpeg';
import googleIcon from '../assets/google.jpeg';
import emailIcon from '../assets/email.jpeg';
import phoneIcon from '../assets/phone.jpeg';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    adminId: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update field state and clear the current error message.
  const handleChange = (e) => {
    setErrorMessage('');
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Validate only the fields required by the current admin login endpoint.
  const validateForm = () => {
    if (!formData.adminId.trim()) {
      return 'Please enter your admin ID.';
    }

    if (!emailRegex.test(formData.email.trim().toLowerCase())) {
      return 'Please enter a valid work email address.';
    }

    if (!formData.password || formData.password.length < 6) {
      return 'Please enter a valid password.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await axiosInstance.post('/api/auth/admin/login', {
        adminId: formData.adminId.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      // Keep the existing admin auth flow unchanged.
      login(response.data);

      // Redirect to the admin landing page after a successful login.
      navigate('/admin-profile');
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message || 'Admin login failed. Please check your details and try again.';
      setErrorMessage(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-[390px] min-h-[844px] bg-white px-[18px] pt-[10px] pb-[24px] flex flex-col">
        {/* iPhone 14 status bar */}
        <div className="flex items-center justify-between px-[2px]">
          <span className="text-[16px] font-semibold tracking-[-0.2px] text-black">
            9:41
          </span>

          <div className="flex items-center gap-[6px]">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
              <rect x="1" y="7" width="2.2" height="4" rx="1" fill="#000000" />
              <rect x="5" y="5.5" width="2.2" height="5.5" rx="1" fill="#000000" />
              <rect x="9" y="4" width="2.2" height="7" rx="1" fill="#000000" />
              <rect x="13" y="2.5" width="2.2" height="8.5" rx="1" fill="#000000" />
            </svg>

            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                d="M1 4.5C4.7 1.4 11.3 1.4 15 4.5"
                stroke="#000000"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M3.5 7C6 4.9 10 4.9 12.5 7"
                stroke="#000000"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M6.3 9.3C7.2 8.6 8.8 8.6 9.7 9.3"
                stroke="#000000"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <circle cx="8" cy="10.4" r="1" fill="#000000" />
            </svg>

            <div className="relative h-[12px] w-[25px] rounded-[3px] border-[1.6px] border-black">
              <div className="absolute left-[1.5px] top-[1.5px] h-[7px] w-[18px] rounded-[2px] bg-black" />
              <div className="absolute -right-[3px] top-[3px] h-[4px] w-[2px] rounded-r-[1px] bg-black" />
            </div>
          </div>
        </div>

        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-[16px] flex w-fit items-center gap-[6px] text-[16px] font-medium text-black"
        >
          <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
            <path
              d="M8 2L2 8L8 14"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Back</span>
        </button>

        {/* Header */}
        <div className="mt-[56px] text-center">
          <h1 className="text-[34px] font-bold leading-[1.02] tracking-[-0.5px] text-black">
            Welcome
          </h1>
          <h2 className="text-[34px] font-bold leading-[1.02] tracking-[-0.5px] text-black">
            back to our team
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="mt-[42px]">
          <div className="space-y-[16px]">
            <div className="flex h-[46px] items-center rounded-[8px] border border-[#cfcfcf] bg-white px-[14px]">
              <input
                type="text"
                name="adminId"
                placeholder="Enter your admin ID"
                value={formData.adminId}
                onChange={handleChange}
                className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-[#b8b8b8]"
                required
              />
            </div>

            <div className="flex h-[46px] items-center rounded-[8px] border border-[#cfcfcf] bg-white px-[14px]">
              <input
                type="email"
                name="email"
                placeholder="Enter your work email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-[#b8b8b8]"
                required
              />
            </div>

            <div className="flex h-[46px] items-center rounded-[8px] border border-[#cfcfcf] bg-white px-[14px]">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent text-[16px] text-black outline-none placeholder:text-[#b8b8b8]"
                required
              />
            </div>
          </div>

          {errorMessage && (
            <div className="mt-[12px] rounded-[8px] bg-red-100 px-4 py-3 text-[13px] text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-[30px] h-[44px] w-full rounded-[8px] bg-[#e9e9e9] text-[17px] font-semibold text-black disabled:opacity-70"
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Bottom section */}
        <div className="mt-[96px] pb-[8px]">
          <div className="flex items-center justify-center gap-[10px]">
            <div className="h-[1px] flex-1 bg-[#c8c8c8]" />
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#d9d9d9]">
              <span className="text-[14px] font-semibold text-[#7a7a7a]">or</span>
            </div>
            <div className="h-[1px] flex-1 bg-[#c8c8c8]" />
          </div>

          <div className="mt-[20px] flex items-center justify-center gap-[24px]">
            <img src={facebookIcon} alt="Facebook" className="h-[40px] w-[40px] object-contain" />
            <img src={googleIcon} alt="Google" className="h-[40px] w-[40px] object-contain" />
            <img src={emailIcon} alt="Email" className="h-[40px] w-[40px] object-contain" />
            <img src={phoneIcon} alt="Phone" className="h-[40px] w-[40px] object-contain" />
          </div>

          <div className="mt-[18px] text-center text-[15px] leading-[1.4]">
            <span className="text-[#6f6f6f]">Already have an account? </span>
            <button
              type="button"
              onClick={() => navigate('/admin-login')}
              className="font-semibold text-[#f0b63f]"
            >
              Log in here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}