import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    IconButton,
    Paper,
    CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const { isLoggedIn } = useAuth();



    useEffect(() => {
        if (isLoggedIn) {
            fetchCartItems();
        }
    }, [isLoggedIn]);

    // ฟังก์ชันดึงข้อมูลตะกร้า
    const fetchCartItems = async () => {
        try {
            setLoading(true);
            
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/cart`,
                { withCredentials: true }
            );
            setCartItems(response.data);
            calculateTotal(response.data);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        } finally {
            setLoading(false);
          
        }
    };

    



    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(sum);
    };

    // อัพเดทจำนวนสินค้า
    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
    
        try {
            await axios.put(
                `${import.meta.env.VITE_API_URL}/cart/update`,
                { productId, quantity: newQuantity },
                { withCredentials: true }
            );
    
            // ✅ อัปเดต state โดยตรง
            setCartItems((prevCartItems) => {
                const updatedCart = prevCartItems.map(item =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                );
                calculateTotal(updatedCart);
                return updatedCart;
            });


            
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };
    
    

    // ลบสินค้า
    const removeItem = async (productId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/cart/${productId}`,
                { withCredentials: true }
            );
    
            // ✅ อัปเดต state โดยตรง
            setCartItems((prevCartItems) => {
                const updatedCart = prevCartItems.filter(item => item.productId !== productId);
                calculateTotal(updatedCart);
                return updatedCart;
            });


            
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };
    

    

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            const checkoutData = {
                items: cartItems,
                totalAmount: total,
                timestamp: new Date().getTime()
            };

            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

            navigate('/payment', {
                state: checkoutData,
                replace: true
            });
        }
    };

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <CircularProgress color='text.primary'size="4rem" />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{
                mt: '100px',
                mb: '300px',
                mx: '50px',
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Your Cart
                </Typography>

                {cartItems.length === 0 ? (
                    <Typography variant="body1" sx={{ mt: 4 }}>
                        Your cart is empty
                    </Typography>
                ) : (
                    <>
                        {cartItems.map((item) => (
                            <Paper
                                key={item.productId}
                                elevation={0}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    border: '1px solid',
                                    borderColor: 'divider'
                                }}
                            >
                                <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={12} sm={2}>
                                        <img
                                            src={item.image_product}
                                            alt={item.name}
                                            style={{
                                                width: '100%',
                                                maxWidth: '100px',
                                                height: 'auto'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.description}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <IconButton
                                                sx={{ color: 'text.primary' }}
                                                size="small"
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                            <IconButton
                                                sx={{ color: 'text.primary' }}
                                                size="small"
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Typography>฿{(item.price * item.quantity).toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <IconButton onClick={() => removeItem(item.productId)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}

                        <Paper elevation={0} sx={{ p: 3, mt: 4, border: '1px solid', borderColor: 'divider' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6" gutterBottom>
                                        Order Summary
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography>Total</Typography>
                                        <Typography variant="h6">฿{total.toFixed(2)}</Typography>
                                    </Box>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        onClick={handleCheckout}
                                        sx={{
                                            backgroundColor: 'text.primary',
                                            color: 'primary.main',
                                        }}
                                    >
                                        Check Out
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </>
                )}
            </Box>
        </Container>
    );
};

export default Cart;