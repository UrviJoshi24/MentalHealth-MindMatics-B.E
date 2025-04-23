import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';  // Correct import statement
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect, useCallback } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('/api/token/refresh/', {
                refresh: refreshToken,
            });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };

    const auth = useCallback(async () => {
        const token = localStorage.getItem(ACCESS_TOKEN); // Changed to get the token, not set it
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);  // Use jwtDecode here
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
        }
    }, []); // No dependencies

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, [auth]); // Adding auth here

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
