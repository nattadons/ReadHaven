import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Grid,
    Box,
    Typography,
    Button,
    Card,
    CardMedia,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import axios from 'axios';
import Recommended from '../components/Recommended';
import { useAuth } from '../context/AuthContext'; 


const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn,userId } = useAuth();

    console.log('isLoggedIn from BookDetail:', isLoggedIn);

    useEffect(() => {
        setLoading(true);
        axios.get(`${import.meta.env.VITE_API_URL}/products/products/${id}`)
            .then((response) => {
                setBook(response.data);
                console.log('Book Product:', response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching book:', error);
                setLoading(false);
            });
    }, [id]);

    const handleAction = (action) => {
        if (!isLoggedIn) {
            setOpenLoginDialog(true);
            return;
        }
        
       
        
        if (action === 'purchase') {


            const checkoutData = {
                items: [{
                    id: book.id,
                    name: book.name,
                    price: book.price,
                    quantity: 1,
                    image_product: book.image_product
                }],
                totalAmount: book.price,
                timestamp: new Date().getTime()
            };
            
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));
            navigate('/payment');
            
        } else if (action === 'cart') {
            // เพิ่มสินค้าลงใน cart
            const cartItem = {
                id: book.id,
                name: book.name,
                price: book.price,
                quantity: 1,
                image_product: book.image_product,
                description: book.detail
            };
            console.log('userId in cart:', userId); 
           
            const currentCart = JSON.parse(localStorage.getItem(`cartItems_${userId}`)) || [];
            currentCart.push(cartItem);
            localStorage.setItem(`cartItems_${userId}`, JSON.stringify(currentCart));
            
            navigate('/cart');
        }
    };
    const handleLoginRedirect = () => {
        setOpenLoginDialog(false);
        navigate('/login');
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!book) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>ไม่พบข้อมูลหนังสือ</Typography>
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
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ maxWidth: 400, maxHeight: 400 }}>
                            <CardMedia
                                component="img"
                                image={book.image_product}
                                alt={book.name}
                                sx={{ height: '400px', objectFit: 'contain' }}
                            />
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h4" component="h1" gutterBottom fontSize={"24px"}>
                            {book.name}
                        </Typography>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            by {book.author}
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 4 }}>
                            {book.detail}
                        </Typography>

                        <Grid container justifyContent="space-between" sx={{ mt: '80px' }}>
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    size="large" 
                                    onClick={() => handleAction('purchase')}
                                    sx={{
                                        backgroundColor: 'text.primary',
                                        color: 'primary.main',
                                        fontSize: {
                                            xs: '14px',
                                            sm: '16px',
                                            md: '18px',
                                        },
                                    }}
                                >
                                    ฿{book.price?.toFixed(2)}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    onClick={() => handleAction('cart')}
                                    sx={{
                                        backgroundColor: 'text.primary',
                                        color: 'primary.main',
                                        fontSize: {
                                            xs: '14px',
                                            sm: '16px',
                                            md: '18px',
                                        },
                                    }}
                                >
                                    ADD TO CART
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

                <Box sx={{
                    mt: 8,
                    padding: '16px 70px',
                    border: '1px solid',
                    borderColor: 'text.primary',
                }}>
                    <Typography variant="h5" gutterBottom>
                        Overview
                    </Typography>
                    <Typography variant="body1" paragraph>
                        &quot;{book.overview}&quot;
                    </Typography>
                </Box>

                <Recommended />

                {/* Login Dialog */}
                <Dialog
                    open={openLoginDialog}
                    onClose={() => setOpenLoginDialog(false)}
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
                    <DialogTitle>Please Login First</DialogTitle>
                    <DialogContent>
                        <Typography>
                            You need to be logged in to perform this action.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined" color='text.primary' onClick={() => setOpenLoginDialog(false)}    >Cancel</Button>
                        <Button onClick={handleLoginRedirect} variant="contained"  sx={{  backgroundColor: 'text.primary',
                                        color: 'primary.main'}}>
                            Go to Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default BookDetail;