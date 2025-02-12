import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import {
    Container,
    Grid,
    Box,
    Typography,



} from '@mui/material';
import MediaCard from '../components/Card';
import axios from 'axios';


const Recommended = () => {
    const { id } = useParams();
    const [book, setBooks] = useState([]);
    const [loading, setLoading] = useState(true); // เพิ่มสถานะโหลดข้อมูล

    useEffect(() => {
        // ดึงข้อมูลจาก API
        setLoading(true); // เมื่อเริ่มโหลดให้ตั้งสถานะเป็น true
        axios
            .get(`${import.meta.env.VITE_API_URL}/products/products/${id}/recommended`)
            .then((response) => {
                setBooks(response.data);
                setLoading(false); // เมื่อโหลดเสร็จให้ตั้งสถานะเป็น false
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setLoading(false); // กรณีเกิดข้อผิดพลาด
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
            <Box sx={{ mt: '100px', mb: '300px', display: 'flex', flexDirection: 'column', alignItems: 'start', maxWidth: '100%' }}>
                <Typography variant="h5" gutterBottom>
                    Recommended
                </Typography>

                <Grid container spacing={3} sx={{ mt: '32px' }}>
                    {book.map((book) => (
                        <Grid item xs={12} sm={6} md={4} key={book._id}>
                            <MediaCard product={book} />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Recommended;
