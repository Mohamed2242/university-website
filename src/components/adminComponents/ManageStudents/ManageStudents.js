// src/components/StudentManagement.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios"; // For API calls
import {
	getAccessToken,
	getEmailFromToken,
	getFacultyFromToken,
	getRoleFromToken,
} from "../../../authService"; // Utility for getting faculty from token
import { useNavigate } from "react-router-dom";
import URL from "../../../constants/api-urls";
import Dashboard from "../../Dashboard";
import { toast } from "react-toastify";

const StudentManagement = () => {
	const [students, setStudents] = useState([]);
	const navigate = useNavigate();

	const [isModalOpen, setModalOpen] = useState(false);
	const [studentEmailToDelete, setStudentEmailToDelete] = useState(null);

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	// Fetch students based on the admin's faculty
	useEffect(() => {
		const fetchStudents = async () => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_ALL_STUDENTS}${faculty}`
				);
				setStudents(response.data.$values);
			} catch (error) {
				console.error("Error fetching students:", error);
				toast.error("Failed to fetch students", { autoClose: 1500 });
			}
		};
		fetchStudents();
	}, [faculty]);

	// Navigate to the create student page
	const handleCreate = () => {
		navigate("/admin/manageStudents/create");
	};

	// Navigate to the previous admin page
	const handleBack = () => {
		navigate(`/admin`);
	};

	// Navigate to the details page
	const handleDetails = (email) => {
		navigate(`/admin/manageStudents/details/${email}`);
	};

	// Navigate to the edit page
	const handleEdit = (email) => {
		navigate(`/admin/manageStudents/edit/${email}`);
	};

	// Handle delete action
	const handleDelete = (email) => {
		setStudentEmailToDelete(email);
		setModalOpen(true);
	};

	const confirmDelete = async () => {
		try {
			// Perform the delete action using the studentIdToDelete
			const response = await axiosInstance.delete(
				`${URL.DELETE_STUDENT}${studentEmailToDelete}`
			);

			if (response.status === 200) {
				toast.success(`Student ${studentEmailToDelete} deleted successfully`, {
					autoClose: 1500,
				});
				// Remove the deleted student from the list
				setStudents((prevStudents) =>
					prevStudents.filter(
						(student) => student.email !== studentEmailToDelete
					)
				);
			} else {
				toast.error("Error deleting student", { autoClose: 1500 });
			}
		} catch (error) {
			console.error("Error deleting the student:", error);
		} finally {
			// Close the modal regardless of success or failure
			setModalOpen(false);
		}
	};

	return (
		<div className="bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="container mx-auto px-4 py-8 bg-university-gradient">
				<h1 className="text-2xl font-bold mb-6">Student Management</h1>
				{/* Back and Create Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mb-4">
					<button
						onClick={handleBack}
						className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
					>
						Back
					</button>
					<button
						onClick={handleCreate}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
					>
						Create New Student
					</button>
				</div>
				{/* Responsive Table */}
				{students.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full table-auto border-collapse">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-2 border">Student ID</th>
									<th className="px-4 py-2 border">Current Semester</th>
									<th className="px-4 py-2 border">Department</th>
									<th className="px-4 py-2 border">Actions</th>
								</tr>
							</thead>
							<tbody>
								{students.map((student) => (
									<tr key={student.studentId} className="bg-white border-b">
										<td className="px-4 py-2 text-center border">
											{student.studentId}
										</td>
										<td className="px-4 py-2 text-center border">
											{student.currentSemester}
										</td>
										<td className="px-4 py-2 text-center border">
											{student.department}
										</td>										
										<td className="px-4 py-2 flex justify-center space-x-4">
											{/* Details Button */}
											<button
												onClick={() => handleDetails(student.email)}
												className="text-green-500 hover:text-green-600"
												title="Details"
											>
												<i
													className="bi bi-info-circle"
													style={{ fontSize: "1.5rem" }}
												></i>
											</button>
											{/* Edit Button */}
											<button
												onClick={() => handleEdit(student.email)}
												className="text-blue-600 hover:text-blue-700"
												title="Edit"
											>
												<i
													className="bi bi-pencil-square"
													style={{ fontSize: "1.5rem" }}
												></i>
											</button>
											{/* Delete Button */}
											<button
												onClick={() => handleDelete(student.email)}
												className="text-red-600 hover:text-red-700"
												title="Delete"
											>
												<i
													className="bi bi-trash"
													style={{ fontSize: "1.5rem" }}
												></i>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-center text-gray-500 text-2xl font-semibold">
						There are no students.
					</p>
				)}
				{/* Delete Confirmation Modal */}
				{isModalOpen && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
						<div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
							<h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
							<p className="mb-4">
								Are you sure you want to delete the student with ID:{" "}
								<strong>{studentEmailToDelete}</strong>?
							</p>
							<div className="flex justify-end space-x-4">
								<button
									onClick={confirmDelete}
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition"
								>
									Confirm
								</button>
								<button
									onClick={() => setModalOpen(false)}
									className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-200 transition"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default StudentManagement;
