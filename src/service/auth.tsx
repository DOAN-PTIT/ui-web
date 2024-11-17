import { getHostName } from '@/utils/tools';
import axios from 'axios';

// Tạo axios instance
const apiClient = axios.create({
    baseURL: getHostName(), // Thay URL này bằng URL API của bạn
    headers: {
        'Content-Type': 'application/json',
    },
});

// Hàm để lấy lại access token
async function refreshAccessToken() {
    try {
        const response = await axios.post('/auth/refresh-token', {
            refreshToken: localStorage.getItem('refreshToken'), // Lấy refresh token từ local storage hoặc từ một nơi nào khác
        });
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken); // Lưu access token mới
        return newAccessToken;
    } catch (error) {
        console.error("Lấy lại access token thất bại:", error);
        throw error;
    }
}

// Interceptor để kiểm tra lỗi 401 và gọi API lấy lại access token
apiClient.interceptors.response.use(
    (response) => response, // Trả về response nếu không có lỗi
    async (error) => {
        const originalRequest = error.config;

        // Kiểm tra lỗi 401 và thử lấy lại token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${ newAccessToken }`;
                originalRequest.headers['Authorization'] = `Bearer ${ newAccessToken }`;
                return apiClient(originalRequest); // Gửi lại yêu cầu ban đầu với token mới
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error); // Trả về lỗi nếu không phải là 401 hoặc không lấy lại được token
    }
);

// Cập nhật Authorization header mỗi khi gọi API
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${ token }`;
    }
    return config;
});

export default apiClient;