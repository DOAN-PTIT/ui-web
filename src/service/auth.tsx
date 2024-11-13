import axios from "axios";
import { getHostName } from "@/utils/tools";


 function saveTokenWithExpiration(token:any, expiresIn = 1800) { 
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
}


function isTokenExpired() {
    const expirationTime = localStorage.getItem('tokenExpiration');
    if (!expirationTime) return true;

    const currentTime = Date.now();
    return currentTime >= parseInt(expirationTime);
}


const apiClient = axios.create({
    baseURL: getHostName(),
});

apiClient.interceptors.request.use(async (config) => {
    let accessToken = localStorage.getItem("accesToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
        if (isTokenExpired() && refreshToken) {
            try {
                const response = await axios.post(`${getHostName()}/auth/refresh-token`, {
                    token: refreshToken,
                })
                accessToken = response.data.accessToken;
                saveTokenWithExpiration(accessToken, 1800);
                config.headers.Authorization = `Bearer ${accessToken}`;
            } catch (error) {
                console.error("Lỗi khi làm mới token:", error);
            }
        } else {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;
});

export default apiClient;
