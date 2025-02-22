import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);

    // 🔹 ดึงค่าจาก localStorage เมื่อ component โหลด
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
        const storedUserId = localStorage.getItem('userId');
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(loggedInStatus);
            setUserId(storedUserId);
        }
    }, []);

    // 🔹 อัปเดต localStorage ทุกครั้งที่ state เปลี่ยน
    useEffect(() => {
        localStorage.setItem('isLoggedIn', isLoggedIn);
        localStorage.setItem('userId', userId || '');
        localStorage.setItem('authToken', token || '');
    }, [isLoggedIn, userId, token]); // อัปเดตทุกครั้งที่ค่าเปลี่ยน

    // 🔹 ฟังก์ชันล็อกอิน
    const login = (token, userId) => {
        setUserId(userId);
        setIsLoggedIn(true);
        setToken(token);
    };

    // 🔹 ฟังก์ชันล็อกเอาต์
    const logout = () => {
        setUserId(null);
        setIsLoggedIn(false);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
