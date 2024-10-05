import { jwtDecode } from 'jwt-decode';


// src/authService.js
export const getAccessToken = () => {
    return localStorage.getItem('accessToken');
};

export const getRefreshToken = () => {
    return localStorage.getItem('refreshToken');
};

export const saveTokens = (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
};

export const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

export const isTokenExpired = (token) => {
    if (!token) return true;
    
    const { exp } = jwtDecode(token);
    if (exp * 1000 < Date.now()) {
        return true;
    }
    
    return false;
};

export const getEmailFromToken = (token) => {
    if (!token) return null;

    const decodedToken = jwtDecode(token);
    return decodedToken.email;
};

export const getFacultyFromToken = (token) => {
    if (!token) return null;

    const decodedToken = jwtDecode(token);
    return decodedToken.Faculty;
};

export const getRoleFromToken = (token) => {
    if (!token) return null;

    const decodedToken = jwtDecode(token);
    return decodedToken.role;
};