import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";
import URL from "../../../constants/api-urls";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken, getFacultyFromToken } from "../../../authService";

const EditStudentPage = () => {
	const { email } = useParams();
	const [studentData, setStudentData] = useState({
		studentId: "",
		name: "",
		email: "",
		backupEmail: "",
		role: "",
		faculty: "",
		currentSemester: 0,
		hasRegisteredCourses: false,
		department: "",
		totalCreditHours: 0,
	});
	const [initialData, setInitialData] = useState({});
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const [departmentsList, setDepartmentsList] = useState([]); // For storing department options

	const token = getAccessToken();
	const facultyOfAdmin = getFacultyFromToken(token);

	useEffect(() => {
		const fetchStudentData = async () => {
			try {
				const response = await axiosInstance.get(`${URL.GET_STUDENT}${email}`);
				setStudentData(response.data);
				setInitialData(response.data);
			} catch (error) {
				console.error("Error fetching student data:", error);
			}
		};

		const fetchDepartments = async () => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_ALL_DEPARTMENTS}${facultyOfAdmin}`
				);
				setDepartmentsList(response.data.$values);
			} catch (error) {
				console.error("Error fetching departments:", error);
			}
		};

		fetchStudentData();
		fetchDepartments();
	}, [email]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setStudentData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!studentData.name) newErrors.name = "Name is required.";
		if (!studentData.currentSemester || isNaN(studentData.currentSemester) || studentData.currentSemester < 1 || studentData.currentSemester > 8)
			newErrors.currentSemester = "Valid Current Semester (1 - 8) is required.";
		if (!studentData.department)
			newErrors.department = "Department is required.";		
		return newErrors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = validateForm();
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			toast.error("Please fill all required fields correctly.", {
				autoClose: 1500,
			});
			return;
		}

		try {
			await axiosInstance.put(`${URL.UPDATE_STUDENT}`, studentData);
			toast.success("Student updated successfully!", { autoClose: 1500 });
			navigate("/admin/manageStudents");
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Failed to update student. Please try again.",
				{ autoClose: 1500 }
			);
		}
	};

	const handleCancel = () => {
		navigate("/admin/manageStudents");
	};

	const isButtonDisabled =
		JSON.stringify(studentData) === JSON.stringify(initialData);

	return (
		<div className="flex items-center justify-center min-h-screen bg-university-gradient">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
				<h1 className="text-2xl font-bold text-center mb-4">Edit Student</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Name
						</label>
						<input
							type="text"
							name="name"
							value={studentData.name}
							onChange={handleChange}
							placeholder="Enter student's name"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.name && (
							<p className="text-red-600 text-sm">{errors.name}</p>
						)}
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={studentData.email}
							readOnly
							className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Backup Email
						</label>
						<input
							type="email"
							name="backupEmail"
							value={studentData.backupEmail}
							readOnly
							className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Role
						</label>
						<input
							type="text"
							name="role"
							value={studentData.role}
							readOnly
							className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Faculty
						</label>
						<input
							type="text"
							name="faculty"
							value={studentData.faculty}
							readOnly
							className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Current Semester
						</label>
						<input
							type="number"
							name="currentSemester"
							value={studentData.currentSemester}
							onChange={handleChange}
							placeholder="Enter current semester"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
						{errors.currentSemester && (
							<p className="text-red-600 text-sm">{errors.currentSemester}</p>
						)}
					</div>
					{/* Checkbox for Practical/Project */}
					<div className="flex items-center">
						<input
							type="checkbox"
							name="hasRegisteredCourses"
							checked={studentData.hasRegisteredCourses}
							onChange={handleChange}
							className="mr-2"
						/>
						<label className="text-sm font-medium text-gray-700">
						Has Registered Courses
						</label>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Department
						</label>
						<select
							name="department"
							value={studentData.department}
							onChange={handleChange}
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						>
							<option value={studentData.department}>{studentData.department}</option> {/* Default option */}
							{departmentsList
								.filter((dept) => dept.name !== studentData.department) // Filter out the already selected department
								.map((dept) => (
									<option key={dept.id} value={dept.name}>
										{dept.name}
									</option>
								))}
						</select>
						{errors.department && (
							<p className="text-red-600 text-sm">{errors.department}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Total Credit Hours
						</label>
						<input
							type="number"
							name="totalCreditHours"
							value={studentData.totalCreditHours}
							onChange={handleChange}
							placeholder="Enter total credit hours"
							className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
						/>
					</div>
					
					<div className="flex justify-between">
						<button
							type="submit"
							disabled={isButtonDisabled}
							className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
								isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							Confirm
						</button>
						<button
							type="button"
							onClick={handleCancel}
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditStudentPage;
