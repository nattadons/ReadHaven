import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Container,
    Box,
    Typography,
    TextField,
  
    Paper,
    Button,
    Snackbar,
    Alert
} from '@mui/material';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LeafMapApi from '../components/LeafMapApi';
import MyAccountAdmin from './MyAccountAdmin';

const MyAccount = () => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone_number: '',
        imageUrl: '',
        address: '',
        latitude: null,
        longitude: null
    });
    

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const token = localStorage.getItem('authToken');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(prevUser => ({
                ...prevUser,
                ...response.data
            }));
            setEditedUser(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Error fetching user data', 'error');
        }
    };
    
    console.log('image is',user.imageUrl);
    if (user?.role === 'admin') {
        return <MyAccountAdmin />;
      }
    

    const handleEdit = () => {
        setIsEditing(true);
        setEditedUser(user);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(user);
    };

    const handleChange = (field) => (event) => {
        if (field === 'email' && user.googleId) {
            return;
        }

        setEditedUser({
            ...editedUser,
            [field]: event.target.value
        });
    };

    const handleLocationUpdate = (latitude, longitude, address) => {
        setEditedUser(prev => ({
            ...prev,
            latitude,
            longitude,
            address
        }));
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleSave = async () => {
        try {
            const updates = { ...editedUser };
            if (user.googleId) {
                delete updates.email;
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/users/update`,
                updates,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setUser(response.data);
            setIsEditing(false);
            showSnackbar('Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            showSnackbar('Error updating profile', 'error');
        }
    };

    const renderAddress = () => {
        if (!isEditing) {
            return (
                <Typography variant="body2">
                    {user.address || 'No address set'}
                </Typography>
            );
        }

        return (
            <Box sx={{ width: '100%', mt: 2 }}>
                <LeafMapApi 
                    onLocationUpdate={handleLocationUpdate}
                    initialLocation={{
                        latitude: user.latitude,
                        longitude: user.longitude
                    }}
                />
            </Box>
        );
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4, mt: '100px' }}>
                <Typography
                    component="span"
                    sx={{
                        fontWeight: 'bold',
                        mr: 3
                    }}
                >
                    My Account
                </Typography>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 4,
                    mb: 8
                }}
            >
                <Box sx={{ position: 'relative' }}>
                    {!isEditing ? (
                        <Button
                            onClick={handleEdit}
                            sx={{
                                position: 'absolute',
                                right: 0,
                                top: 0,
                                backgroundColor: 'text.primary',
                            }}
                        >
                            Add information
                        </Button>
                    ) : (
                        <Box sx={{ position: 'absolute', right: 0, top: 0, display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                                startIcon={<SaveIcon />}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleCancel}
                                startIcon={<CancelIcon />}
                            >
                                Cancel
                            </Button>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Profile Image */}
                       
                        
                        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                            {user.imageUrl ? (
                                <img
                                    src={user.imageUrl}
                                    referrerPolicy="no-referrer" //สำคัญเอาเเก้บัค ภาพ
                                    
                                    alt={"../assets/images/profile_backup.jpg"}
                                    onError={(e) => (e.target.src = '../assets/images/profile_backup.jpg')}
                                    style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#ccc",
                                        color: "#fff",
                                        fontSize: "1.2rem",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {user.name?.charAt(0).toUpperCase() || "U"}
                                </Box>
                            )}
                        </Box>

                        {/* Form Fields */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>Name</Typography>
                                <TextField
                                    fullWidth
                                    value={isEditing ? editedUser.name : user.name}
                                    onChange={handleChange('name')}
                                    disabled={!isEditing}
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            bgcolor: 'action.hover',
                                            WebkitTextFillColor: 'text.primary'
                                        }
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>Phone Number</Typography>
                                <TextField
                                    fullWidth
                                    value={isEditing ? editedUser.phone_number : user.phone_number}
                                    onChange={handleChange('phone_number')}
                                    disabled={!isEditing}
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            bgcolor: 'action.hover',
                                            WebkitTextFillColor: 'text.primary'
                                        }
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ mb: 1 }}>Email</Typography>
                                <TextField
                                    fullWidth
                                    value={isEditing ? editedUser.email : user.email}
                                    onChange={handleChange('email')}
                                    disabled={!isEditing || Boolean(user.googleId)}
                                    helperText={user.googleId && "Email cannot be edited for Google accounts"}
                                    sx={{
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            bgcolor: 'action.hover',
                                            WebkitTextFillColor: 'text.primary'
                                        }
                                    }}
                                />
                            </Box>

                            <Box>
                                <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOnIcon fontSize="small" /> Address
                                </Typography>
                                {renderAddress()}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default MyAccount;