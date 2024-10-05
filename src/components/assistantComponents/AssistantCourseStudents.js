// src/components/DoctorCourseStudentsPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import Dashboard from "../Dashboard";
import URL from "../../constants/api-urls";
import { toast } from "react-toastify";
import {
	getAccessToken,
	getEmailFromToken,
	getFacultyFromToken,
	getRoleFromToken,
} from "../../authService";

const AssistantCourseStudentsPage = () => {
	const { courseId } = useParams(); // Get courseId from route parameters
	const [students, setStudents] = useState([]); // State to hold the students data
	const navigate = useNavigate(); // Navigation function

	// Extract token, email, faculty, and role from the authentication service
	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	// Fetch students enrolled in the course
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_STUDENTS_BY_COURSE_FOR_ASSISTANT}${courseId}`
				);
				setStudents(response.data.$values); // Set the students data
			} catch (error) {
				toast.error("Error fetching students.", { autoClose: 1500 }); // Show error toast if the fetch fails
			}
		};
		fetchStudents();
	}, [courseId]);

	// Render loading state if students are still being fetched
	if (!students.length) {
		return <div>Loading...</div>;
	}

	// Render the students data once it's fetched
	return (
		<div className="min-h-screen bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Students in Course {courseId}</h1>
					<button
						onClick={() => navigate(-1)}
						className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
					>
						Back
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{students.map((student) => (
						<div
							key={student.studentId}
							className="bg-gray-200 p-4 rounded-lg shadow-md"
						>
							{/* Display student details */}
							<h2 className="text-xl font-bold">{student.studentId}</h2>
							<p>Email: {student.email}</p>
							<p>Current Semester: {student.currentSemester}</p>
							<p>Department: {student.department}</p>
							<button
								onClick={() =>
									navigate(
										`/assistant/course/${courseId}/student/${student.email}`
									)
								}
								className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
							>
								View Degrees
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default AssistantCourseStudentsPage;
