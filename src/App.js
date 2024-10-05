import React from "react";
import PrivateRoute from "./PrivateRoute";
import { ToastContainer } from "react-toastify";

import {
	BrowserRouter as Router,
	Route,
	Routes,
	Navigate,
} from "react-router-dom";
import Login from "./components/Login";

import Admin from "./components/adminComponents/Admin";
import ManageAdmins from "./components/adminComponents/ManageAdmins/ManageAdmins";
import CreateAdmin from "./components/adminComponents/ManageAdmins/Create";
import EditAdmin from "./components/adminComponents/ManageAdmins/Edit";
import DetailsOfAdmin from "./components/adminComponents/ManageAdmins/Details";

import ManageAssistants from "./components/adminComponents/ManageAssistants/ManageAssistants";
import ManageCourses from "./components/adminComponents/ManageCourses/ManageCourses";
import ManageDepartments from "./components/adminComponents/ManageDepartments/ManageDepartments";
import ManageDoctors from "./components/adminComponents/ManageDoctors/ManageDoctors";
import ManageStudents from "./components/adminComponents/ManageStudents/ManageStudents";
import ResetPassword from "./components/ResetPassword";
import CreateCoursePage from "./components/adminComponents/ManageCourses/Create";
import CourseDetails from "./components/adminComponents/ManageCourses/Details";
import EditCoursePage from "./components/adminComponents/ManageCourses/Edit";
import CreateDoctorPage from "./components/adminComponents/ManageDoctors/Create";
import CreateAssistantPage from "./components/adminComponents/ManageAssistants/Create";
import CreateStudentPage from "./components/adminComponents/ManageStudents/Create";
import DoctorDetails from "./components/adminComponents/ManageDoctors/Details";
import EditDoctorPage from "./components/adminComponents/ManageDoctors/Edit";
import AssistantDetails from "./components/adminComponents/ManageAssistants/Details";
import EditAssistantPage from "./components/adminComponents/ManageAssistants/Edit";
import StudentDetails from "./components/adminComponents/ManageStudents/Details";
import EditStudentPage from "./components/adminComponents/ManageStudents/Edit";
import StudentLandingPage from "./components/studentComponents/Student";
import RegisterCoursesPage from "./components/studentComponents/RegisterCourses";
import StudentDegreesPage from "./components/studentComponents/StudentDegrees";
import DoctorLandingPage from "./components/doctorComponents/Doctor";
import DoctorCourseStudentsPage from "./components/doctorComponents/DoctorCourseStudents";
import DoctorStudentDegreesPage from "./components/doctorComponents/DoctorStudentDegrees";
import AssistantCourseStudentsPage from "./components/assistantComponents/AssistantCourseStudents";
import AssistantStudentDegreesPage from "./components/assistantComponents/AssistantStudentDegrees";
import AssistantLandingPage from "./components/assistantComponents/Assistant";

function App() {
	return (
		<>
			<Router>
				<div className="App">
					<Routes>
						<Route path="/" element={<Navigate to="/login" />} />
						<Route path="/login" element={<Login />} />
						<Route path="/reset" element={<ResetPassword />} />

						<Route
							path="/student/:email"
							element={
								<PrivateRoute>
									<StudentLandingPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/student/registerCourses/:email"
							element={
								<PrivateRoute>
									<RegisterCoursesPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/student/studentDegrees/:email"
							element={
								<PrivateRoute>
									<StudentDegreesPage />
								</PrivateRoute>
							}
						/>

						<Route
						 	path="/doctor/:email" 
							element={
								<PrivateRoute>
									<DoctorLandingPage />
								</PrivateRoute>
							}
						/>
						<Route
						 	path="/doctor/course/:courseId" 
							element={
								<PrivateRoute>
									<DoctorCourseStudentsPage />
								</PrivateRoute>
							}
						/>
						<Route
						 	path="/doctor/course/:courseId/student/:email" 
							element={
								<PrivateRoute>
									<DoctorStudentDegreesPage />
								</PrivateRoute>
							}
						/>


						<Route
						 	path="/assistant/:email" 
							element={
								<PrivateRoute>
									<AssistantLandingPage />
								</PrivateRoute>
							}
						/>
						<Route
						 	path="/assistant/course/:courseId" 
							element={
								<PrivateRoute>
									<AssistantCourseStudentsPage />
								</PrivateRoute>
							}
						/>
						<Route
						 	path="/assistant/course/:courseId/student/:email" 
							element={
								<PrivateRoute>
									<AssistantStudentDegreesPage />
								</PrivateRoute>
							}
						/>

						<Route
							path="/admin"
							element={
								<PrivateRoute>
									<Admin />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageAdmins"
							element={
								<PrivateRoute>
									<ManageAdmins />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageAdmins/create"
							element={
								<PrivateRoute>
									<CreateAdmin />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageAdmins/details/:email"
							element={
								<PrivateRoute>
									<DetailsOfAdmin />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageAdmins/Edit/:email"
							element={
								<PrivateRoute>
									<EditAdmin />
								</PrivateRoute>
							}
						/>

						<Route
							path="/admin/manageCourses"
							element={
								<PrivateRoute>
									<ManageCourses />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageCourses/create"
							element={
								<PrivateRoute>
									<CreateCoursePage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageCourses/details/:courseId"
							element={
								<PrivateRoute>
									<CourseDetails />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageCourses/Edit/:courseId"
							element={
								<PrivateRoute>
									<EditCoursePage />
								</PrivateRoute>
							}
						/>

						<Route
							path="/admin/manageDepartments"
							element={
								<PrivateRoute>
									<ManageDepartments />
								</PrivateRoute>
							}
						/>

						<Route
							path="/admin/manageDoctors"
							element={
								<PrivateRoute>
									<ManageDoctors />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageDoctors/create"
							element={
								<PrivateRoute>
									<CreateDoctorPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageDoctors/details/:email"
							element={
								<PrivateRoute>
									<DoctorDetails />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageDoctors/Edit/:email"
							element={
								<PrivateRoute>
									<EditDoctorPage />
								</PrivateRoute>
							}
						/>


						<Route
							path="/admin/manageAssistants"
							element={
								<PrivateRoute>
									<ManageAssistants />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageAssistants/create"
							element={
								<PrivateRoute>
									<CreateAssistantPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageAssistants/details/:email"
							element={
								<PrivateRoute>
									<AssistantDetails />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageAssistants/Edit/:email"
							element={
								<PrivateRoute>
									<EditAssistantPage />
								</PrivateRoute>
							}
						/>


						<Route
							path="/admin/manageStudents"
							element={
								<PrivateRoute>
									<ManageStudents />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageStudents/create"
							element={
								<PrivateRoute>
									<CreateStudentPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageStudents/details/:email"
							element={
								<PrivateRoute>
									<StudentDetails />
								</PrivateRoute>
							}
						/>
						<Route
							path="/admin/manageStudents/edit/:email"
							element={
								<PrivateRoute>
									<EditStudentPage />
								</PrivateRoute>
							}
						/>

					</Routes>
				</div>
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;
