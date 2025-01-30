import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { gapi } from 'gapi-script';
import GoogleLogo from '../assets/icons/google.png';
import { Button } from '@mui/material';




const LoginComponent = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { isLoggedIn, login } = useAuth();

  // ใช้ useEffect เพื่อโหลด Google API client เมื่อ component ถูก mount
  useEffect(() => {
    const initClient = () => {
      gapi.client.init({

        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,  // ✅ ใช้ค่า env
        scope: 'profile email',
      }).then(() => {
        // ตรวจสอบว่า auth instance โหลดเสร็จสมบูรณ์
        const authInstance = gapi.auth2.getAuthInstance();
        if (authInstance.isSignedIn.get()) {
          const userData = getUserInfo(); // ถ้าผู้ใช้ล็อกอินแล้ว, ดึงข้อมูลผู้ใช้
          setUserInfo(userData);
        }
      });
    };
    gapi.load('client:auth2', initClient); // โหลด client:auth2 เมื่อ component ถูก mount
  }, []);

  // ดึงข้อมูลผู้ใช้จาก Google API
  const getUserInfo = () => {
    const user = gapi.auth2.getAuthInstance().currentUser.get();
    const profile = user.getBasicProfile();
    return {
      id: profile.getId(),
      name: profile.getName(),
      email: profile.getEmail(),
      imageUrl: profile.getImageUrl(),
    };
  };

  // ฟังก์ชันสำหรับการล็อกอิน
  const handleLogin = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(() => {
      const user = authInstance.currentUser.get();// ดึง token
      const idToken = user.getAuthResponse().id_token; // ดึง token
      console.log('ID Token in frontend:', idToken);// ดึง token


      const userData = getUserInfo();
      console.log(userData)// ดึงข้อมูลผู้ใช้
      setUserInfo(userData); // เก็บข้อมูลผู้ใช้ใน state
      // ส่งข้อมูลผู้ใช้ไปที่ server ด้วย axios
      axios.post(`${import.meta.env.VITE_API_URL}/users/googl`, userData, {
        headers: {
          Authorization: `Bearer ${idToken}`, // ส่ง token ในรูปแบบ Bearer
        },
      })
        .then((response) => {

          console.log('User data sent successfully:', response.data);
          console.log('Token Login:', response.data.token);
          login(response.data.token);  // ส่ง token และข้อมูลผู้ใช้ไปที่ login ใน AuthContext

        })
        .catch((error) => {
          console.error('Error sending user data:', error);
        });
    }).catch((error) => {
      console.error('Google Sign-In Error:', error);
    });
  };

  return (
    <div>


      <Button onClick={handleLogin}
        variant="outlined"
        sx={{ height: '52px', width: '52px', minWidth: '52px', color: 'text.primary', padding: 0 }}
      >
        <img src={GoogleLogo} alt="Facebook" style={{ height: '100%', width: '100%' }} />
      </Button>
    </div>
  );
};

export default LoginComponent;
