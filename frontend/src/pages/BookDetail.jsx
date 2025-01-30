import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, 
    Grid, 
    Box, 
    Typography, 
    Button,
    Card,
    CardMedia,
    CircularProgress // เพิ่ม loading indicator
} from '@mui/material';
import axios from 'axios';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    
    const [loading, setLoading] = useState(true); // เพิ่ม loading state

    useEffect(() => {
        setLoading(true);
        // เปลี่ยน URL เป็นแบบ relative path
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
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
            <Grid container spacing={4}>
                {/* รูปหนังสือ */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardMedia
                            component="img"
                            image={book.image_product}
                            alt={book.name}
                            sx={{ height: '500px', objectFit: 'contain' }}
                        />
                    </Card>
                </Grid>

                {/* รายละเอียดหนังสือ */}
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {book.name}
                    </Typography>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        by {book.author}
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                        ฿{book.price?.toFixed(2)}
                    </Typography>
                    <Button 
                        variant="contained" 
                        size="large"
                        sx={{ mt: 2 }}
                    >
                        ADD TO CART
                    </Button>
                    <Typography variant="body1" sx={{ mt: 4 }}>
                        {book.detail}
                    </Typography>
                </Grid>
            </Grid>

            {/* Overview section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" gutterBottom>
                    Overview
                </Typography>
                <Typography variant="body1" paragraph>
                    {book.overview}
                </Typography>
            </Box>

           
         
        </Container>
    );
};

export default BookDetail;