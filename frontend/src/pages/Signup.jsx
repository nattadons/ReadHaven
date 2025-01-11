import { useState } from 'react';
import { Box, Container, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import LabeledTextField from '../components/LabeledTextField';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';




const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhonenumber] = useState('');

    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);


    const handleClickShowPassword = () => setShowPassword((show) => !show);


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSignup = (e) => {
        e.preventDefault();
        // Handle signup logic here
        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Phonenumber:', phonenumber);
        console.log('Password:', password);

    };




    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: "100px", mb: "300px", mx: "50px", display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: "100%" }}>
                <Typography component="h1" variant="h5" fontWeight={"bold"}>
                    Create Account
                </Typography>
                <Box component="form" onSubmit={handleSignup} sx={{ mt: '32px', width: '100%' }}>
                    <LabeledTextField
                        label="Name"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        autoFocus
                        required
                    />
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
                        label="Phone Number"
                        id="phonenumber"
                        name="phonenumber"
                        value={phonenumber}
                        onChange={(e) => setPhonenumber(e.target.value)}
                        autoComplete="phonenumber"
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
                        Create Account
                    </Button>

                </Box>
            </Box>
        </Container>
    );
};

export default Signup;