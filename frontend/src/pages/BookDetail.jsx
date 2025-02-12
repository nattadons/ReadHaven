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
import Recommended from '../components/Recommended';

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




        <Container maxWidth="lg">
            <Box
                sx={{
                    mt: '100px',
                    mb: '300px',
                    mx: '50px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'start',
                    maxWidth: '100%',
                }}
            >

                <Grid container spacing={4}>
                    {/* รูปหนังสือ */}
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

                    {/* รายละเอียดหนังสือ */}
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



                        {/* ใช้ Grid กับ spacing เพื่อจัดระยะห่างระหว่างปุ่ม */}
                        <Grid container justifyContent="space-between" sx={{ mt: '80px' }}>
                            <Grid item>
                                <Button variant="contained" size="large" sx={{
                                    backgroundColor: 'text.primary', color: 'primary.main', fontSize: {
                                        xs: '14px',
                                        sm: '16px',
                                        md: '18px',
                                    },
                                }} >
                                    ฿{book.price?.toFixed(2)}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button variant="contained" size="large" sx={{
                                    backgroundColor: 'text.primary', color: 'primary.main', fontSize: {
                                        xs: '14px',
                                        sm: '16px',
                                        md: '18px',
                                    },
                                }}>
                                    ADD TO CART
                                </Button>
                            </Grid>
                        </Grid>





                    </Grid>
                </Grid>

                {/* Overview section */}
                <Box sx={{
                    mt: 8,
                    padding: '16px 70px',// เพิ่มระยะห่างภายในกรอบ
                    border: '1px solid',
                    borderColor: 'text.primary',  // เลือกสีของกรอบที่ต้องการ
                   
                   
                             // สามารถเพิ่มเงาให้กรอบได้
                }}>
                    <Typography variant="h5" gutterBottom>
                        Overview
                    </Typography>
                    <Typography variant="body1" paragraph>
                    &quot;{book.overview}&quot;
                    </Typography>
                </Box>
                
                {/* ส่วน Recommended */}
                <Recommended ></Recommended>

            </Box>
        </Container>












    );
};

export default BookDetail;