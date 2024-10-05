// StudentDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";

const StudentDetails = () => {
    const { email } = useParams();
    const [studentData, setStudentData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_STUDENT}${email}`);
                setStudentData(response.data);
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        fetchStudentData();
    }, [email]);

    if (!studentData) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    const hasRegisteredCoursesDisplay = studentData.hasRegisteredCourses ? "Yes" : "No";

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Student Details</h1>
                <div className="space-y-4">
                    <p className="text-gray-700"><strong>Student ID:</strong> {studentData.studentId}</p>
                    <p className="text-gray-700"><strong>Name:</strong> {studentData.name}</p>
                    <p className="text-gray-700"><strong>Email:</strong> {studentData.email}</p>
                    <p className="text-gray-700"><strong>Backup Email:</strong> {studentData.backupEmail}</p>
                    <p className="text-gray-700"><strong>Role:</strong> {studentData.role}</p>
                    <p className="text-gray-700"><strong>Faculty:</strong> {studentData.faculty}</p>
                    <p className="text-gray-700"><strong>Current Semester:</strong> {studentData.currentSemester}</p>
                    <p className="text-gray-700"><strong>Has Registered Courses:</strong> {hasRegisteredCoursesDisplay}</p>
                    <p className="text-gray-700"><strong>Department:</strong> {studentData.department}</p>
                    <p className="text-gray-700"><strong>Total Credit Hours:</strong> {studentData.totalCreditHours}</p>
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
