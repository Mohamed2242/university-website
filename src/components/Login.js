import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../interceptors";
import URL from "../constants/api-urls";
import { saveTokens } from "../authService";

const Login = () => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [facultyName, setFaculty] = useState("");
	const [role, setRole] = useState("");
	const [errors, setErrors] = useState({}); // For tracking validation errors
	const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
	const [backupEmail, setBackupEmail] = useState("");
	const [backupEmailError, setBackupEmailError] = useState("");
	const [emailError, setemailError] = useState("");

	const roles = ["Admin", "Student", "Doctor", "Assistant"];
	const faculties = [
		"Faculty of Science",
		"Faculty of Computer Science",
		"Faculty of Arts",
		"Faculty of Engineering",
		"Faculty of Medicine",
		"Faculty of Law",
		"Faculty of Business",
		"Faculty of Education",
		"Faculty of Agriculture",
		"Faculty of Pharmacy",
		"Faculty of Architecture",
		"Faculty of Information Technology",
		"Faculty of Nursing",
		"Faculty of Social Sciences",
		"Faculty of Psychology",
		"Faculty of Linguistics",
		"Faculty of Music",
		"Faculty of Design",
	];

	// Handle login form submission
	const handleLogin = async () => {
		let validationErrors = {};
		if (!facultyName) validationErrors.facultyName = "Faculty is required";
		if (!email) validationErrors.email = "Email is required";
		if (!password) validationErrors.password = "Password is required";
		if (!role) validationErrors.role = "Role is required";

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			toast.error("Must fill all fields", { autoClose: 1500 });
			return;
		}

		setErrors({});

		const loginData = {
			facultyName,
			email,
			password,
			role,
		};

		try {
			const response = await axiosInstance.post(URL.LOGIN_URL, loginData);

			const { accessToken, refreshToken, message } = response.data;
			saveTokens(accessToken, refreshToken);
			toast.success(message || "Login successful", { autoClose: 1500 });

			if (role === "Admin") {
				navigate(`/admin`);
			} else if (role === "Student") {
				navigate(`/student/${email}`);
			} else if (role === "Doctor") {
				navigate(`/doctor/${email}`);
			} else if (role === "Assistant") {
				navigate(`/assistant/${email}`);
			} 
		} catch (error) {
			toast.error(error.response?.data?.message || "Login failed", {
				autoClose: 1500,
			});
		}
	};

	// Handle forgot password pop-up submission
	const handleSendResetEmail = async () => {
		if (!backupEmail || !email) {
			setBackupEmailError("Backup Email is required");
			setemailError("Email is required")
			return;
		}

		// Simple email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(backupEmail) || !emailRegex.test(email)) {
			setBackupEmailError("Please enter a valid email");
			setemailError("Please enter a valid email");
			return;
		}

		try {
			await axiosInstance.post(`${URL.SEND_EMAIL_TO_RESET_PASS_FOR_FORGOT}${backupEmail}/${email}`);
			toast.success("Reset email sent successfully", { autoClose: 1500 });
			setShowForgotPasswordModal(false);
			setEmail("");
			setBackupEmail(""); // Clear the input field
		} catch (error) {
			toast.error("Failed to send reset email", { autoClose: 1500 });
		}
	};

	return (
		<div className="min-h-screen bg-university-gradient flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Sign in to your University account
				</h2>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
					<div className="space-y-6">
						{/* Faculty Dropdown */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Faculty
							</label>
							<select
								value={facultyName}
								onChange={(e) => setFaculty(e.target.value)}
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
							>
								<option value="">Select your faculty</option>
								{faculties.map((fac, index) => (
									<option key={index} value={fac}>
										{fac}
									</option>
								))}
							</select>
							{errors.facultyName && (
								<p className="text-red-500 text-sm">{errors.facultyName}</p>
							)}
						</div>

						{/* Email Input */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter your email address"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
							{errors.email && (
								<p className="text-red-500 text-sm">{errors.email}</p>
							)}
						</div>

						{/* Password Input */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<input
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
							{errors.password && (
								<p className="text-red-500 text-sm">{errors.password}</p>
							)}
							<p
								className="mt-2 text-sm text-blue-600 cursor-pointer"
								onClick={() => setShowForgotPasswordModal(true)}
							>
								Forgot Password?
							</p>
						</div>

						{/* Role Selection */}
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Select Role
							</label>
							<div className="mt-3 grid grid-cols-2 gap-2">
								{roles.slice(0, 2).map((r) => (
									<button
										key={r}
										className={`px-4 py-2 border border-gray-300 rounded-md text-center ${
											role === r
												? "bg-indigo-500 text-white"
												: "bg-white text-gray-700"
										}`}
										onClick={() => setRole(r)}
									>
										{r}
									</button>
								))}
							</div>
							<div className="mt-3 grid grid-cols-2 justify-center gap-2">
								{roles.slice(2).map((r) => (
									<button
										key={r}
										className={`px-4 py-2 border border-gray-300 rounded-md text-center ${
											role === r
												? "bg-indigo-500 text-white"
												: "bg-white text-gray-700"
										}`}
										onClick={() => setRole(r)}
									>
										{r}
									</button>
								))}
							</div>
							{errors.role && (
								<p className="text-red-500 text-sm">{errors.role}</p>
							)}
						</div>

						{/* Sign-in Button */}
						<div>
							<button
								onClick={handleLogin}
								className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
							>
								Sign in
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Forgot Password Modal */}
			{showForgotPasswordModal && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
					<div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
					<h2 className="text-xl font-semibold text-center">
							Enter your email
						</h2>
						<div className="mt-4">
							<input
								type="email"
								value={email}
								onChange={(e) => setBackupEmail(e.target.value)}
								placeholder="Enter backup email"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
							{emailError && (
								<p className="text-red-500 text-sm">{emailError}</p>
							)}
						</div>

						<h2 className="text-xl font-semibold text-center">
							Enter your backup email
						</h2>
						<div className="mt-4">
							<input
								type="email"
								value={backupEmail}
								onChange={(e) => setBackupEmail(e.target.value)}
								placeholder="Enter backup email"
								className="w-full px-3 py-2 border border-gray-300 rounded-md"
							/>
							{backupEmailError && (
								<p className="text-red-500 text-sm">{backupEmailError}</p>
							)}
						</div>
						<div className="mt-4 flex justify-center space-x-3">
							<button
								className="px-4 py-2 bg-indigo-600 text-white rounded-md"
								onClick={handleSendResetEmail}
							>
								Send Email
							</button>
							<button
								className="px-4 py-2 bg-gray-400 text-white rounded-md"
								onClick={() => {
									setEmail("")
									setBackupEmail(""); // Clear the email field
									setShowForgotPasswordModal(false); // Hide the modal
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Login;
