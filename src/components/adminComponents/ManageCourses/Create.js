import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import {
    getAccessToken,
    getFacultyFromToken,
} from "../../../authService";

const CreateCoursePage = () => {
    const [courseData, setCourseData] = useState({
        courseId: '',
        name: '',
        creditHours: '',
        faculty: '',
        semester: '',
        containsPracticalOrProject: false,
        haveAssistants: false,
        midTerm: '',
        finalExam: '',
        quizzes: '',
        practical: '',
        totalMarks: 0,
        departments: [],
    });

    const [departmentsList, setDepartmentsList] = useState([]); // For available departments
    const [errors, setErrors] = useState({});

    const token = getAccessToken();
    const facultyOfAdmin = getFacultyFromToken(token);

    const navigate = useNavigate();

    // Calculate totalMarks whenever the relevant fields are updated
    useEffect(() => {
        const { midTerm, finalExam, quizzes, practical } = courseData;
        const calculatedTotalMarks = 
            (parseInt(midTerm) || 0) + 
            (parseInt(finalExam) || 0) + 
            (parseInt(quizzes) || 0) + 
            (parseInt(practical) || 0);
        setCourseData(prevData => ({
            ...prevData,
            totalMarks: calculatedTotalMarks,
        }));
    },[courseData.midTerm, courseData.finalExam, courseData.quizzes, courseData.practical]);

    // Fetch list of departments from API or mock data
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_ALL_DEPARTMENTS}${facultyOfAdmin}`);
                setDepartmentsList(response.data.$values);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
        setCourseData((prevData) => ({
            ...prevData,
            faculty: facultyOfAdmin,
        }));
    }, [facultyOfAdmin]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCourseData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleDepartmentChange = (e) => {
        const { value, checked } = e.target;
        setCourseData((prevData) => {
            if (checked) {
                return {
                    ...prevData,
                    departments: [...prevData.departments, value],
                };
            } else {
                return {
                    ...prevData,
                    departments: prevData.departments.filter((dept) => dept !== value),
                };
            }
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!courseData.courseId) newErrors.courseId = "Course Id is required.";
        if (!courseData.name) newErrors.name = "Course name is required.";
        if (!courseData.creditHours || isNaN(courseData.creditHours) || courseData.creditHours <= 0) 
            newErrors.creditHours = "A valid credit hour is required.";
        if (!courseData.semester || isNaN(courseData.semester) || courseData.semester < 1 || courseData.semester > 8) 
            newErrors.semester = "Semester must be a number between 1 and 8.";
        if (!courseData.departments || courseData.departments.length === 0) 
            newErrors.departments = "At least one department must be selected.";
        if (!courseData.midTerm) newErrors.midTerm = "MidTerm Marks are required.";
        if (!courseData.finalExam) newErrors.finalExam = "Final Exam Marks are required.";
        if (!courseData.quizzes) newErrors.quizzes = "Quizzes Marks are required.";
        if (courseData.containsPracticalOrProject && !courseData.practical) 
            newErrors.practical = "Practical Marks are required when the course contains a practical or project.";
        if (!courseData.totalMarks) newErrors.totalMarks = "Total Marks are required.";

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Please fill all required fields.", { autoClose: 1500 });
            return;
        }

        const payload = {
              courseId: courseData.courseId,
              name: courseData.name,
              creditHours: parseInt(courseData.creditHours),
              faculty: courseData.faculty,
              semester: parseInt(courseData.semester),
              containsPracticalOrProject: courseData.containsPracticalOrProject,
              haveAssistants: courseData.haveAssistants,
              midTerm: parseFloat(courseData.midTerm),
              finalExam: parseFloat(courseData.finalExam),
              quizzes: parseFloat(courseData.quizzes),
              practical: courseData.containsPracticalOrProject ? parseFloat(courseData.practical) : null,
              totalMarks: courseData.totalMarks,
              departments: courseData.departments.map((dept) => ({ departmentId: dept })),
        };

        try {
            await axiosInstance.post(URL.CREATE_COURSE, payload);
            toast.success("Course created successfully!", { autoClose: 2000 });
            setCourseData({
                courseId: '',
                name: '',
                creditHours: '',
                faculty: facultyOfAdmin,
                semester: '',
                containsPracticalOrProject: false,
                haveAssistants: false,
                midTerm: '',
                finalExam: '',
                quizzes: '',
                practical: '',
                totalMarks: 0,
                departments: [],
            });
            setErrors({});
            navigate("/admin/manageCourses");
        } catch (error) {
            console.error("Error creating course:", error);
            toast.error(error.response?.data?.message || "Failed to create course. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageCourses");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Create Course</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course ID</label>
                        <input
                            type="text"
                            name="courseId"
                            value={courseData.courseId}
                            onChange={handleChange}
                            placeholder="Enter course ID"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.courseId && <p className="text-red-600 text-sm">{errors.courseId}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course Name</label>
                        <input
                            type="text"
                            name="name"
                            value={courseData.name}
                            onChange={handleChange}
                            placeholder="Enter course name"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Credit Hours</label>
                        <input
                            type="number"
                            name="creditHours"
                            value={courseData.creditHours}
                            onChange={handleChange}
                            placeholder="Enter credit hours"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.creditHours && <p className="text-red-600 text-sm">{errors.creditHours}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Semester</label>
                        <input
                            type="number"
                            name="semester"
                            value={courseData.semester}
                            onChange={handleChange}
                            placeholder="Enter semester (1-8)"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.semester && <p className="text-red-600 text-sm">{errors.semester}</p>}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="containsPracticalOrProject"
                            checked={courseData.containsPracticalOrProject}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Contains Practical/Project</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="haveAssistants"
                            checked={courseData.haveAssistants}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Has Assistants?</label>
                    </div>
                    {courseData.containsPracticalOrProject && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Practical/Project Marks</label>
                            <input
                                type="number"
                                name="practical"
                                value={courseData.practical}
                                onChange={handleChange}
                                placeholder="Enter practical marks"
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                            />
                            {errors.practical && <p className="text-red-600 text-sm">{errors.practical}</p>}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">MidTerm Marks</label>
                        <input
                            type="number"
                            name="midTerm"
                            value={courseData.midTerm}
                            onChange={handleChange}
                            placeholder="Enter mid-term marks"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.midTerm && <p className="text-red-600 text-sm">{errors.midTerm}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Final Exam Marks</label>
                        <input
                            type="number"
                            name="finalExam"
                            value={courseData.finalExam}
                            onChange={handleChange}
                            placeholder="Enter final exam marks"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.finalExam && <p className="text-red-600 text-sm">{errors.finalExam}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quizzes Marks</label>
                        <input
                            type="number"
                            name="quizzes"
                            value={courseData.quizzes}
                            onChange={handleChange}
                            placeholder="Enter quizzes marks"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.quizzes && <p className="text-red-600 text-sm">{errors.quizzes}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Marks</label>
                        <input
                            type="number"
                            name="totalMarks"
                            value={courseData.totalMarks}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2 bg-gray-200"
                            readOnly
                        />
                        {errors.totalMarks && <p className="text-red-600 text-sm">{errors.totalMarks}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Departments</label>
                        {departmentsList.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {departmentsList.map((dept) => (
                                    <div key={dept.departmentId} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={dept.departmentId}
                                            value={dept.departmentId}
                                            checked={courseData.departments.includes(dept.departmentId)}
                                            onChange={handleDepartmentChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor={dept.departmentId} className="text-sm text-gray-700">
                                            {dept.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No departments available</p>
                        )}
                        {errors.departments && <p className="text-red-600 text-sm">{errors.departments}</p>}
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Create Course
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCoursePage;
