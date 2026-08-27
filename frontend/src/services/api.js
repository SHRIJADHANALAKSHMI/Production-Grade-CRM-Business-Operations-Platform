import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

api.interceptors.request.use((config) => {
    let token = localStorage.getItem("token");

    if (!token) {
        // Fallback for CRM user object
        const userInfoData = localStorage.getItem('crm_user');
        if (userInfoData && userInfoData !== "undefined") {
            try {
                const userInfo = JSON.parse(userInfoData);
                if (userInfo?.token) token = userInfo.token;
            } catch (e) {
                console.error(e);
            }
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
        console.error("Global API Error:", message);
        return Promise.reject(new Error(message));
    }
);

export default api;
