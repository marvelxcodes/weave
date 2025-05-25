import Axios from 'axios'

const api = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Request interceptor to add auth token if available
api.interceptors.request.use(
    (config) => {
        // Add auth token from localStorage or session if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized access
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth_token');
                window.location.href = '/auth/signin';
            }
        }
        return Promise.reject(error);
    }
);

export default api;