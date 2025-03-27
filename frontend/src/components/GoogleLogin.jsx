import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import GoogleLogo from '../assets/icons/google.png';
import { Button } from '@mui/material';

const GoogleLogin = () => {
  const { login } = useAuth();

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        console.log('มีโทเคนไหมจ้ะ', response);
        const accessToken = response.access_token; // ใช้ access token แทน idToken
        if (!accessToken) throw new Error("No Access Token received");
  
        // ดึงข้อมูลผู้ใช้จาก Google ด้วย access token
        const userData = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        console.log('User data from Google:', userData.data);
  
        // ส่งข้อมูลไปยัง backend หรือดำเนินการอื่นๆ
        const serverResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/google`,
          {}, // Body ไม่ต้องใส่อะไร เพราะส่ง token ผ่าน Header
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // ส่ง Access Token ในรูปแบบ Bearer
            },
            withCredentials: true, // ใช้ cookie-based auth
          }
        );
  
        console.log('User data sent successfully:', serverResponse.data);
        login(); // ล็อกอินผ่าน context
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    onError: (error) => console.error('Google Login Error:', error),
    useOneTap: false, // ใช้การล็อกอินแบบปกติ
  });
  

  return (
    <Button onClick={() => googleLogin()} variant="outlined" sx={{ height: '52px', width: '52px', minWidth: '52px', color: 'text.primary', padding: 0 }}>
      <img src={GoogleLogo} alt="Google" style={{ height: '100%', width: '100%' }} />
    </Button>
  );
};

export default GoogleLogin;
