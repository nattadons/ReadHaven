import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from './../components/CheckoutForm.jsx';
const stripePromise = loadStripe(import.meta.env.VITE_PK_LIVE);


const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState(null);
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('online_payment');
    const { isLoggedIn, logout } = useAuth();
    const [openDialog, setOpenDialog] = useState(false); // สถานะเปิด/ปิด dialog
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [clientSecret, setClientSecret] = useState("");
    const [showCheckoutForm, setShowCheckoutForm] = useState(false);





    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // รอให้ token พร้อมก่อน
                if (isLoggedIn) {
                    // ดึงข้อมูลผู้ใช้
                    const userResponse = await axios.get(
                        `${import.meta.env.VITE_API_URL}/users/`,
                        {
                            withCredentials: true,
                        }
                    );
                    setUserData(userResponse.data);

                    // ดึงข้อมูล checkout
                    let orderData = location.state;
                    if (!orderData) {
                        const savedData = sessionStorage.getItem('checkoutData');
                        if (!savedData) {
                            throw new Error('No checkout data found');
                        }
                        orderData = JSON.parse(savedData);
                    }

                    // ตรวจสอบความเก่าของข้อมูล
                    const isDataExpired = (orderData.timestamp + 3600000) < new Date().getTime();
                    if (isDataExpired) {
                        throw new Error('Checkout session expired');
                    }

                    setCheckoutData(orderData);
                }
            } catch (err) {

                if (err.response) {
                    // เช็ค status code
                    if (err.response.status === 401) {

                        setOpenDialog(true);


                    } else {
                        showSnackbar('Something went wrong, please try again', err);
                        navigate('/cart');
                    }
                } else {
                    showSnackbar('Network error, please try again', 'error');
                    navigate('/cart');
                }





            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isLoggedIn, navigate, location.state]);


    const handleDialogClose = () => {
        logout();
        navigate('/login'); // นำทางไปหน้า login
        setOpenDialog(false); // ปิด dialog
    };


    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handlePaymentChange = (event) => {
        const selectedMethod = event.target.value;
        setPaymentMethod(selectedMethod);

        // Hide checkout form when switching payment methods
        setShowCheckoutForm(false);
        // If we have a client secret already but switched to cash, clear it
        if (selectedMethod === 'cash' && clientSecret) {
            setClientSecret("");
        }
    };

    // แก้ไขฟังก์ชัน handleCheckout ในไฟล์ Payment.jsx
    const handleCheckout = async () => {
        if (paymentMethod === 'cash') {
            try {
                // สร้างข้อมูล order สำหรับ cash on delivery
                console.log("Checkout Data Items:", checkoutData.items);
                const orderPayload = {
                    items: checkoutData.items.map(item => ({
                        product: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    payment_method: "cash",
                    shipping_address: userData?.address || "Address not provided"
                };
                console.log("Order Payload:", orderPayload);

                // ส่งข้อมูลไปสร้าง order
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/orders`,
                    orderPayload,
                    { withCredentials: true }
                );

                showSnackbar('Your order has been placed successfully with Cash on Delivery option.', 'success');
                // นำทางไปยังหน้า complete
                navigate('/complete', {
                    state: {
                        orderData: response.data,
                        paymentMethod: 'cash'
                    }
                });
            } catch (error) {
                console.error("Error creating cash order:", error);
                showSnackbar('Failed to place your order. Please try again.', 'error');
            }
            return;
        }

        // ส่วนของ online payment ยังคงเหมือนเดิม
        try {
            console.log("Checkout Data Items:", checkoutData.items);
            const orderPayload = {
                items: checkoutData.items.map(item => ({
                    product: item.productId,
                    quantity: item.quantity,
                    price: item.price
                })),
                payment_method: "online_payment",
                shipping_address: userData?.address || "Address not provided"
            };
            console.log("orderpayload:", orderPayload);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/pay`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderPayload),
            });


            if (!response.ok) {
                throw new Error('Payment initialization failed');
            }

            const data = await response.json();
            console.log('data')
            setClientSecret(data.clientSecret);
            setShowCheckoutForm(true);
        } catch (error) {
            showSnackbar('Failed to initialize payment: ' + error.message, 'error');
        }
    };

    const handleMyAccount = () => {
        navigate('/myaccount');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color='text.primary' size="4rem" />
            </Box>
        );
    }
    // ถ้ายังไม่มี token ให้แสดง loading
    if (!isLoggedIn) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color='text.primary' size="4rem" />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{
                mt: '100px',
                mb: '300px',
                mx: '50px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                maxWidth: '100%',
            }}>


                {/* Address Section */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper elevation={0} sx={{
                            p: 3,
                            mb: 4,
                            border: '1px solid',
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon sx={{ mr: 1 }} />
                                    <Typography variant="h6">Address</Typography>
                                </Box>
                                <Button
                                    onClick={handleMyAccount}
                                    sx={{
                                        backgroundColor: 'text.primary',
                                        color: 'primary.main',
                                        mb: 2,
                                    }}
                                >
                                    Add Address
                                </Button>
                            </Box>

                            <Grid container spacing={2} direction={{ xs: "column", sm: "row" }}>
                                <Grid item xs={4}>
                                    <Typography variant="body1">
                                        {userData?.name || 'Name not found'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    {userData?.address ? (
                                        <Typography variant="body1">{userData.address}</Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Address not found
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            <Typography variant="body2" color="text.secondary">
                                {userData?.phone_number || 'Tel not found'}
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Products Section */}
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Products</Typography>

                        <Paper elevation={0} sx={{ border: '1px solid' }}>
                            {/* แสดงรายการสินค้า */}
                            {checkoutData?.items.map((item, index) => (
                                <Box key={index} sx={{ p: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle1" fontWeight="bold">Order</Typography>
                                            <Typography variant="body1" sx={{ mt: 2 }}>
                                                {item.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ textAlign: { sm: 'center' } }}>
                                            <Typography variant="subtitle1" fontWeight="bold">Quantity</Typography>
                                            <Typography variant="body1" sx={{ mt: 2 }}>
                                                {item.quantity}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={3} sx={{ textAlign: { sm: 'right' } }}>
                                            <Typography variant="subtitle1" fontWeight="bold">Price</Typography>
                                            <Typography variant="body1" sx={{ mt: 2 }}>
                                                ฿{(item.price * item.quantity).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {index < checkoutData.items.length - 1 && <Divider sx={{ mt: 3 }} />}
                                </Box>
                            ))}

                            <Divider />

                            {/* Payment Method Section */}
                            <Box sx={{ p: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                    Payment method
                                </Typography>

                                <FormControl component="fieldset">
                                    <RadioGroup
                                        value={paymentMethod}
                                        onChange={handlePaymentChange}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            gap: 2
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                border: paymentMethod === 'online_payment' ? '2px solid #000000' : '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                p: 1,
                                            }}
                                        >
                                            <FormControlLabel
                                                value="online_payment"
                                                control={<Radio />}
                                                label="Online Payment"
                                            />
                                        </Paper>

                                        <Paper
                                            elevation={0}
                                            sx={{
                                                border: paymentMethod === 'cash' ? '2px solid #000000' : '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                p: 1,
                                            }}
                                        >
                                            <FormControlLabel
                                                value="cash"
                                                control={<Radio />}
                                                label="Cash on delivery"
                                            />
                                        </Paper>
                                    </RadioGroup>
                                </FormControl>
                            </Box>

                            <Divider />

                            {/* Total and Checkout Section */}
                            <Box
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 2, sm: 0 }
                                }}
                            >
                                <Box sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>
                                    <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                                </Box>

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: { xs: 'space-between', sm: 'flex-end' },
                                        width: { xs: '100%', sm: 'auto' },
                                        gap: { sm: 3 }
                                    }}
                                >
                                    <Typography variant="h6" fontWeight="bold" sx={{ alignSelf: 'center' }}>
                                        ฿{checkoutData?.totalAmount.toFixed(2)}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={handleCheckout}
                                        sx={{
                                            width: { xs: '50%', sm: 'auto' },
                                            minWidth: { sm: '150px' },
                                            backgroundColor: 'text.primary',
                                            color: 'primary.main',
                                        }}
                                    >
                                        Check Out
                                    </Button>
                                </Box>
                            </Box>

                            {/* Stripe Checkout Form - only shows after clicking checkout with online_payment selected */}
                            {showCheckoutForm && paymentMethod === 'online_payment' && clientSecret && (
                                <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                                        Complete your payment
                                    </Typography>
                                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                                        <CheckoutForm />
                                    </Elements>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>


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
                open={openDialog} onClose={handleDialogClose}
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
                    <Button onClick={handleDialogClose} variant="contained" sx={{
                        backgroundColor: 'text.primary',
                        color: 'primary.main'
                    }}>
                        Log In Again
                    </Button>

                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Payment;