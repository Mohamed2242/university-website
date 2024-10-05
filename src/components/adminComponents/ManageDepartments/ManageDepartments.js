import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios";
import {
    getAccessToken,
    getEmailFromToken,
    getFacultyFromToken,
    getRoleFromToken,
} from "../../../authService";
import { useNavigate } from "react-router-dom";
import URL from "../../../constants/api-urls";
import Dashboard from "../../Dashboard";
import { toast } from "react-toastify";

const ManageDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState(null);
    const [departmentName, setDepartmentName] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [nameError, setNameError] = useState("");

    const navigate = useNavigate();

    const token = getAccessToken();
    const email = getEmailFromToken(token);
    const faculty = getFacultyFromToken(token);
    const role = getRoleFromToken(token);

    // Fetch departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get(
                    `${URL.GET_ALL_DEPARTMENTS}${faculty}`
                );
                setDepartments(response.data.$values);
            } catch (error) {
                console.error("Error fetching departments:", error);
                toast.error("Failed to fetch departments", { autoClose: 1500 });
            }
        };
        fetchDepartments();
    }, [faculty]);

    // Handle Create Modal
    const handleCreate = () => {
        setDepartmentName("");
        setDepartmentId("");
        setNameError("");
        setCreateModalOpen(true);
    };

    // Validation function
    const validateInput = () => {
        let valid = true;
        setNameError("");

        if (!departmentName.trim()) {
            setNameError("Department Name cannot be empty");
            valid = false;
        } else if (/\d/.test(departmentName)) {
            setNameError("Department Name cannot contain numbers");
            valid = false;
        }

        return valid;
    };

    const handleCreateSubmit = async () => {
        if (!validateInput()) return;

        try {
            const departmentObj = {
                departmentId: departmentId,
                name: departmentName,
                faculty: faculty,
            };

            const response = await axiosInstance.post(URL.CREATE_DEPARTMENT, departmentObj);
            if (response.status === 200) {
                toast.success("Department created successfully!", { autoClose: 1500 });
                setDepartments([...departments, response.data]);
            }
        } catch (error) {
            toast.error("Failed to create department", { autoClose: 1500 });
        } finally {
            setCreateModalOpen(false);
        }
    };

    // Handle Edit Modal
    const handleEdit = (department) => {
        setEditingDepartment(department);
        setDepartmentName(department.name);
        setDepartmentId(department.departmentId);
        setNameError("");
        setEditModalOpen(true);
    };

    const handleEditSubmit = async () => {
        if (!validateInput()) return;

        try {
            const departmentObj = {
                departmentId: editingDepartment.departmentId,
                name: departmentName,
                faculty: faculty,
            };

            const response = await axiosInstance.put(URL.UPDATE_DEPARTMENT, departmentObj);
            if (response.status === 200) {
                toast.success("Department updated successfully!", { autoClose: 1500 });
                setDepartments(
                    departments.map((dep) =>
                        dep.departmentId === editingDepartment.departmentId
                            ? { ...dep, name: departmentName }
                            : dep
                    )
                );
            }
        } catch (error) {
            toast.error("Failed to update department", { autoClose: 1500 });
        } finally {
            setEditModalOpen(false);
        }
    };

    // Handle Delete Modal
    const handleDelete = (name) => {
        const department = departments.find((dep) => dep.name === name);
        setDepartmentToDelete(department);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            const departmentToDel = {
                departmentId: departmentToDelete.departmentId,
                name: departmentToDelete.name,
                faculty: departmentToDelete.faculty,
            };

            const response = await axiosInstance.delete(
                `${URL.DELETE_DEPARTMENT}`, 
                { data: departmentToDel }
            );

            if (response.status === 200) {
                toast.success(`${departmentToDelete.name} deleted successfully`, {
                    autoClose: 1500,
                });
                setDepartments((prevDepartments) =>
                    prevDepartments.filter((dep) => dep.departmentId !== departmentToDelete.departmentId)
                );
            }
        } catch (error) {
            toast.error("Error deleting department", { autoClose: 1500 });
        } finally {
            setDeleteModalOpen(false);
        }
    };

    // Navigate to the previous admin page
    const handleBack = () => {
        navigate("/admin");
    };

    return (
        <div className="bg-university-gradient">
            <Dashboard email={email} faculty={faculty} role={role} />
            <div className="container mx-auto px-4 py-8 bg-university-gradient">
                <h1 className="text-2xl font-bold mb-6">Department Management</h1>
                {/* Back and Create Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <button
                        onClick={handleBack}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Back
                    </button>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create New Department
                    </button>
                </div>

                {/* Conditionally render table or no departments message */}
                {departments.length > 0 ? (
                    <table className="min-w-full table-auto bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2">Id</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department) => (
                                <tr key={department.departmentId} className="bg-white border-b">
                                    <td className="px-4 py-2 text-center">{department.departmentId}</td>
                                    <td className="px-4 py-2 text-center">{department.name}</td>
                                    <td className="px-4 py-2 flex justify-center">
                                        <button
                                            onClick={() => handleEdit(department)}
                                            className="mr-2 text-blue-600 hover:text-blue-700"
                                            title="Edit"
                                        >
                                            <i className="bi bi-pencil-square" style={{ fontSize: "1.5rem" }}></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(department.name)}
                                            className="text-red-600 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <i className="bi bi-trash" style={{ fontSize: "1.5rem" }}></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-gray-500 text-2xl font-semibold">There are no departments.</p>
                )}
            </div>
            {/* Create Department Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold">Create Department</h2>
                        <input
                            type="text"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            placeholder="Department ID"
                            className="w-full px-3 py-2 mt-4 border border-gray-300 rounded-md"
                        />
                        <input
                            type="text"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            placeholder="Department Name"
                            className="w-full px-3 py-2 mt-4 border border-gray-300 rounded-md"
                        />
                        {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={handleCreateSubmit}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setCreateModalOpen(false)}
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Department Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold">Edit Department</h2>
                        <input
                            type="text"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            placeholder="Department ID"
                            className="w-full px-3 py-2 mt-4 border border-gray-300 rounded-md bg-gray-200"
                            disabled
                            readOnly
                        />
                        <input
                            type="text"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            placeholder="Department Name"
                            className="w-full px-3 py-2 mt-4 border border-gray-300 rounded-md"
                        />
                        {nameError && <p className="text-red-600 text-sm">{nameError}</p>}
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={handleEditSubmit}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Department Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold">Confirm Delete</h2>
                        <p className="mt-4">Are you sure you want to delete the department <strong>{departmentToDelete.name}</strong>?</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageDepartments;
