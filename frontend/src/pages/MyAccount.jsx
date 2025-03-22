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
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tabs,
    Tab

} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import LeafMapApi from '../components/LeafMapApi';
import MyAccountAdmin from './Admin/MyAccountAdmin';
import { useAuth } from '../context/AuthContext';

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

    // Validation errors
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        phone_number: ''
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();
    const [tabIndex, setTabIndex] = useState(0); // 0 สำหรับ "My Account", 1 สำหรับ "Order"

    useEffect(() => {
        if (isLoggedIn) {
            fetchUserData();
        }
    }, [isLoggedIn]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/`, {
                withCredentials: true,
            });
            setUser(prevUser => ({
                ...prevUser,
                ...response.data
            }));
            setEditedUser(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setOpenDialog(true);
                } else {
                    showSnackbar('Error fetching user data', 'error');
                }
            } else {
                showSnackbar('Network error, please try again', 'error');
            }
        }
    };

    const handleDialogClose = () => {
        logout();
        navigate('/login');
        setOpenDialog(false);
    };



    const handleEdit = () => {
        setIsEditing(true);
        setEditedUser(user);
        setErrors({
            name: '',
            email: '',
            phone_number: ''
        });
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedUser(user);
        setErrors({
            name: '',
            email: '',
            phone_number: ''
        });
    };

    // Form validation functions
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePhoneNumber = (phone) => /^[0-9]{10}$/.test(phone);
    const validateName = (name) => name.trim().length > 0;

    const validateField = (field, value) => {
        switch (field) {
            case 'name':
                return validateName(value) ? '' : 'Name is required';
            case 'email':
                return validateEmail(value) ? '' : 'Please enter a valid email address';
            case 'phone_number':
                return validatePhoneNumber(value) ? '' : 'Phone number must be 10 digits';
            default:
                return '';
        }
    };

    const handleChange = (field) => (event) => {
        if (field === 'email' && user.googleId) {
            return;
        }

        const value = event.target.value;
        setEditedUser({
            ...editedUser,
            [field]: value
        });

        // Validate the field in real time
        setErrors({
            ...errors,
            [field]: validateField(field, value)
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

    const validateForm = () => {
        const newErrors = {
            name: validateField('name', editedUser.name),
            email: user.googleId ? '' : validateField('email', editedUser.email),
            phone_number: validateField('phone_number', editedUser.phone_number),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const handleSave = async () => {
        if (!validateForm()) {
            showSnackbar('Please correct the errors before saving', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            const updates = { ...editedUser };
            if (user.googleId) {
                delete updates.email;
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/users/update`,
                updates,
                {
                    withCredentials: true,
                }
            );

            setUser(response.data);
            setIsEditing(false);
            showSnackbar('Profile updated successfully');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setOpenDialog(true);
                } else if (error.response.status === 400 && error.response.data.message) {
                    showSnackbar(error.response.data.message, 'error');
                } else {
                    showSnackbar('Error updating profile', 'error');
                }
            } else {
                showSnackbar('Network error, please try again', 'error');
            }
        } finally {
            setIsSubmitting(false);
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



    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mb: 4, mt: '100px',borderBottom: 1, borderColor: 'divider'  }}>
          

            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="my-account-tabs">
                <Tab label="My Account" />
                {user?.role === 'admin' && <Tab label="Customer Order" onClick={() => navigate('/checkorder')} />}
                {user?.role === 'user' && <Tab label="Order Tracking" onClick={() => navigate('/tracking')} />}
            </Tabs>
              
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
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleCancel}
                                startIcon={<CancelIcon />}
                                disabled={isSubmitting}
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
                                    referrerPolicy="no-referrer"
                                    alt={"Profile image"}
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
                                    error={!!errors.name && isEditing}
                                    helperText={isEditing && errors.name}
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
                                    type="tel"
                                    error={!!errors.phone_number && isEditing}
                                    helperText={isEditing && errors.phone_number}
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
                                    type="email"
                                    disabled={!isEditing || Boolean(user.googleId)}
                                    error={!!errors.email && isEditing && !user.googleId}
                                    helperText={(isEditing && !user.googleId && errors.email) ||
                                        (user.googleId && "Email cannot be edited for Google accounts")}
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

            {/* แสดง UI สำหรับ Admin ถ้าเป็นผู้ใช้ Admin */}
            {user?.role === 'admin' && (
                <MyAccountAdmin />
            )}

            {/* Snackbar section */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Dialog section */}
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '400px',
                        p: 2,
                        textAlign: 'center',
                    }
                }}
            >
                <DialogTitle>Session Expired</DialogTitle>
                <DialogContent>
                    <Typography>You have been logged out due to inactivity. Please log in again.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} variant="contained" sx={{ backgroundColor: 'text.primary', color: 'primary.main' }}>
                        Log In Again
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MyAccount;