// src/components/DoctorLandingPage.js
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
import { toast } from "react-toastify";

const DoctorLandingPage = () => {
	const [courses, setCourses] = useState([]);
	const navigate = useNavigate();

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	// Fetch doctor's courses
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_COURSES_FOR_DOCTOR}${email}`
				);
				console.log(response.data.$values);
				setCourses(response.data.$values);
			} catch (error) {
				toast.error("Error fetching courses.", { autoClose: 1500 });
				console.error("Error fetching courses: ", error);
			}
		};
		fetchCourses();
	}, [email]);

	if (!courses.length) {
		return <div>Loading...</div>;
	}

	return (
		<div className="min-h-screen bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<h1 className="text-3xl font-bold mb-4">My Courses</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					{courses.map((course) => (
						<div
							key={course.courseId}
							className="bg-gray-200 p-4 rounded-lg shadow-md"
						>
							<h2 className="text-xl font-bold">{course.name}</h2>
							<p>Course ID: {course.courseId}</p>
							<p>Credit Hours: {course.creditHours}</p>
							<p>Semester: {course.semester}</p>
							{/* Handle the departments display */}
							<p>Departments Served:</p>
							<ul className="list-disc pl-6">
								{course.departments?.$values?.map((department, index) => {
									// If the department has a $ref, look for the referenced department in the courses array
									if (department.$ref) {
										const refDepartment = courses
											.flatMap((c) => c.departments?.$values || [])
											.find((d) => d.$id === department.$ref);
										return (
											<li key={`department-${index}`}>{refDepartment?.name}</li>
										);
									}
									return <li key={`department-${index}`}>{department.name}</li>;
								})}
							</ul>

							<p>
								Contains Practical/Project:{" "}
								{course.containsPracticalOrProject ? "Yes" : "No"}
							</p>
							<p>Has Assistants: {course.haveAssistants ? "Yes" : "No"}</p>
							<button
								onClick={() => navigate(`/doctor/course/${course.courseId}`)}
								className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
							>
								View Students
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default DoctorLandingPage;
