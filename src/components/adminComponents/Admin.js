import React from "react";
import Dashboard from "../Dashboard";
import { useNavigate } from "react-router-dom";
import {
	getAccessToken,
	getEmailFromToken,
	getFacultyFromToken,
	getRoleFromToken,
} from "../../authService";

const AdminPage = () => {
	const navigate = useNavigate();

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	return (
		<div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
			{/* Dashboard Header */}
			<Dashboard email={email} faculty={faculty} role={role} />

			{/* Main Content */}
			<div className="max-w-7xl mx-auto py-10 px-6 sm:px-8">
				{/* Page Title */}
				<h1 className="text-4xl font-bold text-gray-700 text-center mb-10">
					Admin Management Dashboard
				</h1>

				{/* Management Buttons Section */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Students Management */}
					<button
						className="bg-green-400 hover:bg-green-500 text-white py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-green-300"
						onClick={() => navigate("/admin/manageStudents")}
					>
						<i className="fas fa-user-graduate text-2xl"></i>
						<p className="text-lg font-semibold mt-2">Students Management</p>
					</button>
					
					{/* Doctor Management */}
					<button
						className="bg-blue-400 hover:bg-blue-500 text-white py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-blue-300"
						onClick={() => navigate("/admin/manageDoctors")}
					>
						<i className="fas fa-user-md text-2xl"></i>
						<p className="text-lg font-semibold mt-2">Doctor Management</p>
					</button>

					{/* Assistant Management */}
					<button
						className="bg-purple-400 hover:bg-purple-500 text-white py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-purple-300"
						onClick={() => navigate("/admin/manageAssistants")}
					>
						<i className="fas fa-chalkboard-teacher text-2xl"></i>
						<p className="text-lg font-semibold mt-2">Assistant Management</p>
					</button>

					{/* Course Management */}
					<button
						className="bg-orange-400 hover:bg-orange-500 text-white py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-orange-300"
						onClick={() => navigate("/admin/manageCourses")}
					>
						<i className="fas fa-book text-2xl"></i>
						<p className="text-lg font-semibold mt-2">Course Management</p>
					</button>

					{/* Department Management */}
					<button
						className="bg-pink-400 hover:bg-pink-500 text-white py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-pink-300"
						onClick={() => navigate("/admin/manageDepartments")}
					>
						<i className="fas fa-building text-2xl"></i>
						<p className="text-lg font-semibold mt-2">Department Management</p>
					</button>

					{/* Admin Management */}
					<button
						className="bg-red-400 hover:bg-red-500 text-white py-4 px-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring focus:ring-red-300"
						onClick={() => navigate("/admin/manageAdmins")}
					>
						<i className="fas fa-user-shield text-2xl"></i>
						<p className="text-lg font-semibold mt-2">Admin Management</p>
					</button>

				</div>
			</div>
		</div>
	);
};

export default AdminPage;
