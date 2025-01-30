import { useState, useEffect } from 'react';
import axios from 'axios';

const MyAccount = () => {
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('authToken'); // ดึง token จาก localStorage
    console.log('Token in MyAccount:', token);

    useEffect(() => {
        // ส่ง token ไปใน header เพื่อขอข้อมูล
        axios
            .get(`${import.meta.env.VITE_API_URL}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // ส่ง token ใน header
                },
            })
            .then((response) => {
                setUser(response.data); // ตั้งค่า state เมื่อได้รับข้อมูล
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [token]);

    return (
        <div>
            {user ? (
                <>
                    <h2>My Account</h2>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <img src={user.imageUrl} />
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MyAccount;
