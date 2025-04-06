import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000', // Ensure this points to your Django backend
  })

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Function to fetch user details
export const fetchUserDetails = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    
    if (!token) {
        throw new Error('No token found');
    }
  
    try {
        const response = await api.get('/api/user/details/', { // Using the api instance
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error;
    }
};

export default api;