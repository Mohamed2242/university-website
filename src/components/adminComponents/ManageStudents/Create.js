import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios'; // Adjust import based on your project structure
import URL from "../../../constants/api-urls";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, getFacultyFromToken } from "../../../authService";

const CreateStudentPage = () => {
    const [studentData, setStudentData] = useState({
        studentId: '',
        name: '',
        email: '',
        backupEmail: '',
        role: '',
        faculty: '',
        currentSemester: 0,
        hasRegisteredCourses: false,
        department: '',
        totalCreditHours: 0,
    });

    const [departmentsList, setDepartmentsList] = useState([]); // For storing department options
    const [errors, setErrors] = useState({});
    
    const token = getAccessToken();
    const facultyOfAdmin = getFacultyFromToken(token);
    const navigate = useNavigate();

    // Fetch departments when the component mounts
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
        
        // Initialize the student data with faculty and role
        setStudentData((prevData) => ({
            ...prevData,
            faculty: facultyOfAdmin,
            role: "Student",
        }));
    }, [facultyOfAdmin]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setStudentData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!studentData.name) newErrors.name = "Name is required.";
        if (!studentData.email) newErrors.email = "Email is required.";
        if (!studentData.backupEmail) newErrors.backupEmail = "Backup Email is required.";
        if (!studentData.studentId) newErrors.studentId = "Student ID is required.";
        if (!studentData.currentSemester || isNaN(studentData.currentSemester) || studentData.currentSemester < 1 || studentData.currentSemester > 8) 
            newErrors.currentSemester = "Valid Current Semester (1 - 8) is required.";
        if (!studentData.department) newErrors.department = "Department is required.";
        if (!studentData.totalCreditHours || isNaN(studentData.totalCreditHours)) newErrors.totalCreditHours = "A valid total credit hours is required.";
        // if (!studentData.cgpa || isNaN(studentData.cgpa) || studentData.cgpa < 0 || studentData.cgpa > 4 ) newErrors.cgpa = "A valid CGPA is required.";
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

        try {
            // Send the studentData as per the StudentDTO structure
            await axiosInstance.post(URL.CREATE_STUDENT, studentData);
            toast.success("Student created successfully!", { autoClose: 2000 });

            // Reset form
            setStudentData({
                studentId: '',
                name: '',
                email: '',
                backupEmail: '',
                role: 'Student',
                faculty: facultyOfAdmin,
                currentSemester: 0,
                hasRegisteredCourses: false,
                department: '',
                totalCreditHours: 0,
            });
            setErrors({});
            navigate("/admin/manageStudents");
        } catch (error) {
            console.error("Error creating student:", error);
            toast.error(error.response?.data?.message || "Failed to create student. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageStudents");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Create Student</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={studentData.name}
                            onChange={handleChange}
                            placeholder="Enter student name"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.name && <p className="text-red-600 text-sm">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={studentData.email}
                            onChange={handleChange}
                            placeholder="Enter student email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Backup Email</label>
                        <input
                            type="email"
                            name="backupEmail"
                            value={studentData.backupEmail}
                            onChange={handleChange}
                            placeholder="Enter student backup email"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.backupEmail && <p className="text-red-600 text-sm">{errors.backupEmail}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <input
                            type="text"
                            name="role"
                            value={studentData.role}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Faculty</label>
                        <input
                            type="text"
                            name="faculty"
                            value={studentData.faculty}
                            readOnly
                            className="mt-1 block w-full border-gray-300 rounded-md bg-gray-200 text-gray-700 p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input
                            type="text"
                            name="studentId"
                            value={studentData.studentId}
                            onChange={handleChange}
                            placeholder="Enter student ID"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.studentId && <p className="text-red-600 text-sm">{errors.studentId}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Semester</label>
                        <input
                            type="number"
                            name="currentSemester"
                            value={studentData.currentSemester}
                            onChange={handleChange}
                            placeholder="Enter current semester"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.currentSemester && <p className="text-red-600 text-sm">{errors.currentSemester}</p>}
                    </div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="hasRegisteredCourses"
                            checked={studentData.hasRegisteredCourses}
                            onChange={handleChange}
                            className="mr-2"
                        />
                        <label className="text-sm font-medium text-gray-700">Has Registered Courses?</label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Department</label>
                        <select
                            name="department"
                            value={studentData.department}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        >
                            <option value="">Select department</option>
                            {departmentsList.map((dept) => (
                                <option key={dept.id} value={dept.name}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                        {errors.department && <p className="text-red-600 text-sm">{errors.department}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Total Credit Hours</label>
                        <input
                            type="number"
                            name="totalCreditHours"
                            value={studentData.totalCreditHours}
                            onChange={handleChange}
                            placeholder="Enter total credit hours"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-300 p-2"
                        />
                        {errors.totalCreditHours && <p className="text-red-600 text-sm">{errors.totalCreditHours}</p>}
                    </div>                    
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-200 rounded-md shadow-sm">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateStudentPage;
