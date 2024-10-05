// src/axios.js
import axios from 'axios';
import URL from './constants/api-urls';

const axiosInstance = axios.create({
    baseURL: URL.BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
