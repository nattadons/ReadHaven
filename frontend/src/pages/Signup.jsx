import { useState } from 'react';
import { Box, Container, Button, Typography, TextField, FormControl, InputAdornment, OutlinedInput, IconButton, InputLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 
    
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Password และ Confirm Password ไม่ตรงกัน');
            return;
        }

        try {
            
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/signup`, {
                name,
                email,
                phone_number: phonenumber,
                password,
            });

            console.log(response.data.message);
            alert('Signup successful!');
           

            setName('');
            setEmail('');
            setPhonenumber('');
            setPassword('');
            setConfirmPassword('');

            navigate('/login');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Signup failed!';
            console.error(errorMessage);
            alert(errorMessage);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: "100px", mb: "300px", mx: "50px", display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: "100%" }}>
                <Typography component="h1" variant="h5" fontWeight={"bold"}>
                    Create Account
                </Typography>
                <Box component="form" onSubmit={handleSignup} sx={{ mt: '32px', width: '100%' }}>
                    <TextField
                        fullWidth
                        sx={{ mt: '16px' }}
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        sx={{ mt: '32px' }}
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        sx={{ mt: '32px' }}
                        label="Phone Number"
                        value={phonenumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        required
                    />
                    <FormControl fullWidth variant="outlined" sx={{ mt: '32px' }}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowPassword}
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                    <FormControl fullWidth variant="outlined" sx={{ mt: '32px' }}>
                        <InputLabel>Confirm Password</InputLabel>
                        <OutlinedInput
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleClickShowConfirmPassword}
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Confirm Password"
                        />
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: '32px', backgroundColor: 'text.primary', color: 'primary.main', height: '56px', fontSize: '16px' }}
                    >
                        Create Account
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Signup;
