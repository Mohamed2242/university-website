// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../authService';
import axios from 'axios';
import { toast } from "react-toastify";

const Dashboard = ({ email, faculty, role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens(); // Clear the tokens
    axios.defaults.headers.common["Authorization"] = null; // Clear the Authorization header
    toast.warning("Logged out", { autoClose: 1500 });

    // Delay navigation until toast has time to show
    setTimeout(() => {
      navigate('/login'); // Navigate to login page
    }, 100); // Adjust delay as needed
  };

  return (
    <div className="flex flex-col min-screen">
      {/* Navbar */}
      <nav className="flex flex-col md:flex-row items-center justify-between bg-gray-900 text-white p-4">
        {/* Left Section: Role */}
        <div className="flex items-center mb-4 md:mb-0">
          <span className="text-3xl font-bold mr-2">🎓</span>
          <h2 className="text-2xl md:text-3xl font-semibold">Welcome, {role}</h2>
        </div>

        {/* Middle Section: Faculty */}
        <p className="text-lg font-medium mr-4 mb-2 md:mb-0">{faculty}</p>

        {/* Right Section: Email and Logout */}
        <div className="flex flex-col md:flex-row items-center">
          <p className="text-lg font-medium mr-4">{email}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-300 mt-2 md:mt-0"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
