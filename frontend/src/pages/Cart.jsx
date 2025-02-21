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
 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';


const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState(null); // เก็บ userId ไว้ใน state

    useEffect(() => {
        // สมมติว่าเก็บ cart items ใน localStorage
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId'); // ต้องมี userId ของผู้ใช้ปัจจุบัน

        if (!token || !userId) {
            navigate('/login');
            return;
        }
        setUserId(userId);
        const items = JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
        setCartItems(items);
        calculateTotal(items);
    }, []);

    const calculateTotal = (items) => {
        const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setTotal(sum);
    };

    const updateQuantity = (index, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedItems = [...cartItems];
        updatedItems[index].quantity = newQuantity;
        setCartItems(updatedItems);
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
    };

    const removeItem = (index) => {
        const updatedItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedItems);
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(updatedItems));
        calculateTotal(updatedItems);
    };

    const handleCheckout = () => {
        if (cartItems.length > 0) {
            const checkoutData = {
                items: cartItems,
                totalAmount: total,
                timestamp: new Date().getTime()
            };
            
            // เก็บข้อมูลใน sessionStorage
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            
            // ส่ง state ผ่าน navigation ด้วย
            navigate('/payment', { 
                state: checkoutData,
                replace: true // ป้องกันการกด back
            });
        }
    };

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
                        {cartItems.map((item, index) => (
                            <Paper
                                key={index}
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
                                                sx={{color: 'text.primary',}}
                                                size="small"
                                                onClick={() => updateQuantity(index, item.quantity - 1)}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                            <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                            <IconButton
                                                sx={{color: 'text.primary', }}
                                                size="small"
                                                onClick={() => updateQuantity(index, item.quantity + 1)}
                                            >
                                                <AddIcon  />
                                
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Typography>฿{(item.price * item.quantity).toFixed(2)}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <IconButton onClick={() => removeItem(index)}>
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