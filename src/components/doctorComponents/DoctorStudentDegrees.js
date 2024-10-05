import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../axios";
import Dashboard from "../Dashboard";
import URL from "../../constants/api-urls";
import { toast } from "react-toastify";
import { getAccessToken, getEmailFromToken, getFacultyFromToken, getRoleFromToken } from "../../authService";

const DoctorStudentDegreesPage = () => {
    const { courseId, email } = useParams();
    const [degrees, setDegrees] = useState([]);
    const [originalDegrees, setOriginalDegrees] = useState([]); // Store original values for comparison
    const [isModified, setIsModified] = useState(false); // Track if any field has been modified
    const navigate = useNavigate();

    const token = getAccessToken();
    const emailOfDoctor = getEmailFromToken(token);
    const faculty = getFacultyFromToken(token);
    const role = getRoleFromToken(token);

    // Fetch student's degrees for the course
    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                const response = await axiosInstance.get(`${URL.GET_STUDENT_DEGREES_BY_COURSE_FOR_DOCTOR}${email}/${courseId}`);
                setDegrees(response.data.courses.$values);
                setOriginalDegrees(response.data.courses.$values.map(degree => ({ ...degree }))); // Clone original values
            } catch (error) {
                toast.error("Error fetching degrees.", { autoClose: 1500 });
            }
        };
        fetchDegrees();
    }, [courseId, email]);

    // Function to handle updating a student's degree
    const handleUpdateDegree = async (updatedDegree) => {
        try {
            await axiosInstance.put(`${URL.UPDATE_STUDENT_DEGREE_BY_DOCTOR}${emailOfDoctor}/${courseId}`, updatedDegree);
            toast.success("Degree updated successfully.", { autoClose: 1500 });
            navigate(-1);
        } catch (error) {
            toast.error("Error updating degree.", { autoClose: 1500 });
            console.error("Error updating degree: ", error);
        }
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const degreesToUpdate = degrees.filter((degree, index) => {
            // Check if there are any modifications
            return (
                degree.studentMidTerm !== originalDegrees[index].studentMidTerm ||
                degree.studentFinalExam !== originalDegrees[index].studentFinalExam ||
                degree.studentQuizzes !== originalDegrees[index].studentQuizzes ||
                degree.studentPractical !== originalDegrees[index].studentPractical
            );
        });

        if (degreesToUpdate.length > 0) {
            degreesToUpdate.forEach(degree => {
                const updatedDegree = {
                    Email: email,
                    MidTerm: Number(degree.studentMidTerm),
                    FinalExam: Number(degree.studentFinalExam),
                    Quizzes: Number(degree.studentQuizzes),
                    Practical: Number(degree.studentPractical),
                };

                // Validate the updatedDegree before updating
                const errors = validateDegree(updatedDegree);
                if (errors.length === 0) {
                    handleUpdateDegree(updatedDegree);
                } else {
                    toast.error("Please fix the validation errors before saving.", { autoClose: 1500 });
                }
            });
            setIsModified(false); // Reset modified state after submission
        } else {
            toast.info("No changes detected to save.", { autoClose: 1500 }); // Inform the user that no changes were made
        }
    };

    // Validation function
    const validateDegree = (degree) => {
        const errors = [];
        if (degree.MidTerm > degree.courseMidTerm) {
            errors.push("MidTerm marks cannot exceed maximum MidTerm marks.");
        }
        if (degree.FinalExam > degree.courseFinalExam) {
            errors.push("Final Exam marks cannot exceed maximum Final Exam marks.");
        }
        if (degree.Quizzes > degree.courseQuizzes) {
            errors.push("Quiz marks cannot exceed maximum Quiz marks.");
        }
        if (degree.Practical > degree.coursePractical) {
            errors.push("Practical marks cannot exceed maximum Practical marks.");
        }
        return errors;
    };

    // Calculate total marks based on other fields
    const calculateTotalMarks = (degree) => {
        return (
            (degree.studentMidTerm || 0) +
            (degree.studentFinalExam || 0) +
            (degree.studentQuizzes || 0) +
            (degree.studentPractical || 0)
        );
    };

    const handleChange = (index, field, value) => {
        const newDegrees = [...degrees];
        newDegrees[index][field] = Number(value); // Convert to number
        setDegrees(newDegrees);
        setIsModified(true); // Mark as modified
    };

    if (!degrees.length) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-university-gradient">
            <Dashboard email={emailOfDoctor} faculty={faculty} role={role} />
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Degrees for Student {email}</h1>
                    <button 
                        onClick={() => navigate(-1)} 
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                    >
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {degrees.map((degree, index) => (
                            <div key={index} className="bg-gray-200 p-4 rounded-lg shadow-md">
                                <h2 className="text-xl font-bold">{degree.name}</h2>
                                
                                <div>
                                    <label>MidTerm:</label>
                                    <input 
                                        type="number" 
                                        value={degree.studentMidTerm} 
                                        onChange={(e) => handleChange(index, "studentMidTerm", e.target.value)} 
                                        className="mt-1 p-2 border rounded w-full"
                                        min={0}
                                        max={degree.courseMidTerm}
                                    />
                                    <span className="text-gray-500"> / {degree.courseMidTerm}</span>
                                </div>

                                <div>
                                    <label>Final Exam:</label>
                                    <input 
                                        type="number" 
                                        value={degree.studentFinalExam} 
                                        onChange={(e) => handleChange(index, "studentFinalExam", e.target.value)} 
                                        className="mt-1 p-2 border rounded w-full"
                                        min={0}
                                        max={degree.courseFinalExam}
                                    />
                                    <span className="text-gray-500"> / {degree.courseFinalExam}</span>
                                </div>

                                <div>
                                    <label>Quizzes:</label>
                                    <input 
                                        type="number" 
                                        value={degree.studentQuizzes} 
                                        onChange={(e) => handleChange(index, "studentQuizzes", e.target.value)} 
                                        className="mt-1 p-2 border rounded w-full"
                                        min={0}
                                        max={degree.courseQuizzes}
                                    />
                                    <span className="text-gray-500"> / {degree.courseQuizzes}</span>
                                </div>

                                <div>
                                    <label>Practical:</label>
                                    <input 
                                        type="number" 
                                        value={degree.studentPractical} 
                                        onChange={(e) => handleChange(index, "studentPractical", e.target.value)} 
                                        className="mt-1 p-2 border rounded w-full"
                                        min={0}
                                        max={degree.coursePractical}
                                    />
                                    <span className="text-gray-500"> / {degree.coursePractical}</span>
                                </div>

                                {/* Read-only Total Marks */}
                                <div>
                                    <label>Total Marks:</label>
                                    <input 
                                        type="text" 
                                        value={calculateTotalMarks(degree)} 
                                        readOnly 
                                        className="mt-1 p-2 border rounded w-full bg-gray-100 cursor-not-allowed"
                                    />
                                </div>

                                {/* Validation error display */}
                                {validateDegree(degree).length > 0 && (
                                    <div className="mt-2 text-red-500">
                                        {validateDegree(degree).map((error, i) => (
                                            <p key={i}>{error}</p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {/* Submit button to save all updates */}
                    <button 
                        type="submit" 
                        className={`mt-6 ${isModified ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white py-2 px-4 rounded-lg`}
                        disabled={!isModified} // Disable if no changes were made
                    >
                        Save All Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DoctorStudentDegreesPage;
