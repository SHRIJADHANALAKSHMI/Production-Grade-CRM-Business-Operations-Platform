import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api.js';
import { io } from "socket.io-client";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.get('/auth/me')
                .then((res) => {
                    const userData = res.data.data;
                    setUser(userData);
                    initSocket(userData);
                    fetchNotifications();
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const initSocket = (userData) => {
        const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000");
        newSocket.emit("join", userData.id || userData._id);

        newSocket.on("new_notification", (notif) => {
            setNotifications(prev => [notif, ...prev]);
        });

        setSocket(newSocket);
    };

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.data);
        } catch (e) {
            console.error("Failed to fetch notifications", e);
        }
    };

    const markNotificationRead = async (id) => {
        try {
            const res = await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? res.data.data : n));
        } catch (e) { console.error(e); }
    };

    const login = (userData, token) => {
        setUser(userData);
        if (token) localStorage.setItem('token', token);
        initSocket(userData);
        fetchNotifications();
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setNotifications([]);
        if (socket) socket.disconnect();
    };

    return (
        <AuthContext.Provider value={{
            user, loading, login, logout,
            socket, notifications, markNotificationRead
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
