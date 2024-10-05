import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, getFacultyFromToken } from "../../../authService";

const CreateAssistantPage = () => {
    const [assistantData, setAssistantData] = useState({
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
        setAssistantData((prevData) => ({
            ...prevData,
            faculty: facultyOfAdmin,
            role: "Assistant",
        }));
        const fetchCoursesData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_ALL_COURSES_FOR_ASSISTANTS}${facultyOfAdmin}`); // Adjust URL for fetching courses
                setCoursesData(response.data.$values); // Assuming response.data is an array of courses
            } catch (error) {
                console.error("Error fetching courses data:", error);
            }
        };

        fetchCoursesData();
    }, [facultyOfAdmin]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssistantData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleCourseChange = (e) => {
        const { value, checked } = e.target;
        setAssistantData((prevData) => {
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
        if (!assistantData.name) newErrors.name = "Name is required.";
        if (!assistantData.email) newErrors.email = "Email is required.";
        if (!assistantData.backupEmail) newErrors.backupEmail = "Backup Email is required.";
        if (!assistantData.courses) newErrors.courses = "Choose at least one course.";
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
            name: assistantData.name,
            email: assistantData.email,
            backupEmail: assistantData.backupEmail,
            role: assistantData.role,
            faculty: assistantData.faculty,
            courses: assistantData.courses.map((course) => ({
                courseId: course, // Adjust the property names as needed
                // Add other course-related fields here if necessary
            })),
        };

        try {
            await axiosInstance.post(URL.CREATE_ASSISTANT, payload);
            toast.success("Assistant created successfully!", { autoClose: 2000 });

            setAssistantData({
                name: '',
                email: '',
                backupEmail: '',
                role: '',
                faculty: '',
                courses: [],
            });
            setErrors({});
            navigate("/admin/manageAssistants");
        } catch (error) {
            console.error("Error creating assistant:", error);
            toast.error(error.response?.data?.message || "Failed to create assistant. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageAssistants");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Create Assistant</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={assistantData.name}
                            onChange={handleChange}
                            placeholder="Enter assistant name"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={assistantData.email}
                            onChange={handleChange}
                            placeholder="Enter assistant email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Backup Email</label>
                        <input
                            type="email"
                            name="backupEmail"
                            value={assistantData.backupEmail}
                            onChange={handleChange}
                            placeholder="Enter assistant backup email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.backupEmail && <p className="text-red-600 text-sm">{errors.backupEmail}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={assistantData.role}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Faculty</label>
                        <input
                            type="text"
                            name="faculty"
                            value={assistantData.faculty}
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
                                            checked={assistantData.courses.includes(course.courseId)}
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
                            Create Assistant
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

export default CreateAssistantPage;
