import React, { useState, useEffect } from 'react';
import axiosInstance from '../../../axios';
import URL from '../../../constants/api-urls';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { getAccessToken, getFacultyFromToken } from "../../../authService";

const EditDoctorPage = () => {
    const { email } = useParams();
    const [doctorData, setDoctorData] = useState({
        name: '',
        email: '',
        backupEmail: '',
        role: '',
        faculty: '',
        salary: '',
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
        const fetchDoctorData = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_DOCTOR}${email}`);
                setDoctorData(response.data);
                setInitialData(response.data);
                await fetchCoursesData(response.data.courses.$values); // Fetch departments after getting course data
            } catch (error) {
                console.error("Error fetching doctor data:", error);
            }
        };

        

        fetchDoctorData();
    }, [email]);

    const fetchCoursesData = async (courses) => {
        try {
            const response = await axiosInstance.get(`${URL.GET_ALL_COURSES}${facultyOfAdmin}`); // Adjust URL for fetching courses
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
        setDoctorData((prevData) => ({ ...prevData, [name]: value }));
        setHasChanges(true);
    };


    const handleCourseChange = (event) => {
        const value = event.target.value; // This is expected to be the courseId
        
        setDoctorData((prevData) => {
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
        if (!doctorData.name) newErrors.name = "Name is required.";
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
            name: doctorData.name,
            email: doctorData.email,
            backupEmail: doctorData.backupEmail,
            role: doctorData.role,
            faculty: doctorData.faculty,
            courses: doctorData.courses.$values.map((course) => ({
                courseId: course.courseId, // Adjust the property names as needed
                // Add other course-related fields here if necessary
            })),
        };
        
        try {
            await axiosInstance.put(`${URL.UPDATE_DOCTOR}`, payload);
            toast.success("Doctor updated successfully!", { autoClose: 1500 });
            navigate("/admin/manageDoctors");
        } catch (error) {
            console.error("Error updating doctor:", error);
            toast.error(error.response?.data?.message || "Failed to update doctor. Please try again.", { autoClose: 1500 });
        }
    };

    const handleCancel = () => {
        navigate("/admin/manageDoctors");
    };

    const isButtonDisabled = JSON.stringify(doctorData) === JSON.stringify(initialData);

    return (
        <div className="flex items-center justify-center min-h-screen bg-university-gradient">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h1 className="text-2xl font-bold text-center mb-4">Edit Doctor</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={doctorData.name}
                            onChange={handleChange}
                            placeholder="Enter doctor's name"
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
                            value={doctorData.email}
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
                            value={doctorData.backupEmail}
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
                            value={doctorData.role}
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
                            value={doctorData.faculty}
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
                                    checked={doctorData.courses.$values.some(c => c.courseId === course.courseId)}
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

export default EditDoctorPage;
