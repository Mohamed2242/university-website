import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
    getAccessToken,
    getFacultyFromToken,
    getRoleFromToken,
} from "../../../authService";

const CreateAdminPage = () => {
    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        role: '',
        faculty: '',
        position: '',
    });

    const [errors, setErrors] = useState({});
    
    const token = getAccessToken();
    const facultyOfAdmin = getFacultyFromToken(token);
    const roleOfAdmin = getRoleFromToken(token);

    const navigate = useNavigate();

    // Set faculty and role once the component mounts
    useEffect(() => {
        setAdminData((prevData) => ({
            ...prevData,
            faculty: facultyOfAdmin,
            role: roleOfAdmin,
        }));
    }, [facultyOfAdmin, roleOfAdmin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};
        if (!adminData.name) newErrors.name = "Name is required.";
        if (!adminData.email) newErrors.email = "Email is required.";
        if (!adminData.position) newErrors.position = "Position is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate the form
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Must fill all fields.", { autoClose: 1500 });
            return;
        }

        try {
            await axiosInstance.post(URL.CREATE_ADMIN, adminData);
            toast.success("Admin created and email sent successfully!", { autoClose: 2000 });

            // Reset form after successful submission
            setAdminData({
                name: '',
                email: '',
                backupEmail: '',
                role: '',
                faculty: '',
                position: '',
            });
            setErrors({});
            navigate("/admin/manageAdmins");
        } catch (error) {
            console.error("Error creating admin:", error);
            toast.error(error.response?.data?.message || "Failed to create admin. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageAdmins");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Create Admin</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={adminData.name}
                            onChange={handleChange}
                            placeholder="Enter admin name"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={adminData.email}
                            onChange={handleChange}
                            placeholder="Enter admin email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">BackupEmail</label>
                        <input
                            type="email"
                            name="backupEmail"
                            value={adminData.backupEmail}
                            onChange={handleChange}
                            placeholder="Enter admin BackupEmail"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.backupEmail && <p className="text-red-600 text-sm">{errors.backupEmail}</p>}
                    </div>
                    <div>
						<label className="block text-sm font-medium text-gray-700">Role</label>
						<input
							type="text"
							name="role"
							value={adminData.role}
							readOnly
							className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">Faculty</label>
						<input
							type="text"
							name="faculty"
							value={adminData.faculty}
							readOnly
							className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
						/>
					</div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                            type="text"
                            name="position"
                            value={adminData.position}
                            onChange={handleChange}
                            placeholder="Enter admin position"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.position && <p className="text-red-600 text-sm">{errors.position}</p>}
                    </div>                    
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Admin
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

export default CreateAdminPage;
