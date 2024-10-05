import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import {
    getAccessToken,
    getFacultyFromToken,
} from "../../../authService"; // Utility for getting faculty from token

const CourseDetails = () => {

    const [courseData, setCourseData] = useState(null);
    const [departmentsData, setDepartmentsData] = useState([]); // State to hold department names
    const navigate = useNavigate(); // Create navigate function
    const { courseId } = useParams();

    const token = getAccessToken();
    const faculty = getFacultyFromToken(token);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_COURSE}${faculty}/${courseId}`);
                setCourseData(response.data);
                console.log(response.data.departments.$values);
                await fetchDepartments(response.data.departments.$values); // Fetch departments after getting course data
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };

        fetchCourseData();
    }, [courseId, faculty]);

    // Function to fetch department details
    const fetchDepartments = async (departments) => {
        const departmentPromises = departments.map(async (department) => {
            const departmentDto = {
                departmentId: department.departmentId,
                name: "", // Assuming name may not be available
                faculty: faculty
            };

            try {
                const response = await axiosInstance.post(URL.GET_DEPARTMENT, departmentDto);
                return response.data; // Return the fetched department data
            } catch (error) {
                console.error(`Error fetching department ${department.departmentId}:`, error);
                return null; // Return null if there's an error
            }
        });

        const results = await Promise.all(departmentPromises);
        setDepartmentsData(results.filter(Boolean)); // Set only the successful results
    };

    if (!courseData) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>; // Loading state
    }

    // Display for practical or project
    const practicalOrProjectDisplay = courseData.containsPracticalOrProject ? "Yes" : "No";
    const assistantsDisplay = courseData.haveAssistants ? "Yes" : "No";

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Course Details</h1>
                <div className="space-y-4">
                    <p className="text-gray-700"><strong>Course ID:</strong> {courseData.courseId}</p>
                    <p className="text-gray-700"><strong>Name:</strong> {courseData.name}</p>
                    <p className="text-gray-700"><strong>Credit Hours:</strong> {courseData.creditHours}</p>
                    <p className="text-gray-700"><strong>Faculty:</strong> {courseData.faculty}</p>
                    <p className="text-gray-700"><strong>Semester:</strong> {courseData.semester || "N/A"}</p>
                    <p className="text-gray-700"><strong>Contains Practical or Project:</strong> {practicalOrProjectDisplay}</p>
                    <p className="text-gray-700"><strong>Have Assistants:</strong> {assistantsDisplay}</p>
                    <p className="text-gray-700"><strong>Mid Term Marks:</strong> {courseData.midTerm ?? "N/A"}</p>
                    <p className="text-gray-700"><strong>Final Exam Marks:</strong> {courseData.finalExam ?? "N/A"}</p>
                    <p className="text-gray-700"><strong>Quizzes Marks:</strong> {courseData.quizzes ?? "N/A"}</p>
                    <p className="text-gray-700"><strong>Practical Marks:</strong> {courseData.practical ?? "N/A"}</p>
                    <p className="text-gray-700"><strong>Total Marks:</strong> {courseData.totalMarks ?? "N/A"}</p>
                    <p className="text-gray-700"><strong>Departments:</strong></p>
                    <ul className="list-disc pl-5">
                        {departmentsData.length > 0 ? (
                            departmentsData.map((department, index) => (
                                <li key={index} className="text-gray-700">{department.name || department.departmentId}</li> // Display department name or ID
                            ))
                        ) : (
                            <li className="text-gray-700">No departments assigned</li>
                        )}
                    </ul>
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

export default CourseDetails;
