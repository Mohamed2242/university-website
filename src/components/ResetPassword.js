import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';
import { toast } from 'react-toastify';
import URL from '../constants/api-urls';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    number: false,
    upper: false,
    lower: false,
    alphanumeric: false,
  });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const email = searchParams.get('email');
  const token = searchParams.get('code');

  // Password validation logic
  const validatePassword = (password) => {
    const length = password.length >= 6;
    const number = /\d/.test(password);
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const alphanumeric = /\W/.test(password);

    setPasswordRequirements({ length, number, upper, lower, alphanumeric });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Check if all requirements are met before submitting
    const { length, number, upper, lower, alphanumeric } = passwordRequirements;
    if (!length || !number || !upper || !lower || !alphanumeric) {
      toast.error("Please meet all password requirements.");
      return;
    }

    const resetPasswordData = {
      email,
      emailToken: token,
      newPassword,
      confirmPassword,
    };

    try {
      const response = await axiosInstance.post(`${URL.RESETPASSWORD}`, resetPasswordData);

      if (response.status === 200) {
        toast.success('Password reset successful. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.', { autoClose: 1500 });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-university-gradient p-4">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Reset Your Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
            />
            {/* Password Requirements */}
            <ul className="mt-2 text-sm">
              <li className={passwordRequirements.length ? "text-green-600" : "text-red-600"}>
                At least 6 characters
              </li>
              <li className={passwordRequirements.number ? "text-green-600" : "text-red-600"}>
                At least one number
              </li>
              <li className={passwordRequirements.upper ? "text-green-600" : "text-red-600"}>
                At least one uppercase letter
              </li>
              <li className={passwordRequirements.lower ? "text-green-600" : "text-red-600"}>
                At least one lowercase letter
              </li>
              <li className={passwordRequirements.alphanumeric ? "text-green-600" : "text-red-600"}>
                At least one special character
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
            Reset Password
          </button>

          <div className="mt-4 text-center">
            <p><a href="/login" className="text-blue-500">Login</a></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
