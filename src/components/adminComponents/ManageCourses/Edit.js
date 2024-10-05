import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios"; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

import { getAccessToken, getFacultyFromToken } from "../../../authService";

const EditCoursePage = () => {
	const { courseId } = useParams(); // Assuming the route contains the courseId
	const [courseData, setCourseData] = useState({
		courseId: "",
		name: "",
		creditHours: "",
		faculty: "",
		semester: "",
		containsPracticalOrProject: false,
		haveAssistants: false,
		midTerm: "",
		finalExam: "",
		quizzes: "",
		practical: "",
		totalMarks: 0,
		departments: [],
	});

	const [departmentsData, setDepartmentsData] = useState([]); // State to hold fetched departments
	const [errors, setErrors] = useState({});

	const token = getAccessToken();
	const facultyOfAdmin = getFacultyFromToken(token);

	const navigate = useNavigate();

	// Calculate totalMarks whenever the relevant fields are updated
	useEffect(() => {
		const { midTerm, finalExam, quizzes, practical } = courseData;
		const calculatedTotalMarks =
			(parseInt(midTerm) || 0) +
			(parseInt(finalExam) || 0) +
			(parseInt(quizzes) || 0) +
			(parseInt(practical) || 0);
		setCourseData((prevData) => ({
			...prevData,
			totalMarks: calculatedTotalMarks,
		}));
	}, [
		courseData.midTerm,
		courseData.finalExam,
		courseData.quizzes,
		courseData.practical,
	]);

	// Fetch course data and departments when the component loads
	useEffect(() => {
		const fetchCourseData = async () => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_COURSE}${facultyOfAdmin}/${courseId}`
				);
				setCourseData(response.data);
				await fetchDepartments(response.data.departments.$values); // Fetch departments after getting course data
			} catch (error) {
				console.error("Error fetching course data:", error);
			}
		};

		fetchCourseData();
	}, [courseId, facultyOfAdmin]);

	// Function to fetch department details
	const fetchDepartments = async (departments) => {
		try {
			const response = await axiosInstance.get(
				`${URL.GET_ALL_DEPARTMENTS}${facultyOfAdmin}`
			); // Fetch all departments
			const allDepartments = response.data.$values;

			// Map the departments and check those that are part of the course
			const updatedDepartments = allDepartments.map((dept) => ({
				...dept,
				checked: departments.some(
					(courseDept) => courseDept.departmentId === dept.departmentId
				),
			}));
			setDepartmentsData(updatedDepartments);
		} catch (error) {
			console.error("Error fetching all departments:", error);
		}
	};

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setCourseData((prevData) => ({
			...prevData,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleDepartmentChange = (event) => {
		const value = event.target.value; // This is expected to be the departmentId

		setCourseData((prevData) => {
			console.log("prevvvv", prevData);

			// Access the $values property correctly
			const currentDepartments = Array.isArray(prevData.departments.$values)
				? prevData.departments.$values
				: [];
			console.log("deppp", prevData.departments);
			console.log("currentDepartments", currentDepartments);

			// Check if the selected departmentId is already in the list
			const isSelected = currentDepartments.some(
				(department) => department.departmentId === value
			);

			if (isSelected) {
				// If already selected, remove it
				return {
					...prevData,
					departments: {
						...prevData.departments,
						$values: currentDepartments.filter(
							(department) => department.departmentId !== value
						),
					},
				};
			} else {
				// Otherwise, add it (create a new object for the department)
				const newDepartment = {
					id: currentDepartments.length + 1,
					departmentId: value,
					name: null,
					faculty: null,
				}; // Adjust as needed
				return {
					...prevData,
					departments: {
						...prevData.departments,
						$values: [...currentDepartments, newDepartment],
					},
				};
			}
		});
	};

	const validateForm = () => {
		const newErrors = {};
		if (!courseData.courseId) newErrors.courseId = "Course ID is required.";
		if (!courseData.name) newErrors.name = "Course name is required.";
		if (
			!courseData.creditHours ||
			isNaN(courseData.creditHours) ||
			courseData.creditHours <= 0
		)
			newErrors.creditHours = "A valid credit hour is required.";
		if (
			!courseData.semester ||
			isNaN(courseData.semester) ||
			courseData.semester < 1 ||
			courseData.semester > 8
		)
			newErrors.semester = "Semester must be a number between 1 and 8.";
		if (!courseData.departments || courseData.departments.length === 0)
			newErrors.departments = "At least one department must be selected.";
		if (!courseData.midTerm) newErrors.midTerm = "Midterm Marks are required.";
		if (!courseData.finalExam)
			newErrors.finalExam = "Final Exam Marks are required.";
		if (!courseData.quizzes) newErrors.quizzes = "Quizzes Marks are required.";
		if (courseData.containsPracticalOrProject && !courseData.practical)
			newErrors.practical =
				"Practical Marks are required when the course contains a practical or project.";
		if (!courseData.totalMarks)
			newErrors.totalMarks = "Total Marks are required.";

		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			toast.error("Please fill all required fields.", { autoClose: 1500 });
			return;
		}

		const payload = {
			courseId: courseData.courseId,
			name: courseData.name,
			creditHours: parseInt(courseData.creditHours),
			faculty: courseData.faculty,
			semester: parseInt(courseData.semester),
			containsPracticalOrProject: courseData.containsPracticalOrProject,
			haveAssistants: courseData.haveAssistants,
			midTerm: parseFloat(courseData.midTerm),
			finalExam: parseFloat(courseData.finalExam),
			quizzes: parseFloat(courseData.quizzes),
			practical: courseData.containsPracticalOrProject
				? parseFloat(courseData.practical)
				: null,
			totalMarks: courseData.totalMarks,
			departments: courseData.departments.$values.map((dept) => ({
				departmentId: dept.departmentId,
			})),
		};

		try {
			await axiosInstance.put(URL.UPDATE_COURSE, payload);
			toast.success("Course updated successfully!", { autoClose: 2000 });
			navigate("/admin/manageCourses");
		} catch (error) {
			console.error("Error updating course:", error);
			toast.error(
				error.response?.data?.message ||
					"Failed to update course. Please try again.",
				{ autoClose: 1500 }
			);
		}
	};

	const handleCancel = () => {
		navigate("/admin/manageCourses");
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-university-gradient">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h1 className="text-2xl font-bold text-center mb-4">Edit Course</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					{/* Course ID */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Course ID
						</label>
						<input
							type="text"
							name="courseId"
							value={courseData.courseId}
							onChange={handleChange}
							placeholder="Enter course ID"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2 bg-gray-100"
							readOnly // Course ID should not be editable
						/>
						{errors.courseId && (
							<p className="text-red-600 text-sm">{errors.courseId}</p>
						)}
					</div>

					{/* Course Name */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Course Name
						</label>
						<input
							type="text"
							name="name"
							value={courseData.name}
							onChange={handleChange}
							placeholder="Enter course name"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.name && (
							<p className="text-red-600 text-sm">{errors.name}</p>
						)}
					</div>

					{/* Credit Hours */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Credit Hours
						</label>
						<input
							type="number"
							name="creditHours"
							value={courseData.creditHours}
							onChange={handleChange}
							placeholder="Enter credit hours"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.creditHours && (
							<p className="text-red-600 text-sm">{errors.creditHours}</p>
						)}
					</div>

					{/* Semester */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Semester
						</label>
						<input
							type="number"
							name="semester"
							value={courseData.semester}
							onChange={handleChange}
							placeholder="Enter semester (1-8)"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.semester && (
							<p className="text-red-600 text-sm">{errors.semester}</p>
						)}
					</div>

					{/* Checkbox for Practical/Project */}
					<div className="flex items-center">
						<input
							type="checkbox"
							name="containsPracticalOrProject"
							checked={courseData.containsPracticalOrProject}
							onChange={handleChange}
							className="mr-2"
						/>
						<label className="text-sm font-medium text-gray-700">
							Contains Practical or Project
						</label>
					</div>

					{/* Practical Marks */}
					{courseData.containsPracticalOrProject && (
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Practical Marks
							</label>
							<input
								type="number"
								name="practical"
								value={courseData.practical}
								onChange={handleChange}
								placeholder="Enter practical marks"
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
							/>
							{errors.practical && (
								<p className="text-red-600 text-sm">{errors.practical}</p>
							)}
						</div>
					)}

					{/* Checkbox for Assistants */}
					<div className="flex items-center">
						<input
							type="checkbox"
							name="haveAssistants"
							checked={courseData.haveAssistants}
							onChange={handleChange}
							className="mr-2"
						/>
						<label className="text-sm font-medium text-gray-700">
							Have Assistants
						</label>
					</div>

					{/* Midterm Marks */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Midterm Marks
						</label>
						<input
							type="number"
							name="midTerm"
							value={courseData.midTerm}
							onChange={handleChange}
							placeholder="Enter midterm marks"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.midTerm && (
							<p className="text-red-600 text-sm">{errors.midTerm}</p>
						)}
					</div>

					{/* Final Exam Marks */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Final Exam Marks
						</label>
						<input
							type="number"
							name="finalExam"
							value={courseData.finalExam}
							onChange={handleChange}
							placeholder="Enter final exam marks"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.finalExam && (
							<p className="text-red-600 text-sm">{errors.finalExam}</p>
						)}
					</div>

					{/* Quizzes Marks */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Quizzes Marks
						</label>
						<input
							type="number"
							name="quizzes"
							value={courseData.quizzes}
							onChange={handleChange}
							placeholder="Enter quizzes marks"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.quizzes && (
							<p className="text-red-600 text-sm">{errors.quizzes}</p>
						)}
					</div>

					{/* Display Total Marks */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Total Marks
						</label>
						<input
							type="number"
							name="totalMarks"
							value={courseData.totalMarks}
							readOnly
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2 bg-gray-200"
						/>
					</div>

					{/* Departments Selection */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Departments
						</label>
						{departmentsData.map((department) => (
							<div key={department.departmentId} className="flex items-center">
								<input
									type="checkbox"
									value={department.departmentId}
									checked={courseData.departments.$values.some(
										(dept) => dept.departmentId === department.departmentId
									)}
									onChange={handleDepartmentChange}
									className="mr-2"
								/>
								<label className="text-sm font-medium text-gray-700">
									{department.name}
								</label>
							</div>
						))}
						{errors.departments && (
							<p className="text-red-600 text-sm">{errors.departments}</p>
						)}
					</div>

					<div className="flex justify-between mt-4">
						<button
							type="button"
							onClick={handleCancel}
							className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
						>
							Update Course
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditCoursePage;
