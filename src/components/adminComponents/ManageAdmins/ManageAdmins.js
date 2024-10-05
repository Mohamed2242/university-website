// src/components/AdminManagement.js
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

const AdminManagement = () => {
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);
    const [emailToDelete, setEmailToDelete] = useState(null);

    const token = getAccessToken();
    const email = getEmailFromToken(token);
    const faculty = getFacultyFromToken(token);
    const role = getRoleFromToken(token);

    // Fetch admins based on the admin's faculty
    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const response = await axiosInstance.get(
                    `${URL.GET_ALL_ADMINS}${faculty}`
                );
                setAdmins(response.data.$values);
            } catch (error) {
                console.error("Error fetching admins:", error);
                toast.error("Failed to fetch admins", { autoClose: 1500 });
            }
        };
        fetchAdmins();
    }, [faculty]);

    // Navigate to the create admin page
    const handleCreate = () => {
        navigate("/admin/manageAdmins/create");
    };

    // Navigate to the previous admin page
    const handleBack = () => {
        navigate("/admin");
    };

    // Navigate to the details page
    const handleDetails = (email) => {
        navigate(`/admin/manageAdmins/details/${email}`);
    };

    // Navigate to the edit page
    const handleEdit = (email) => {
        navigate(`/admin/manageAdmins/edit/${email}`);
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
                `${URL.DELETE_ADMIN}${emailToDelete}`
            );

            if (response.status === 200) {
                toast.success(`Admin ${emailToDelete} deleted successfully`, {
                    autoClose: 1500,
                });
                // Remove the deleted admin from the list
                setAdmins((prevAdmins) =>
                    prevAdmins.filter((admin) => admin.email !== emailToDelete)
                );
            } else {
                toast.error("Error deleting admin", { autoClose: 1500 });
            }
        } catch (error) {
            console.error("Error deleting the admin:", error);
        } finally {
            // Close the modal regardless of success or failure
            setModalOpen(false);
        }
    };

    return (
        <div className="bg-university-gradient">
            <Dashboard email={email} faculty={faculty} role={role} />
            <div className="container mx-auto px-4 py-8 bg-university-gradient">
                <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
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
                        Create New Admin
                    </button>
                </div>
                {/* Responsive Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Admin Email</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.map((admin) => (
                                <tr key={admin.email} className="bg-white border-b">
                                    <td className="px-4 py-2 text-center border">
                                        {admin.email}
                                    </td>
                                    <td className="px-4 py-2 flex justify-center space-x-4">
                                        {/* Details Button */}
                                        <button
                                            onClick={() => handleDetails(admin.email)}
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
                                            onClick={() => handleEdit(admin.email)}
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
                                            onClick={() => handleDelete(admin.email)}
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

                {/* Delete Confirmation Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                            <h2 className="text-lg font-semibold mb-4">
                                Confirm Deletion
                            </h2>
                            <p className="mb-4">
                                Are you sure you want to delete the admin with email:{" "}
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

export default AdminManagement;
