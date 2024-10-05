import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import Dashboard from "../Dashboard";
import URL from "../../constants/api-urls";
import { toast } from "react-toastify";
import {
    getAccessToken,
    getEmailFromToken,
    getFacultyFromToken,
    getRoleFromToken,
} from "../../authService";

const DoctorCourseStudentsPage = () => {
    const { courseId } = useParams(); // Get courseId from route parameters
    const [students, setStudents] = useState([]); // State to hold the students data
    const [loading, setLoading] = useState(true); // Loading state for data fetching
    const [filterStudentId, setFilterStudentId] = useState(""); // State to hold the filter input
    const navigate = useNavigate(); // Navigation function

    // Extract token, email, faculty, and role from the authentication service
    const token = getAccessToken();
    const email = getEmailFromToken(token);
    const faculty = getFacultyFromToken(token);
    const role = getRoleFromToken(token);

    // Fetch students enrolled in the course, filtered by studentId (if provided)
    const fetchStudents = async (studentId = "") => {
        try {
            setLoading(true); // Start loading
            const response = await axiosInstance.get(
                `${URL.GET_STUDENTS_BY_COURSE_AND_STUDENT_ID}/${courseId}/${studentId}`
            );
            setStudents(response.data.$values); // Set the students data
            setLoading(false); // End loading
        } catch (error) {
            setLoading(false); // End loading even on error
            toast.error("Error fetching students.", { autoClose: 1500 }); // Show error toast if the fetch fails
        }
    };

    // Fetch students when the component mounts or when the courseId changes
    useEffect(() => {
        fetchStudents();
    }, [courseId]);

    // Handle filter input change and fetch filtered students
    const handleFilterChange = (e) => {
        const studentId = e.target.value;
        setFilterStudentId(studentId);
        fetchStudents(studentId); // Fetch students with the entered filter
    };

    // Render loading state if students are still being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Back button handler
    const handleBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    // Render the students data once it's fetched
    return (
        <div className="min-h-screen bg-university-gradient">
            <Dashboard email={email} faculty={faculty} role={role} />
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Students in Course {courseId}</h1>
                    <button
                        onClick={handleBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                    >
                        Back
                    </button>
                </div>

                {/* Filter input field */}
                <div className="mb-4">
                    <label htmlFor="studentId" className="block text-lg font-medium text-gray-700">
                        Filter by Student ID:
                    </label>
                    <input
                        type="text"
                        id="studentId"
                        value={filterStudentId}
                        onChange={handleFilterChange}
                        placeholder="Enter Student ID or part of it"
                        className="mt-1 p-2 border rounded w-full bg-gray-300"
                    />
                </div>

                {/* Render students */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {students.length > 0 ? (
                        students.map((student) => (
                            <div
                                key={student.studentId}
                                className="bg-gray-200 p-4 rounded-lg shadow-md"
                            >
                                <h2 className="text-xl font-bold">{student.studentId}</h2>
                                <p>Email: {student.email}</p>
                                <p>Current Semester: {student.currentSemester}</p>
                                <p>Department: {student.department}</p>
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/doctor/course/${courseId}/student/${student.email}`
                                        )
                                    }
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
                                >
                                    View Degrees
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No students found for the provided Student ID filter.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorCourseStudentsPage;
