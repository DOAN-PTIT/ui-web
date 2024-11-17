import axios from 'axios';
import { getHostName } from '@/utils/tools';

// Tạo axios instance
const apiClient = axios.create({
    baseURL: getHostName(), 
    headers: {
        'Content-Type': 'application/json',
    },
});


async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error("Refresh token không tồn tại.");
    }

    try {
        const response = await axios.post(`${getHostName()}/auth/refresh-token`, {
            refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken); 
        return newAccessToken;
    } catch (error) {
        console.error("Lấy lại access token thất bại:", error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken'); 
        throw error;
    }
}


apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});


apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return apiClient(originalRequest); 
            } catch (refreshError) {
                console.error("Làm mới token thất bại:", refreshError);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
