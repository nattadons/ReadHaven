import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        // 🔹 โหลดค่าจาก localStorage เมื่อหน้าโหลด
        
        const loggedInStatus = JSON.parse(localStorage.getItem('isLoggedIn') || 'false');
      
        if (loggedInStatus) {
           
            
            setIsLoggedIn(loggedInStatus);
        }
      
       
       
    }, []);
    
   
     // 🔹 อัปเดต localStorage ทุกครั้งที่ state เปลี่ยน
     useEffect(() => {
        if (isLoggedIn) {
            
            localStorage.setItem('isLoggedIn', isLoggedIn);
        } else {
            localStorage.removeItem('isLoggedIn');
           
        }
       
    }, [isLoggedIn]); // อัปเดตทุกครั้งที่ค่าเปลี่ยน

    

    const login = () => {
        
      
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
        
        navigate('/book');
     
    };

    const logout = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/logout`, {
                withCredentials: true,
            });
            
            if (response.status === 200) {
                // ล้าง state และ localStorage หลังจาก API call สำเร็จ
              
                setIsLoggedIn(false);
                localStorage.removeItem('isLoggedIn');
         
                return true; // ส่งค่ากลับเพื่อให้รู้ว่า logout สำเร็จ
            }
            return false;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
