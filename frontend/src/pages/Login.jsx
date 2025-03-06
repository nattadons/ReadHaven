import { useState, } from 'react';
import { Box, Container, Button, Typography, Grid, Link, IconButton, InputAdornment, FormControl, InputLabel, OutlinedInput, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import FacebookLogo from '../assets/icons/facebook.png';

import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useAuth } from '../context/AuthContext';


import LoginComponent from '../components/GoogleLogin';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();




    const navigate = useNavigate();










    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please fill out both fields.");
            return;
        }

        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, { email, password }, { withCredentials: true });
            console.log('response data', data)
            login(); // ใช้ token จาก API
            alert("Login successful!");


        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed!';
            console.error(errorMessage);
            alert(errorMessage);

        }
    };

    const handleCreateAccount = () => {
        navigate('/signup');
    };








    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };




    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: "100px", mb: "300px", mx: "50px", display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: "100%" }}>
                <Typography component="h1" variant="h5" fontWeight={"bold"}>
                    Log in
                </Typography>
                <Box component="form" sx={{ mt: '32px', width: '100%' }}>
                    <TextField
                        label="Email Address"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        sx={{ mt: '16px' }}
                    />

                    <FormControl fullWidth variant="outlined" sx={{ mt: '32px' }}>
                        <InputLabel htmlFor="password" >Password</InputLabel>
                        <OutlinedInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                            required
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                        tabIndex={0}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <Button
                        onClick={handleLogin}
                        fullWidth
                        variant="contained"
                        sx={{ mt: '32px', mb: 2, backgroundColor: 'text.primary', color: 'primary.main', height: '56px', fontSize: '16px' }}
                    >
                        Login
                    </Button>
                </Box>
                <Link
                    component="button"
                    onClick={handleCreateAccount}
                    color="text.primary"
                    sx={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        display: 'block',
                        mb: 4,
                        mt: 4,
                        position: 'relative',
                        fontSize: '16px',
                        fontWeight: 600,
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            bottom: -2,
                            width: '100%',
                            height: '2px',
                            backgroundColor: 'currentColor',
                        },
                    }}
                >
                    Create Account
                </Link>
                <Typography variant="body2" sx={{ mb: 3, fontSize: '16px', fontWeight: 600, color: 'text.secondary' }}>
                    Or Login with your social media
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item>


                        <LoginComponent>
                        </LoginComponent>



                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            sx={{ height: '52px', width: '52px', minWidth: '52px', color: 'text.primary', padding: 0 }}
                        >
                            <img src={FacebookLogo} alt="Facebook" style={{ height: '100%', width: '100%' }} />
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Login;
