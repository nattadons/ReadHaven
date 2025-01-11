import { useState } from 'react';
import { Box, Container, Button, Typography, Grid, Link, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// Import your custom logos
import GoogleLogo from '../assets/icons/google.png';
import FacebookLogo from '../assets/icons/facebook.png';
import LabeledTextField from '../components/LabeledTextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate


    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email:', email);
        console.log('Password:', password);
    };

    const handleCreateAccount = () => {
        navigate('/signup'); // Navigate to the signup page
    };


    const [showPassword, setShowPassword] = useState(false);


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
                <Box component="form" onSubmit={handleLogin} sx={{mt: '32px' ,width:'100%'}}>
                    <LabeledTextField
                        label="Email Address"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />
                    <LabeledTextField
                        label="Password"
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, backgroundColor: 'text.primary', color: 'primary.main', height: '56px', fontSize: '16px' }}
                    >
                        Login
                    </Button>
                </Box>
                <Link
                    href=""
                    onClick={handleCreateAccount} // Add onClick handler
                    color="text.primary"
                    sx={{
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
                            bottom: -2, // Adjust this value to move the underline closer or further from the text
                            width: '100%',
                            height: '2px', // Adjust this value to change the thickness of the underline
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
                        <Button
                            variant="outlined"
                            sx={{ height: '52px', width: '52px', minWidth: '52px', color: 'text.primary', padding: 0 }}
                        >
                            <img src={GoogleLogo} alt="Google" style={{ height: '100%', width: '100%' }} />
                        </Button>
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