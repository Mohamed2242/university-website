// src/components/ManageAssistants.js
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

const ManageAssistants = () => {
	const [assistants, setAssistants] = useState([]);
	const navigate = useNavigate();

	const [isModalOpen, setModalOpen] = useState(false);
	const [emailToDelete, setEmailToDelete] = useState(null);

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	// Fetch assistants based on the admin's faculty
	useEffect(() => {
		const fetchAssistants = async () => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_ALL_ASSISTANTS}${faculty}`
				);
				setAssistants(response.data.$values);
			} catch (error) {
				console.error("Error fetching assistants:", error);
				toast.error("Failed to fetch assistants", { autoClose: 1500 });
			}
		};
		fetchAssistants();
	}, [faculty]);

	// Navigate to the create assistant page
	const handleCreate = () => {
		navigate("/admin/manageAssistants/create");
	};

	// Navigate to the previous admin page
	const handleBack = () => {
		navigate("/admin");
	};

	// Navigate to the details page
	const handleDetails = (email) => {
		navigate(`/admin/manageAssistants/details/${email}`);
	};

	// Navigate to the edit page
	const handleEdit = (email) => {
		navigate(`/admin/manageAssistants/edit/${email}`);
	};

	// Handle delete action
	const handleDelete = (email) => {
		setEmailToDelete(email);
		setModalOpen(true);
	};

	const confirmDelete = async () => {
		try {
			// Perform the delete action using the emailToDelete
			const response = await axiosInstance.delete(
				`${URL.DELETE_ASSISTANT}${emailToDelete}`
			);

			if (response.status === 200) {
				toast.success(`Assistant ${emailToDelete} deleted successfully`, {
					autoClose: 1500,
				});
				// Remove the deleted assistant from the list
				setAssistants((prevAssistants) =>
					prevAssistants.filter((asst) => asst.email !== emailToDelete)
				);
			} else {
				toast.error("Error deleting assistant", { autoClose: 1500 });
			}
		} catch (error) {
			console.error("Error deleting the assistant:", error);
		} finally {
			// Close the modal regardless of success or failure
			setModalOpen(false);
		}
	};

	return (
		<div className="bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="container mx-auto px-4 py-8 bg-university-gradient">
				<h1 className="text-2xl font-bold mb-6">Assistant Management</h1>
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
						Create New Assistant
					</button>
				</div>
				{/* Responsive Table */}
				{assistants.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full table-auto border-collapse">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-2 border">Assistant Email</th>
									<th className="px-4 py-2 border">Name</th>
									<th className="px-4 py-2 border">Actions</th>
								</tr>
							</thead>
							<tbody>
								{assistants.map((asst) => (
									<tr key={asst.email} className="bg-white border-b">
										<td className="px-4 py-2 text-center border">
											{asst.email}
										</td>
										<td className="px-4 py-2 text-center border">
											{asst.name}
										</td>										
										<td className="px-4 py-2 flex justify-center space-x-4">
											{/* Details Button */}
											<button
												onClick={() => handleDetails(asst.email)}
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
												onClick={() => handleEdit(asst.email)}
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
												onClick={() => handleDelete(asst.email)}
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
						There are no assistants.
					</p>
				)}
				{/* Delete Confirmation Modal */}
				{isModalOpen && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
						<div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
							<h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
							<p className="mb-4">
								Are you sure you want to delete the assistant with email:{" "}
								<strong>{emailToDelete}</strong>?
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

export default ManageAssistants;
