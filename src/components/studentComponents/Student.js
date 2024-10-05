// src/components/StudentLandingPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import {
	getAccessToken,
	getEmailFromToken,
	getFacultyFromToken,
	getRoleFromToken,
} from "../../authService";
import Dashboard from "../Dashboard";
import URL from "../../constants/api-urls";

const StudentLandingPage = () => {
	const [studentData, setStudentData] = useState(null);
	const navigate = useNavigate();

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				const response = await axiosInstance.get(`${URL.GET_STUDENT_BY_EMAIL}${email}`);
				setStudentData(response.data);
				console.log(response.data);
			} catch (error) {
				console.error("Error fetching student data:", error);
			}
		};
		fetchStudentData();
	}, [email]);

	if (!studentData) {
		return <div>Loading...</div>;
	}

	// Check if the student has already registered for courses
	const hasRegisteredCourses = studentData.hasRegisteredCourses; // Assuming this field exists
	const totalCreditHours = studentData.totalCreditHours; // Assuming this field exists

	return (
		<div className="min-h-screen bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<p className="text-lg">Department: {studentData.department}</p>
				<p className="text-lg">Semester: {studentData.currentSemester}</p>

				{/* Conditionally render Total Credit Hours */}
				{!hasRegisteredCourses && (
					<p className="text-lg">Total Credit Hours: {totalCreditHours}</p>
				)}

				<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{!hasRegisteredCourses ? (
						<button
							className="bg-green-500 hover:bg-green-600 text-white py-4 px-4 rounded-lg shadow-md w-full transition duration-300"
							onClick={() => navigate(`/student/registerCourses/${email}`)}
						>
							Register for Courses
						</button>
					) : (
						<button
							className="bg-gray-500 text-white py-4 px-4 rounded-lg shadow-md w-full transition duration-300"
							disabled
						>
							Courses Already Registered
						</button>
					)}

					<button
						className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-4 rounded-lg shadow-md w-full transition duration-300"
						onClick={() => navigate(`/student/studentDegrees/${email}`)}
					>
						View My Degrees
					</button>
				</div>
			</div>
		</div>
	);
};

export default StudentLandingPage;
