import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../axios"; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { getAccessToken, getFacultyFromToken } from "../../../authService";

const DoctorDetails = () => {
	const { email } = useParams();
	const [doctorData, setDoctorData] = useState(null);
	const [coursesData, setCoursesData] = useState([]); // State to hold courses
	const navigate = useNavigate();

	const token = getAccessToken();
	const facultyOfAdmin = getFacultyFromToken(token);

	useEffect(() => {
		const fetchDoctorData = async () => {
			try {
				const response = await axiosInstance.get(`${URL.GET_DOCTOR}${email}`);
				setDoctorData(response.data);

				// Fetch courses assigned to the doctor
				const courses = response.data.courses.$values; // Adjust based on actual API response
				if (courses.length > 0) {
					await fetchCourses(courses);
				}
			} catch (error) {
				console.error("Error fetching doctor data:", error);
			}
		};

		fetchDoctorData();
	}, [email]);

	// Function to fetch course details for the specific doctor
	const fetchCourses = async (courses) => {
		const coursePromises = courses.map(async (course) => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_COURSE}${facultyOfAdmin}/${course.courseId}`
				); // Adjust URL as needed
				return response.data; // Return course data
			} catch (error) {
				console.error(`Error fetching course ${course.courseId}:`, error);
				return null; // Handle error gracefully
			}
		});

		const results = await Promise.all(coursePromises);
		setCoursesData(results.filter(Boolean)); // Set only successful results
	};

	if (!doctorData) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex items-center justify-center min-h-screen bg-university-gradient">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h1 className="text-2xl font-bold text-center mb-4">Doctor Details</h1>
				<div className="space-y-4">
					<p className="text-gray-700">
						<strong>Name:</strong> {doctorData.name}
					</p>
					<p className="text-gray-700">
						<strong>Email:</strong> {doctorData.email}
					</p>
					<p className="text-gray-700">
						<strong>Backup Email:</strong> {doctorData.backupEmail}
					</p>
					<p className="text-gray-700">
						<strong>Role:</strong> {doctorData.role}
					</p>
					<p className="text-gray-700">
						<strong>Faculty:</strong> {doctorData.faculty}
					</p>					
					{/* Courses Section */}
					<p className="text-gray-700">
						<strong>Courses:</strong>
					</p>
					<ul className="list-disc pl-5">
						{" "}
						{/* Padding on the ul ensures bullets are indented */}
						{coursesData.length > 0 ? (
							coursesData.map((course, index) => (
								<li key={index} className="text-gray-700">
									{course.name}
								</li>
							))
						) : (
							<li className="text-gray-700">No courses assigned</li>
						)}
					</ul>
				</div>
				<div className="flex justify-center mt-4">
					<button
						onClick={() => navigate(-1)}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default DoctorDetails;
