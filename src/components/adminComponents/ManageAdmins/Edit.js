import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const EditAdminPage = () => {
    const { email } = useParams();
    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        backupEmail: '',
        role: '',
        faculty: '',
        position: '',
    });
    const [initialData, setInitialData] = useState({}); // Track initial data for comparison
    const [errors, setErrors] = useState({});
    const [, setHasChanges] = useState(false); // Track if changes have been made

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch admin data to edit
        const fetchAdminData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_ADMIN}${email}`);
                setAdminData(response.data);
                setInitialData(response.data); // Set initial data
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchAdminData();
    }, [email]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdminData((prevData) => ({ ...prevData, [name]: value }));
        setHasChanges(true); // Mark changes as made
    };

    // Validation function
    const validateForm = () => {
        const newErrors = {};
        if (!adminData.name) newErrors.name = "Name is required.";
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
            await axiosInstance.put(`${URL.UPDATE_ADMIN}`, adminData);
            toast.success("Admin updated successfully!", { autoClose: 1500 });
            navigate("/admin/manageAdmins");
        } catch (error) {
            console.error("Error updating admin:", error);
            toast.error(error.response?.data?.message || "Failed to update admin. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageAdmins");
    };

    const isButtonDisabled = JSON.stringify(adminData) === JSON.stringify(initialData); // Check if data is unchanged

    // Check if the role is "Super Admin" to display in BackupEmail field
    const backupEmailDisplay = adminData.email === "admin1@gmail.com" ? "Admin1 is the Super Admin" : adminData.backupEmail;

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Edit Admin</h1>
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
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">BackupEmail</label>
                        <input
                            type="email"
                            name="backupEmail"
                            value={backupEmailDisplay}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
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
                            disabled={isButtonDisabled} // Disable button if no changes made
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

export default EditAdminPage;
