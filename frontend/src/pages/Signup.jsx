import { useState } from "react";
import {
  Box,
  Container,
  Button,
  Typography,
  TextField,
  FormControl,
  InputAdornment,
  OutlinedInput,
  IconButton,
  InputLabel,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ป้องกันการกดซ้ำ
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
  const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone); // ตรวจสอบเบอร์ 10 หลัก
  const validatePassword = (password) => password.length >= 8;

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("กรุณาใส่อีเมลให้ถูกต้อง");
      return;
    }

    if (!validatePhoneNumber(phonenumber)) {
      alert("เบอร์โทรศัพท์ต้องมี 10 หลัก");
      return;
    }

    if (!validatePassword(password)) {
      alert("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true); // ปิดปุ่มป้องกันกดซ้ำ
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
        name,
        email,
        phone_number: phonenumber,
        password,
      });
      console.log(response.data);
      alert("สมัครสมาชิกสำเร็จ!");
      setName("");
      setEmail("");
      setPhonenumber("");
      setPassword("");
      setConfirmPassword("");

      navigate("/login");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "สมัครสมาชิกไม่สำเร็จ!";
      alert(errorMessage);
    } finally {
      setLoading(false); // เปิดปุ่มอีกครั้ง
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: "100px", mb: "300px", mx: "50px", display: "flex", flexDirection: "column", alignItems: "center", maxWidth: "100%" }}>
        <Typography component="h1" variant="h5" fontWeight={"bold"}>
          Create Account
        </Typography>
        <Box component="form" onSubmit={handleSignup} sx={{ mt: "32px", width: "100%" }}>
          <TextField
            fullWidth
            sx={{ mt: "16px" }}
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            sx={{ mt: "32px" }}
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            sx={{ mt: "32px" }}
            label="Phone Number"
            type="tel"
            value={phonenumber}
            onChange={(e) => setPhonenumber(e.target.value)}
            required
          />
          <FormControl fullWidth variant="outlined" sx={{ mt: "32px" }}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ mt: "32px" }}>
            <InputLabel>Confirm Password</InputLabel>
            <OutlinedInput
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowConfirmPassword}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading} // ปิดปุ่มระหว่างโหลด
            sx={{
              mt: "32px",
              backgroundColor: "text.primary",
              color: "primary.main",
              height: "56px",
              fontSize: "16px",
            }}
          >
            {loading ? "กำลังสมัคร..." : "Create Account"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
