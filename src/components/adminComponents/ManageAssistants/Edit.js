import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios';
import URL from '../../../constants/api-urls';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { getAccessToken, getFacultyFromToken } from "../../../authService";

const EditAssistantPage = () => {
    const { email } = useParams();
    const [assistantData, setAssistantData] = useState({
        name: '',
        email: '',
        backupEmail: '',
        role: '',
        faculty: '',
        courses: [] // Initialize courses as an array
    });
    const [initialData, setInitialData] = useState({});
    const [coursesData, setCoursesData] = useState([]); // For available courses
    const [errors, setErrors] = useState({});
    const [, setHasChanges] = useState(false);
    const navigate = useNavigate();

    const token = getAccessToken();
	const facultyOfAdmin = getFacultyFromToken(token);

    useEffect(() => {
        const fetchAssistantData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_ASSISTANT}${email}`);
                setAssistantData(response.data);
                setInitialData(response.data);
                await fetchCoursesData(response.data.courses.$values); // Fetch departments after getting course data
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        fetchAssistantData();
    }, [email]);

    const fetchCoursesData = async (courses) => {
        try {
            const response = await axiosInstance.get(`${URL.GET_ALL_COURSES_FOR_ASSISTANTS}${facultyOfAdmin}`); // Adjust URL for fetching courses
            const allCourses = response.data.$values;

            // Map the departments and check those that are part of the course
            const updatedCourses = allCourses.map((course) => ({
                ...course,
                checked: courses.some(
                    (doctorCourse) => doctorCourse.courseId === course.courseId
                ),
            }));
            setCoursesData(updatedCourses);
        } catch (error) {
            console.error("Error fetching courses data:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssistantData((prevData) => ({ ...prevData, [name]: value }));
        setHasChanges(true);
    };


    const handleCourseChange = (event) => {
        const value = event.target.value; // This is expected to be the courseId
        
        setAssistantData((prevData) => {
            // Access the $values property correctly
			const currentCourses = Array.isArray(prevData.courses.$values)
            ? prevData.courses.$values
            : [];
            const isSelected = currentCourses.some(course => course.courseId === value);

            if (isSelected) {
                // If already selected, remove it
                return {
					...prevData,
					courses: {
						...prevData.courses,
						$values: currentCourses.filter(
							(course) => course.courseId !== value
						),
					},
				};
            } else {
                // Otherwise, add it
                const newCourse = {
                    id: currentCourses.length + 1,
                    courseId: value,
                    name: null // Adjust as needed
                };
                return {
                    ...prevData,
                    courses: {
						...prevData.courses,
						$values: [...currentCourses, newCourse],
					},
                };
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!assistantData.name) newErrors.name = "Name is required.";
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
            courses: assistantData.courses.$values.map((course) => ({
                courseId: course.courseId, // Adjust the property names as needed
                // Add other course-related fields here if necessary
            })),
        };
        
        try {
            await axiosInstance.put(`${URL.UPDATE_ASSISTANT}`, payload);
            toast.success("Assistant updated successfully!", { autoClose: 1500 });
            navigate("/admin/manageAssistants");
        } catch (error) {
            console.error("Error updating assistant:", error);
            toast.error(error.response?.data?.message || "Failed to update assistant. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageAssistants");
    };

    const isButtonDisabled = JSON.stringify(assistantData) === JSON.stringify(initialData);

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Edit Assistant</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={assistantData.name}
                            onChange={handleChange}
                            placeholder="Enter assistant's name"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={assistantData.email}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>

                    {/* Backup Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Backup Email</label>
                        <input
                            type="email"
                            name="backupEmail"
                            value={assistantData.backupEmail}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>

                    {/* Role Input */}
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

                    {/* Faculty Input */}
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
                    
                    {/* Courses Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Courses he will teach</label>
                        {coursesData.map((course) => (
                            <div key={course.courseId} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={course.courseId}
                                    checked={assistantData.courses.$values.some(c => c.courseId === course.courseId)}
                                    onChange={handleCourseChange}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-gray-700">{course.name}</label>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            disabled={isButtonDisabled}
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Confirm
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAssistantPage;
