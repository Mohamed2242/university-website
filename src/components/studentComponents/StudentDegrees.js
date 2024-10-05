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

const StudentDegreesPage = () => {
	const [degrees, setDegrees] = useState([]);
	const [semester, setSemester] = useState(0);
	const [currentSemester, setCurrentSemester] = useState(0);
	const [gpa, setGPA] = useState(null); // For storing GPA
	const [cgpa, setCGPA] = useState(null); // For storing CGPA
	const navigate = useNavigate();

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	// Fetch current semester and student's degrees
	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				const studentResponse = await axiosInstance.get(
					`${URL.GET_STUDENT_BY_EMAIL}${email}`
				);
				setCurrentSemester(studentResponse.data.currentSemester); // Assuming this field exists in the response
				setSemester(studentResponse.data.currentSemester); // Set initial semester to current
                //setCGPA(studentResponse.data.cgpa);
				// Fetch CGPA
				await fetchCGPA();
			} catch (error) {
				console.error("Error fetching student data:", error);
			}
		};
		fetchStudentData();
	}, [email]);

	// Fetch GPA for the selected semester
	const fetchGPA = async () => {
		if (semester < 1 || semester > 8) {
			toast.error("Please enter a valid semester.", { autoClose: 1500 });
			return;
		}
		try {
			const response = await axiosInstance.get(
				`${URL.GET_GPA}${email}/${semester}`
			);
			setGPA(response.data.gpa);
		} catch (error) {
			toast.error("Error fetching GPA.", { autoClose: 1500 });
			console.error("Error: ", error);
		}
	};

	// Fetch CGPA
	const fetchCGPA = async () => {
		try {
			const response = await axiosInstance.get(
				`${URL.GET_CGPA}${email}`
			);
			setCGPA(response.data.cgpa);
		} catch (error) {
			toast.error("Error fetching CGPA.", { autoClose: 1500 });
			console.error("Error: ", error);
		}
	};

	const fetchDegrees = async () => {
		if (semester < 1 || semester > 8) {
			toast.error("Please enter a valid semester.", { autoClose: 1500 });
			return;
		}
		try {
			const response = await axiosInstance.get(
				`${URL.GET_STUDENT_DEGREES_FOR_SEMESTER}${email}/${semester}`
			);
			setDegrees(response.data.courses.$values); // Updated to handle the 'courses' array from the DTO

			// Fetch GPA for the selected semester
			await fetchGPA();
		} catch (error) {
			toast.error("Error fetching degrees.", { autoClose: 1500 });
		}
	};

	const handleShowDegrees = () => {
		fetchDegrees();
	};

	// Handle back button
	const handleBack = () => {
		navigate(`/student/${email}`);
	};

	return (
		<div className="min-h-screen bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
				<h1 className="text-3xl font-bold mb-4">Student Degrees</h1>
				
				<div className="flex items-center mb-4">
					<label htmlFor="semester" className="mr-2 font-semibold">
						Semester:
					</label>
					<input
						type="number"
						id="semester"
						value={semester}
						onChange={(e) => setSemester(e.target.value)}
						className="border border-gray-300 rounded-lg p-2 w-20"
						min={1}
						max={8} // Adjust according to the expected range
						placeholder={currentSemester}
					/>
					<button
						onClick={handleShowDegrees}
						className="ml-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition duration-150"
					>
						Show
					</button>
				</div>

				{/* Display GPA and CGPA */}
				<div className="mb-6">
					{gpa !== null && (
						<p className="text-lg font-semibold">GPA for Semester {semester}: {gpa}</p>
					)}
					{cgpa !== null && (
						<p className="text-lg font-semibold">Cumulative GPA (CGPA): {cgpa}</p>
					)}
				</div>

				{/* Display degrees if available */}
				{degrees.length > 0 ? (
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
						{degrees.map((degree, index) => (
							<div key={index} className="bg-gray-200 p-4 rounded-lg">
								<h2 className="text-xl font-bold">{degree.name}</h2>
								<p className="text-md">Credit Hours: {degree.creditHours}</p>
								<br></br>

								{/* Only show Mid Term if courseMidTerm is greater than 0 */}
								{degree.courseMidTerm > 0 && (
									<p className="text-md">
										Mid Term: {degree.studentMidTerm} / {degree.courseMidTerm}
									</p>
								)}

								{/* Only show Final Exam if courseFinalExam is greater than 0 */}
								{degree.courseFinalExam > 0 && (
									<p className="text-md">
										Final Exam: {degree.studentFinalExam} / {degree.courseFinalExam}
									</p>
								)}

								{/* Only show Quizzes if courseQuizzes is greater than 0 */}
								{degree.courseQuizzes > 0 && (
									<p className="text-md">
										Quizzes: {degree.studentQuizzes} / {degree.courseQuizzes}
									</p>
								)}

								{/* Only show Practical if ContainsPracticalOrProject is true */}
								{degree.containsPracticalOrProject && (
									<p className="text-md">
										Practical: {degree.studentPractical ?? 0} / {degree.coursePractical ?? "N/A"}
									</p>
								)}

								<p className="text-md font-semibold">
									Total Marks: {degree.studentTotalMarks} / {degree.courseTotalMarks}
								</p>
							</div>
						))}
					</div>
				) : (
					<p className="mt-4 text-gray-600">
						No degrees found for this semester.
					</p>
				)}

				{/* Back button */}
				<div className="mt-8">
					<button
						onClick={handleBack}
						className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-400"
					>
						Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default StudentDegreesPage;
