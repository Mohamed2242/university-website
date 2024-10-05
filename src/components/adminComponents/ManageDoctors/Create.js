import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, getFacultyFromToken } from "../../../authService";

const CreateDoctorPage = () => {
    const [docData, setDocData] = useState({
        name: '',
        email: '',
        backupEmail: '',
        role: '',
        faculty: '',
        courses: []
    });
    const [coursesData, setCoursesData] = useState([]); // For available courses

    const [errors, setErrors] = useState({});
    
    const token = getAccessToken();
    const facultyOfAdmin = getFacultyFromToken(token);
    const navigate = useNavigate();

    useEffect(() => {
        setDocData((prevData) => ({
            ...prevData,
            faculty: facultyOfAdmin,
            role: "Doctor",
        }));
        const fetchCoursesData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_ALL_COURSES}${facultyOfAdmin}`); // Adjust URL for fetching courses
                setCoursesData(response.data.$values); // Assuming response.data is an array of courses
            } catch (error) {
                console.error("Error fetching courses data:", error);
            }
        };

        fetchCoursesData();
    }, [facultyOfAdmin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDocData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setDocData((prevData) => {
            if (checked) {
                return {
                    ...prevData,
                    courses: [...prevData.courses, value],
                };
            } else {
                return {
                    ...prevData,
                    courses: prevData.courses.filter((c) => c !== value),
                };
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!docData.name) newErrors.name = "Name is required.";
        if (!docData.email) newErrors.email = "Email is required.";
        if (!docData.backupEmail) newErrors.backupEmail = "Backup Email is required.";
        if (!docData.courses) newErrors.courses = "Choose at least one course.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Must fill all fields.", { autoClose: 1500 });
            return;
        }

        const payload = {
            name: docData.name,
            email: docData.email,
            backupEmail: docData.backupEmail,
            role: docData.role,
            faculty: docData.faculty,
            courses: docData.courses.map((course) => ({
                courseId: course, // Adjust the property names as needed
                // Add other course-related fields here if necessary
            })),
        };

        console.log("payload: ",payload.courses);
        try {
            await axiosInstance.post(URL.CREATE_DOCTOR, payload);
            toast.success("Doctor created successfully!", { autoClose: 2000 });

            setDocData({
                name: '',
                email: '',
                backupEmail: '',
                role: '',
                faculty: '',
                courses: [],
            });
            setErrors({});
            navigate("/admin/manageDoctors");
        } catch (error) {
            console.error("Error creating doctor:", error);
            console.error("Error details:", error.response?.data); // Add this to see more details

            toast.error(error.response?.data?.message || "Failed to create doctor. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageDoctors");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Create Doctor</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={docData.name}
                            onChange={handleChange}
                            placeholder="Enter doctor name"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={docData.email}
                            onChange={handleChange}
                            placeholder="Enter doctor email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Backup Email</label>
                        <input
                            type="email"
                            name="backupEmail"
                            value={docData.backupEmail}
                            onChange={handleChange}
                            placeholder="Enter doctor backup email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.backupEmail && <p className="text-red-600 text-sm">{errors.backupEmail}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={docData.role}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Faculty</label>
                        <input
                            type="text"
                            name="faculty"
                            value={docData.faculty}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Courses</label>
                        {coursesData.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {coursesData.map((course) => (
                                    <div key={course.courseId} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={course.courseId}
                                            value={course.courseId}
                                            checked={docData.courses.includes(course.courseId)}
                                            onChange={handleCourseChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor={course.courseId} className="text-sm text-gray-700">
                                            {course.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No courses available</p>
                        )}
                        {errors.courses && <p className="text-red-600 text-sm">{errors.courses}</p>}
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Create Doctor
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

export default CreateDoctorPage;
