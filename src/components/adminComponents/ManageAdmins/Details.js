import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";

const DetailsPage = () => {
    const { email } = useParams();
    const [adminData, setAdminData] = useState(null);
    const navigate = useNavigate(); // Create navigate function

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_ADMIN}${email}`);
                setAdminData(response.data);
            } catch (error) {
                console.error("Error fetching admin data:", error);
            }
        };

        fetchAdminData();
    }, [email]);

    if (!adminData) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>; // Loading state
    }

    // Check if the role is "Super Admin" to display in BackupEmail field
    const backupEmailDisplay = adminData.email === "admin1@gmail.com" ? "Admin1 is the Super Admin" : adminData.backupEmail;

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Admin Details</h1>
                <div className="space-y-4">
                    <p className="text-gray-700"><strong>Name:</strong> {adminData.name}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {adminData.email}</p>
                    <p className="text-gray-700">
                        <strong>BackupEmail:</strong> {backupEmailDisplay}
                    </p>
                    <p className="text-gray-700"><strong>Role:</strong> {adminData.role}</p>
                    <p className="text-gray-700"><strong>Faculty:</strong> {adminData.faculty}</p>
                    <p className="text-gray-700"><strong>Position:</strong> {adminData.position}</p>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => navigate(-1)} // Navigate back to the previous page
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;
