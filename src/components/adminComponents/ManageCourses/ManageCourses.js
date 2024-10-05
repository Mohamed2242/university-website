// src/components/CourseManagement.js
import React, { useEffect, useState } from "react";
import axiosInstance from "../../../axios"; // For API calls
import {
	getAccessToken,
	getEmailFromToken,
	getFacultyFromToken,
	getRoleFromToken,
} from "../../../authService"; // Utility for getting faculty from token
import { useNavigate } from "react-router-dom";
import URL from "../../../constants/api-urls";
import Dashboard from "../../Dashboard";
import { toast } from "react-toastify";

const CourseManagement = () => {
	const [filteredCourses, setFilteredCourses] = useState([]);
	const [semester, setSemester] = useState("All Semesters");
	const [courseName, setCourseName] = useState("");
	const [isModalOpen, setModalOpen] = useState(false);
	const [courseIdToDelete, setCourseIdToDelete] = useState(null);
	const navigate = useNavigate();

	const token = getAccessToken();
	const email = getEmailFromToken(token);
	const faculty = getFacultyFromToken(token);
	const role = getRoleFromToken(token);

	// Fetch all courses based on the faculty
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await axiosInstance.get(
					`${URL.GET_ALL_COURSES}${faculty}`
				);
				setFilteredCourses(response.data.$values); // Set initial filtered courses
			} catch (error) {
				console.error("Error fetching courses:", error);
				toast.error("Failed to fetch courses", { autoClose: 1500 });
			}
		};
		fetchCourses();
	}, [faculty]);

	const handleCreate = () => {
		navigate("/admin/manageCourses/create");
	};

	const handleBack = () => {
		navigate("/admin");
	};

	const handleDetails = (courseId) => {
		navigate(`/admin/manageCourses/details/${courseId}`);
	};

	const handleEdit = (courseId) => {
		navigate(`/admin/manageCourses/edit/${courseId}`);
	};

	const handleDelete = (courseId) => {
		setCourseIdToDelete(courseId);
		setModalOpen(true);
	};

	const confirmDelete = async () => {
		try {
			const response = await axiosInstance.delete(
				`${URL.DELETE_COURSE}${courseIdToDelete}`
			);

			if (response.status === 200) {
				toast.success(`Course ${courseIdToDelete} deleted successfully`, {
					autoClose: 1500,
				});
				setFilteredCourses((prevCourses) =>
					prevCourses.filter((course) => course.courseId !== courseIdToDelete)
				);
			} else {
				toast.error("Error deleting course", { autoClose: 1500 });
			}
		} catch (error) {
			console.error("Error deleting the course:", error);
		} finally {
			setModalOpen(false);
		}
	};

	const handleFilterCourses = async () => {
		try {
			let url;
			if (semester === "All Semesters" && !courseName) {
				// If both filters are default, fetch all courses
				url = `${URL.GET_ALL_COURSES}${faculty}`;
			} else if (semester !== "All Semesters" && !courseName) {
				// Filter by semester
				url = `${URL.GET_COURSES_BY_SEMESTER}${faculty}/${semester}`;
			} else if (semester === "All Semesters" && courseName) {
				// Search by course name
				url = `${URL.GET_COURSES_BY_NAME}${faculty}/${courseName}`;
			} else {
				// Filter by semester and search by name
				url = `${URL.GET_COURSES_BY_SEMESTER_AND_NAME}${faculty}/${semester}/${courseName}`;
			}

			const response = await axiosInstance.get(url);
			const courses = response.data.$values;

			if (courses.length === 0) {
				// Show user-friendly message if no courses are found
				toast.info("No courses found for the selected filters.", {
					autoClose: 1500,
				});
			}
			setFilteredCourses(response.data.$values);
		} catch (error) {
			console.error("Error filtering courses:", error);
			toast.error("Failed to filter courses", { autoClose: 1500 });
		}
	};

	return (
		<div className="bg-university-gradient">
			<Dashboard email={email} faculty={faculty} role={role} />
			<div className="container mx-auto px-4 py-8 bg-university-gradient">
				<h1 className="text-2xl font-bold mb-6">Course Management</h1>
				{/* Back and Create Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 mb-4">
					<button
						onClick={handleBack}
						className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
					>
						Back
					</button>
					<button
						onClick={handleCreate}
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
					>
						Create New Course
					</button>
                    <input
						type="text"
						placeholder="Search by course name"
						value={courseName}
						onChange={(e) => setCourseName(e.target.value)}
						className="rounded-lg border border-gray-300 px-4 py-2 rounded w-1/2"
					/>
					<select
						value={semester}
						onChange={(e) => setSemester(e.target.value)}
						className="rounded-lg border border-gray-300 px-4 py-2 rounded w-1/2"
					>
						<option value="All Semesters">All Semesters</option>
						{[...Array(8)].map((_, index) => (
							<option key={index} value={index + 1}>
								Semester {index + 1}
							</option>
						))}
					</select>
					<button
						onClick={handleFilterCourses}
						className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded ml-4"
					>
						Show
					</button>
				</div>
				
				{/* Responsive Table */}
				{filteredCourses.length > 0 ? (
					<div className="overflow-x-auto">
						<table className="min-w-full table-auto border-collapse">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-4 py-2 border">Course ID</th>
									<th className="px-4 py-2 border">Course Name</th>
									<th className="px-4 py-2 border">Semester</th>
									<th className="px-4 py-2 border">Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredCourses.map((course) => (
									<tr key={course.courseId} className="bg-white border-b">
										<td className="px-4 py-2 text-center border">
											{course.courseId}
										</td>
										<td className="px-4 py-2 text-center border">
											{course.name}
										</td>
										<td className="px-4 py-2 text-center border">
											{course.semester}
										</td>
										<td className="px-4 py-2 flex justify-center space-x-4">
											<button
												onClick={() => handleDetails(course.courseId)}
												className="text-green-500 hover:text-green-600"
												title="Details"
											>
												<i
													className="bi bi-info-circle"
													style={{ fontSize: "1.5rem" }}
												></i>
											</button>
											<button
												onClick={() => handleEdit(course.courseId)}
												className="text-blue-600 hover:text-blue-700"
												title="Edit"
											>
												<i
													className="bi bi-pencil-square"
													style={{ fontSize: "1.5rem" }}
												></i>
											</button>
											<button
												onClick={() => handleDelete(course.courseId)}
												className="text-red-600 hover:text-red-700"
												title="Delete"
											>
												<i
													className="bi bi-trash"
													style={{ fontSize: "1.5rem" }}
												></i>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<p className="text-center text-gray-500 text-2xl font-semibold">
						There are no courses.
					</p>
				)}
				{/* Delete Confirmation Modal */}
				{isModalOpen && (
					<div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
						<div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
							<h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
							<p className="mb-4">
								Are you sure you want to delete the course with ID:{" "}
								<strong>{courseIdToDelete}</strong>?
							</p>
							<div className="flex justify-end space-x-4">
								<button
									onClick={confirmDelete}
									className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition"
								>
									Confirm
								</button>
								<button
									onClick={() => setModalOpen(false)}
									className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default CourseManagement;
