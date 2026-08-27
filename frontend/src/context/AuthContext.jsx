import { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('crm_user');
        if (storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Corrupted local storage data. Clearing crm_user session.", error);
                localStorage.removeItem('crm_user');
            }
        }
    }, []);

    const login = (userData) => {
        if (!userData) return;
        setUser(userData);
        localStorage.setItem('crm_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('crm_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
