import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Axios instance
export const api = axios.create({
    baseURL: 'https://localhost:7084/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach JWT token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // 1. Standard Login (Admins, Students)
    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, refreshToken, user: userData } = response.data;

            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token', token);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            return userData;
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Login failed";
            throw new Error(message);
        }
    };

    // 2. 👇 Custom Login for Teachers (Employee ID) 👇
    const loginWithToken = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginWithToken, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};