import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tab, Tabs, Box, Container, CircularProgress, Grid, Card, CardContent, Typography, Divider, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

import EditIcon from '@mui/icons-material/Edit';

export default function OrderAdmin() {
  const navigate = useNavigate();

  const [tabIndex, setTabIndex] = useState(1);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null); // เก็บคำสั่งซื้อที่เลือก

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  // ดึงข้อมูลคำสั่งซื้อจาก API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/orders/getAll`,
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

  // ดึงข้อมูลผู้ใช้ทั้งหมดจาก API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (orders.length > 0) {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/users/getAll`,
            { withCredentials: true }
          );
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [orders]);

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

  // ฟังก์ชันค้นหาข้อมูลผู้ใช้จาก userId
  const findUserById = (userId) => {
    return users.find(user => user._id === userId) || null;
  };

  // ฟังก์ชันอัปเดตสถานะ
  const handleUpdateStatus = async () => {
    if (selectedOrder && status) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/orders/update/${selectedOrder._id}`,
          { status },
          { withCredentials: true }
        );
        // อัปเดตคำสั่งซื้อใหม่หลังจากการอัปเดตสถานะ
        setOrders(orders.map(order => order._id === selectedOrder._id ? { ...order, status } : order));
        setStatus('');
        setSelectedOrder(null);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const confirmDelete = window.confirm('Are you sure you want to delete this order?');
      if (!confirmDelete) return;
  
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/orders/delete/${orderId}`,
        { withCredentials: true }
      );
  
      // อัปเดตคำสั่งซื้อใหม่หลังจากการลบออก
      setOrders(orders.filter(order => order._id !== orderId));
      alert('Order deleted successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('An error occurred while deleting the order');
    }
  };
  

  return (
    <Container maxWidth="lg" sx={{ mb: '300px' }}>
      <Box sx={{ mb: 4, mt: '100px', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="my-account-tabs">
          <Tab label="My Account" onClick={() => navigate('/myaccount')} />
          <Tab label="Customer Order" onClick={() => navigate('/checkorder')} />
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
                const userInfo = findUserById(order.user);

                return (
                  <Grid item xs={12} key={order._id}>
                    <Card sx={{ mb: 3, boxShadow: 3 }}>
                      <CardContent>
                        <Box sx={{ mb: 2 }} >


                          {/* แสดงข้อมูลผู้ใช้ที่เกี่ยวข้องกับ order */}
                          <Box sx={{ 
                            mb: 2,
                            p: 2,
                            bgcolor: 'text.primary',
                            borderRadius: 1
                          }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary.main">
                              User Information
                            </Typography>

                            {userInfo ? (
                              <>
                                <Typography variant="body1" color="primary.main">Name: {userInfo.name}</Typography>
                                <Typography variant="body2" color="primary.main">Email: {userInfo.email}</Typography>
                                <Typography variant="body2" color="primary.main">Phone Number: {userInfo.phone_number || "Not specified"}</Typography>
                              </>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                No user information found
                              </Typography>
                            )}
                          </Box>

                          <Divider sx={{ my: 2 }} />
                          {/* Detail section */}
                          <Box display={'flex'} flexDirection={'column'} gap={1}>
                          <Box display={'flex'} >
                            <Typography variant="body2" fontWeight={'bold'}>Total Price:&nbsp; </Typography>
                            <Typography variant="body2">  {order.total_price} บาท</Typography>
                          </Box>
                          <Box display={'flex'} >
                            <Typography variant="body2" fontWeight={'bold'}>Status: &nbsp; </Typography>
                            <Typography variant="body2" sx={{
                              color: order.status === 'paid' ? 'blue' :
                                order.status === 'pending' ? 'orange' :
                                order.status === 'delivered' ? 'green' :
                                  order.status === 'request to cancel' ? 'red' : 'inherit'
                                  
                            }}>
                              {order.status}
                            </Typography>
                          </Box>
                          <Box display={'flex'} >
                            <Typography variant="body2" fontWeight={'bold'}>Adress: &nbsp; </Typography>
                            <Typography variant="body2"> {order.shipping_address}</Typography>
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
                            variant="outlined"
                            color="text.primary"
                            startIcon={<EditIcon />}
                            sx={{ mt: '50px' }}
                            onClick={() => {
                              setSelectedOrder(order);
                              setStatus(order.status); // ตั้งค่าเริ่มต้นสถานะ
                            }}
                          >
                            Update Status
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            sx={{ mt: '50px' }}
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            Delete Order
                          </Button>

                        </Box>



                        {/* Dropdown สำหรับเลือกสถานะ */}
                        {selectedOrder && selectedOrder._id === order._id && (
                          <Box sx={{ mt: 3 }}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                              >
                                <MenuItem value="processing">Processing</MenuItem>
                                <MenuItem value="shipped">Shipped</MenuItem>
                                <MenuItem value="delivered">Delivered</MenuItem>
                                <MenuItem value="canceled">Canceled</MenuItem>
                              </Select>
                            </FormControl>

                            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                              <Button
                                variant="contained"
                                onClick={handleUpdateStatus}
                                sx={{ color: 'primary.main', backgroundColor: 'text.primary', minWidth: '100px' }}

                              >
                                Confirm
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setSelectedOrder(null);
                                  setStatus('');
                                }}
                                color='error'
                                sx={{ minWidth: '100px' }}

                              >
                                Cancel
                              </Button>
                            </Box>
                          </Box>
                        )}

                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Grid item xs={12}>
                <Card sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body1">ไม่พบรายการสั่งซื้อ</Typography>
                </Card>
              </Grid>
            )}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
