
const URL = {
    BASE_URL: "https://universityapi.runasp.net/api/",

	LOGIN_URL: "Home/login",
    REFRESH_URL: "Home/refresh",
    RESETPASSWORD: "Home/reset-password",
    SEND_EMAIL_TO_RESET_PASS_FOR_FORGOT: "Home/send-reset-email/",
    
    GET_STUDENT_BY_EMAIL: "Student/",
    GET_AVAILABLE_COURSES: "Student/available-courses/",
    REGISTER_COURSES: "Student/register-courses/",
    UPDATE_STUDENT_REGISTRATION: "Student/hasRegisteredCourses/",
    GET_STUDENT_DEGREES_FOR_SEMESTER: "Student/get/degrees/",
    GET_GPA: "Student/GetGPA/",
    GET_CGPA: "Student/GetCGPA/",

    GET_COURSES_FOR_DOCTOR: "Doctor/GetCoursesForDoctor/",
    GET_STUDENTS_BY_COURSE_FOR_DOCTOR: "Doctor/GetStudentsByCourse/",
    GET_STUDENT_DEGREES_BY_COURSE_FOR_DOCTOR: "Doctor/GetStudentsDegreesForCourse/",
    UPDATE_STUDENT_DEGREE_BY_DOCTOR: "Doctor/EditStudentDegreesForDoctor/",

    GET_COURSES_FOR_ASSISTANT: "Assistant/GetCoursesForAssistant/",
    GET_STUDENTS_BY_COURSE_FOR_ASSISTANT: "Assistant/GetStudentsByCourse/",
    GET_STUDENT_DEGREES_BY_COURSE_FOR_ASSISTANT: "Assistant/GetStudentsDegreesForCourse/",
    UPDATE_STUDENT_DEGREE_BY_ASSISTANT: "Assistant/EditStudentDegreesForAssistant/",
    
    CREATE_ADMIN: "Employee/add/employee",
    CREATE_STUDENT: "Employee/add/student",
    CREATE_DOCTOR: "Employee/add/doctor",
    CREATE_ASSISTANT: "Employee/add/assistant",
    CREATE_COURSE: "Employee/add/course",
    CREATE_DEPARTMENT: "Employee/add/department",

    GET_ADMIN: "Employee/get/employee/",
    GET_STUDENT: "Employee/get/student/",
    GET_DOCTOR: "Employee/get/doctor/",
    GET_ASSISTANT: "Employee/get/assistant/",
    GET_COURSE: "Employee/get/course/",
    GET_DEPARTMENT: "Employee/get/department",

    GET_ALL_ADMINS: "Employee/get/allAdmins/",
    GET_ALL_STUDENTS: "Employee/get/allStudents/",
    GET_ALL_DOCTORS: "Employee/get/allDoctors/",
    GET_ALL_ASSISTANTS: "Employee/get/allAssistants/",
    GET_ALL_COURSES: "Employee/get/allCourses/",
    GET_COURSES_BY_SEMESTER: "Employee/get/coursesBySemester/",
    GET_COURSES_BY_NAME: "Employee/get/coursesByName/",
    GET_COURSES_BY_SEMESTER_AND_NAME: "Employee/get/coursesByNameAndSemester/",
    GET_ALL_COURSES_FOR_ASSISTANTS: "Employee/get/allCoursesForAssistants/",
    GET_ALL_DEPARTMENTS: "Employee/get/allDepartments/",
    
    UPDATE_ADMIN: "Employee/update/employee",
    UPDATE_STUDENT: "Employee/update/student",
    UPDATE_DOCTOR: "Employee/update/doctor",
    UPDATE_ASSISTANT: "Employee/update/assistant",
    UPDATE_COURSE: "Employee/update/course",
    UPDATE_DEPARTMENT: "Employee/update/department",

    DELETE_ADMIN: "Employee/delete/employee/",
    DELETE_STUDENT: "Employee/delete/student/",
    DELETE_DOCTOR: "Employee/delete/doctor/",
    DELETE_ASSISTANT: "Employee/delete/assistant/",
    DELETE_COURSE: "Employee/delete/course/",
    DELETE_DEPARTMENT: "Employee/delete/department",




};

export default URL;
