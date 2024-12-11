import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
const baseURL = API_BASE_URL;

// Hàm kiểm tra xem access token có hết hạn không
export function isTokenExpired(token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Chuyển đổi sang milliseconds
    return Date.now() >= expirationTime;
}

// Hàm làm mới access token
export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
        const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
            refresh: refreshToken,
        });
        const { access } = response.data;
        localStorage.setItem('accessToken', access); // Lưu access token mới
        return access;
    } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error; // Xử lý lỗi nếu cần
    }
}

// Hàm gọi API với kiểm tra token
export async function apiRequest(endpoint, method = 'GET', data = null) {
    let accessToken = localStorage.getItem('accessToken');

    // Kiểm tra xem access token có hết hạn không
    if (accessToken && isTokenExpired(accessToken)) {
        accessToken = await refreshAccessToken(); // Làm mới token
    }

    const config = {
        method,
        url: endpoint,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    };

    if (method.toUpperCase() === 'POST' && data) {
        config.data = data;
    }
    if (method.toUpperCase() === 'DELETE' && data) {
        config.data = data;
    }
    if (method.toUpperCase() === 'PATCH' && data) {
        config.data = data;
    }

    // Gửi yêu cầu API
    const response = await axios(config);
    return response;
}