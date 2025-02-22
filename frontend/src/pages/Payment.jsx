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
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userData, setUserData] = useState(null);
    const [checkoutData, setCheckoutData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('promptpay');
    const { isLoggedIn,token } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // รอให้ token พร้อมก่อน
                if (token && isLoggedIn) {
                    // ดึงข้อมูลผู้ใช้
                    const userResponse = await axios.get(
                        `${import.meta.env.VITE_API_URL}/users/`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
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
                console.error('Error:', err);
                setError(err.message || 'มีข้อผิดพลาดในการดึงข้อมูล');
                // จะ redirect ไป cart เมื่อเกิด error เท่านั้น
                if (err.message !== 'No checkout data found') {
                    navigate('/cart');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, navigate, location.state]);

    const handlePaymentChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleCheckout = async () => {
        try {
           
            if (!token) {
                navigate('/login');
                return;
            }

            const orderData = {
                items: checkoutData.items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount: checkoutData.totalAmount,
                paymentMethod: paymentMethod,
                userId: userData._id,
                shippingAddress: userData.address || '',
                phoneNumber: userData.phone_number || ''
            };

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/orders`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            // ลบข้อมูลทั้งหมดหลังจากสั่งซื้อสำเร็จ
            sessionStorage.removeItem('checkoutData');
            localStorage.removeItem('cartItems');

            navigate('/order-success', {
                state: {
                    orderId: response.data._id,
                    totalAmount: orderData.totalAmount
                }
            });

        } catch (err) {
            setError(err.response?.data?.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
        }
    };

    const handleMyAccount = () => {
        navigate('/myaccount');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
     // ถ้ายังไม่มี token ให้แสดง loading
     if (!token) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
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
                {error && (
                    <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                        {error}
                    </Alert>
                )}

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
                                        {userData?.name || 'ไม่พบชื่อ'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={8}>
                                    {userData?.address ? (
                                        <Typography variant="body1">{userData.address}</Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            ไม่พบข้อมูลที่อยู่
                                        </Typography>
                                    )}
                                </Grid>
                            </Grid>

                            <Typography variant="body2" color="text.secondary">
                                {userData?.phone_number || 'ไม่พบเบอร์โทร'}
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
                                                border: paymentMethod === 'promptpay' ? '2px solid #000000' : '1px solid #e0e0e0',
                                                borderRadius: 1,
                                                p: 1,
                                            }}
                                        >
                                            <FormControlLabel
                                                value="promptpay"
                                                control={<Radio />}
                                                label="QR Promptpay"
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
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Payment;