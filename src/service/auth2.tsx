import axios, { AxiosError } from 'axios';
import { getHostName } from "@/utils/tools";

// Tạo axios instance
const api = axios.create({
  baseURL: getHostName(), // Thay URL này bằng URL API của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm để lấy lại access token
async function refreshAccessToken() {
  try {
    const response = await axios.post('/auth/refresh-token');
    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken); // Lưu access token mới
    return newAccessToken;
  } catch (error) {
    console.error("Lấy lại access token thất bại:", error);
    throw error;
  }
}

// Interceptor để kiểm tra lỗi 401 và gọi API lấy lại access token
api.interceptors.response.use(
  (response) => response, // Trả về response nếu không có lỗi
  async (error) => {
    const originalRequest = error.config;
    
    // Kiểm tra lỗi 401 và thử lấy lại token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest); // Gửi lại yêu cầu ban đầu với token mới
      } catch (refreshError) {
        // Ép kiểu refreshError thành AxiosError để kiểm tra response
        if ((refreshError as AxiosError).response?.status === 401) {
          console.warn('Phiên đăng nhập hết hạn. Yêu cầu đăng nhập lại.');
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Trả về lỗi nếu không phải là 401 hoặc không lấy lại được token
  }
);

// Cập nhật Authorization header mỗi khi gọi API
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;