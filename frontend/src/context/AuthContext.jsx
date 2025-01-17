import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // นำเข้า PropTypes

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // ตรวจสอบสถานะการล็อกอินจาก localStorage
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true'; // คืนค่าจาก localStorage
        setIsLoggedIn(loggedInStatus);
    }, []);

    const login = () => {
        localStorage.setItem('isLoggedIn', 'true'); // บันทึกสถานะการล็อกอิน
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('isLoggedIn'); // ลบสถานะการล็อกอิน
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// เพิ่ม PropTypes สำหรับการตรวจสอบ
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // ตรวจสอบว่า children เป็นชนิด node และเป็นค่าที่จำเป็น
};

export const useAuth = () => useContext(AuthContext);
