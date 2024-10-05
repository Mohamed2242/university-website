// src/interceptors.js
import axiosInstance from "./axios";
import URL from './constants/api-urls';

import {
	getAccessToken,
	getRefreshToken,
	saveTokens,
	clearTokens,
} from "./authService"; // Implement token storage functions

// Request interceptor
axiosInstance.interceptors.request.use(
	async (config) => {
		const accessToken = getAccessToken();
		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		if (
			error.response &&
			error.response.status === 401 &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;
			const refreshToken = getRefreshToken();

			if (refreshToken) {
				try {
					// Make a request to the refresh endpoint
					const response = await axiosInstance.post(URL.REFRESH_URL , {
						accessToken: getAccessToken(),
						refreshToken: getRefreshToken(),
					});

					// Save new tokens
					const { accessToken, refreshToken } = response.data;
					saveTokens(accessToken, refreshToken);

					// Retry the original request with the new access token
					originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
					return axiosInstance(originalRequest);
				} catch (refreshError) {
					console.error("Token refresh failed:", refreshError);
					// Handle refresh failure (e.g., logout)
					// Clear tokens and log the user out
					clearTokens();
					// Optionally redirect to login page or show an error message
					return Promise.reject(refreshError);
				}
			} else {
				// No refresh token available, log out the user
				clearTokens();
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;
