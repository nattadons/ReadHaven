import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, Box, Container, CircularProgress, Grid, Card, CardContent, Typography, Button, } from '@mui/material';
import { useNavigate } from 'react-router-dom';


export default function TrackingOders() {
    const navigate = useNavigate();

    const [tabIndex, setTabIndex] = useState(1);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);



    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };

    // ดึงข้อมูลคำสั่งซื้อจาก API
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/orders/get`,
                    { withCredentials: true }
                );

                const filteredOrders = response.data.orders.filter(order => order.status !== 'received Order' && order.status !== 'canceled');
                setOrders(filteredOrders);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);


    // ดึงข้อมูลผลิตภัณฑ์เพิ่มเติมจาก API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productIds = orders.flatMap(order => order.items.map(item => item.product));
                if (productIds.length > 0) {
                    const response = await axios.get(`${import.meta.env.VITE_API_URL}/products/orders`, {
                        params: { ids: productIds },
                        withCredentials: true
                    });
                  
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [orders]);


    const handleStatusOrder = async (orderId, status) => {
        // ดึงข้อมูลคำสั่งซื้อตาม orderId (จาก state หรือ API)
        const order = orders.find(order => order._id === orderId);

        if (!order) {
            alert('Order not found');
            return;
        }

        // ตรวจสอบสถานะของคำสั่งซื้อก่อนที่จะอนุญาตให้เปลี่ยนสถานะ
        if (status === 'request to cancel') {
            if (order.status === 'pending') {
                const confirmCancel = window.confirm('Are you sure you want to cancel this order?');
                if (!confirmCancel) return; // ถ้าไม่ยืนยันให้หยุดการทำงาน
            }
            else {
                alert('You can not cancel this order');
                return; // ถ้าสถานะไม่ใช่ 'pending' จะไม่สามารถยกเลิกได้
            }
        }
        else if (status === 'received Order') {
            // ถ้า status เป็น 'Received Order' ให้ถามผู้ใช้ก่อน
            if (order.status === 'delivered') {
                const confirmRecieve = window.confirm('Are you sure you have received this order?');
                if (!confirmRecieve) return; // ถ้าไม่ยืนยันให้หยุดการทำงาน
            }
            else {
                alert('Waiting for delivery');
                return; // ถ้าสถานะไม่ใช่ 'pending' จะไม่สามารถยกเลิกได้

            }
        }

        try {
            // ส่งคำขอ PUT เพื่ออัปเดตสถานะ
            await axios.put(
                `${import.meta.env.VITE_API_URL}/orders/update/${orderId}`,
                { status: status }, // ส่งค่า status ใน request body
                { withCredentials: true } // ใส่ตัวเลือกนี้หากต้องการส่งคุกกี้
            );

            // อัปเดต UI ของคำสั่งซื้อ
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: status } : order
            ));

            alert('Order status has been updated successfully');
        } catch (error) {
            console.error('Error update status order:', error);
            alert('An error occurred while updating the order status');
        }
    };








    return (
        <Container maxWidth="lg" sx={{ mb: '300px' }}>
            <Box sx={{ mb: 4, mt: '100px', borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleTabChange} aria-label="my-account-tabs">
                    <Tab label="My Account" onClick={() => navigate('/myaccount')} />
                    <Tab label="Order Tracking" onClick={() => navigate('/tracking')} />
                </Tabs>
            </Box>

            <Box sx={{ mt: 3 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {orders.length > 0 ? (
                            orders.map((order) => {


                                return (
                                    <Grid item xs={12} key={order._id}>
                                        <Card sx={{ mb: 3, boxShadow: 3 }}>
                                            <CardContent>
                                                <Box sx={{ mb: 2 }} >



                                                    {/* Detail section */}
                                                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                                                        <Box display={'flex'} >
                                                            <Typography variant="body2" fontWeight={'bold'}>Total Price:&nbsp; </Typography>
                                                            <Typography variant="body2">  {order.total_price} บาท</Typography>
                                                        </Box>
                                                        <Box display={'flex'} >
                                                            <Typography variant="body2" fontWeight={'bold'}>Status: &nbsp; </Typography>
                                                            <Typography variant="body2" sx={{
                                                                color: order.status === 'processing' ? 'yellow' :
                                                                    order.status === 'shipped' ? 'orange' :
                                                                        order.status === 'delivered' ? 'green' :
                                                                            order.status === 'request to cancel' ? 'red' : 'inherit'
                                                            }}>
                                                                {order.status}
                                                            </Typography>
                                                        </Box>

                                                        <Box display={'flex'} >
                                                            <Typography variant="body2" fontWeight={'bold'}>Order Date: &nbsp; </Typography>
                                                            <Typography variant="body2">
                                                                {new Date(order.createdAt).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                </Box>

                                                <Typography variant="subtitle1" fontWeight={'bold'} sx={{ mt: 2, mb: 1 }}>Products:</Typography>
                                                <Grid container spacing={2}>
                                                    {order.items.map((item) => {
                                                        const product = products.find(p => p._id === item.product);
                                                        return product ? (
                                                            <Grid item xs={12} sm={6} md={4} key={item._id}>
                                                                <Card variant="outlined">
                                                                    <CardContent>
                                                                        <Box display="flex" alignItems="center">
                                                                            <Box mr={2}>
                                                                                <img
                                                                                    src={product.image_product}
                                                                                    alt={product.name}
                                                                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                                                />
                                                                            </Box>
                                                                            <Box>
                                                                                <Typography variant="body1" fontWeight="bold">{product.name}</Typography>
                                                                                <Typography variant="body2">Price: {item.price} บาท</Typography>
                                                                                <Typography variant="body2">Quantity: {item.quantity} ชิ้น</Typography>
                                                                                <Typography variant="body2">Total Price: {item.price * item.quantity} บาท</Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        ) : null;
                                                    })}
                                                </Grid>
                                                <Box display={'flex'} gap={2}>
                                                    <Button
                                                        variant="contained"


                                                        sx={{ mt: '50px', backgroundColor: "text.primary", color: "primary.main" }}
                                                        onClick={() => handleStatusOrder(order._id, 'received Order')}
                                                    >
                                                        Order Received
                                                    </Button>

                                                    <Button
                                                        variant="outlined"
                                                        color="error"

                                                        sx={{ mt: '50px' }}
                                                        onClick={() => handleStatusOrder(order._id, 'request to cancel')}
                                                    >
                                                        Cancel Order
                                                    </Button>

                                                </Box>




                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })
                        ) : (
                            <Grid item xs={12}>
                                <Card sx={{ p: 3, textAlign: 'center' }}>
                                    <Typography variant="body1">Not Found Your Order</Typography>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Box>
        </Container>
    );
}
