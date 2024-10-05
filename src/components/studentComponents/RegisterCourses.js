// src/components/RegisterCoursesPage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axios";
import {
	getAccessToken,
	getEmailFromToken,
	getFacultyFromToken,
	getRoleFromToken,
} from "../../authService";
import { toast } from "react-toastify";
import URL from "../../constants/api-urls";
import Dashboard from "../Dashboard";

const RegisterCoursesPage = () => {
	const [availableCourses, setAvailableCourses] = useState([]);
	const [selectedCourseIds, setSelectedCourseIds] = useState([]); // Changed to store courseIds only
	const [remainingCreditHours, setRemainingCreditHours] = useState(0);
	const navigate = useNavigate();

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	// Fetch available courses and student data
	useEffect(() => {
		const fetchAvailableCourses = async () => {
			try {
				const studentResponse = await axiosInstance.get(
					`${URL.GET_STUDENT_BY_EMAIL}${email}`
				);
				setRemainingCreditHours(studentResponse.data.totalCreditHours);

				const coursesResponse = await axiosInstance.get(
					`${URL.GET_AVAILABLE_COURSES}${email}`
				);
				setAvailableCourses(coursesResponse.data.$values);
			} catch (error) {
				console.error("Error fetching courses or student data:", error);
			}
		};
		fetchAvailableCourses();
	}, [email]);

	// Handle course selection (multiple courses)
	const handleCourseSelection = (course) => {
		const isAlreadySelected = selectedCourseIds.includes(course.courseId);

		if (isAlreadySelected) {
			// If the course is already selected, unselect it
			const updatedSelectedCourseIds = selectedCourseIds.filter(
				(selectedCourseId) => selectedCourseId !== course.courseId
			);
			setSelectedCourseIds(updatedSelectedCourseIds);
			setRemainingCreditHours(remainingCreditHours + course.creditHours);
		} else {
			// Select the new course
			if (remainingCreditHours >= course.creditHours) {
				setSelectedCourseIds([...selectedCourseIds, course.courseId]);
				setRemainingCreditHours(remainingCreditHours - course.creditHours);
			} else {
				toast.error("Not enough remaining credit hours to select this course.");
			}
		}
		console.log("selected courses: ", selectedCourseIds);
	};

	// Submit selected courses
const handleSubmit = async () => {
	if (selectedCourseIds.length === 0) {
		toast.error("No courses selected.", { autoClose: 1500 });
		return;
	}

	try {
		// Call the API with the selected course IDs directly
		await axiosInstance.post(`${URL.REGISTER_COURSES}${email}`, selectedCourseIds); // Pass array directly
		toast.success("Courses registered successfully!", { autoClose: 1500 });

		// Update the student's registration status
		await axiosInstance.put(`${URL.UPDATE_STUDENT_REGISTRATION}${email}`);
		navigate(`/student/${email}`);
	} catch (error) {
		toast.error("Error registering courses.", { autoClose: 1500 });
	}
};

	// Handle back button
	const handleBack = () => {
		navigate(`/student/${email}`);
	};

	return (
		<div className="min-h-screen bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<h1 className="text-3xl font-bold mb-4">Register for Courses</h1>
				<p className="text-lg">
					Remaining Credit Hours: {remainingCreditHours}
				</p>

				{/* Display available courses */}
				<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
					{availableCourses.map((course) => {
						const isSelected = selectedCourseIds.includes(course.courseId);
						return (
							<div key={course.courseId} className="bg-gray-200 p-4 rounded-lg">
								<h2 className="text-xl font-bold">{course.name}</h2>
								<p className="text-md">Credit Hours: {course.creditHours}</p>
								<button
									className={`mt-2 py-2 px-4 rounded-lg ${
										isSelected
											? "bg-red-500 hover:bg-red-600"
											: "bg-green-500 hover:bg-green-600"
									} text-white`}
									onClick={() => handleCourseSelection(course)}
								>
									{isSelected ? "Unselect Course" : "Select Course"}
								</button>
							</div>
						);
					})}
				</div>

				{/* Submit and Back buttons side by side */}
				<div className="mt-8 flex justify-between">
					<button
						className="bg-blue-500 hover:bg-blue-600 text-white py-4 px-4 rounded-lg shadow-md w-1/2 transition duration-150 mr-2"
						onClick={handleSubmit}
						disabled={
							selectedCourseIds.length === 0 || remainingCreditHours < 0
						}
					>
						Submit Registration
					</button>
					<button
						onClick={handleBack}
						className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-400 w-1/2 mr-2"
					>
						Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default RegisterCoursesPage;
