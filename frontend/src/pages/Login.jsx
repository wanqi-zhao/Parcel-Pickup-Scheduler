import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/api/auth/login', formData);
      login(response.data);
      navigate('/tasks');
    } catch (error) {
      console.error(error);
      alert('Login failed. Please check your email and password.');
    }
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

        <div className="mt-20 flex flex-col items-center">
          <img
            src="/logo512.png"
            alt="App logo"
            className="w-[120px] h-[120px] object-contain rounded-full"
          />

          <h1 className="mt-6 text-[28px] font-bold text-black">Login</h1>
          <p className="mt-2 text-[14px] text-gray-600">Parcel Pickup Scheduler</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10">
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-black mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-[48px] rounded-[12px] border border-gray-300 px-4 outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[14px] font-medium text-black mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full h-[48px] rounded-[12px] border border-gray-300 px-4 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-[48px] rounded-[12px] bg-[#bfbfbf] text-white text-[18px] font-semibold"
          >
            Log In
          </button>
        </form>

        <div className="mt-8">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] flex-1 bg-[#5f5f5f]" />
            <span className="text-[15px] text-black font-medium">Log in with</span>
            <div className="h-[1px] flex-1 bg-[#5f5f5f]" />
          </div>

          <div className="mt-5 flex items-center justify-center gap-6">
            <img src="/facebook.jpeg" alt="Facebook" className="w-[44px] h-[44px] object-contain" />
            <img src="/google.jpeg" alt="Google" className="w-[44px] h-[44px] object-contain" />
            <img src="/email.jpeg" alt="Email" className="w-[44px] h-[44px] object-contain" />
            <img src="/phone.jpeg" alt="Phone" className="w-[44px] h-[44px] object-contain" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="mt-8 w-full text-[15px] text-black underline"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
