import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Replace with your machine's IP address if running on device
    const API_URL = 'http://192.168.143.11:8000/auth';

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password });
            setUser(response.data.result);
            setToken(response.data.token);
            setIsLoading(false);
            return { success: true };
        } catch (error) {
            setIsLoading(false);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (email, password) => {
        setIsLoading(true);
        try {
            await axios.post(`${API_URL}/register`, { email, password });
            setIsLoading(false);
            return { success: true };
        } catch (error) {
            setIsLoading(false);
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
