import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use(
    (config) => {
        // AuthContext uses 'crm_user' local key
        const userInfoData = localStorage.getItem('crm_user');
        if (userInfoData && userInfoData !== "undefined") {
            try {
                const userInfo = JSON.parse(userInfoData);
                if (userInfo?.token) {
                    config.headers.Authorization = `Bearer ${userInfo.token}`;
                }
            } catch (e) {
                console.error("Failed to parse crm_user in API request", e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        console.error("Global API Error:", message);
        return Promise.reject(new Error(message));
    }
);

export default api;
