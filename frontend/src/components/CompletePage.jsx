
import { Box, Typography, Container } from '@mui/material'
import successImage from '../assets/icons/success.png';
import axios from 'axios';



function CompletePage() {

  const params = new URLSearchParams(window.location.search);
  const paymentIntentId = params.get("payment_intent");

    // ฟังก์ชันที่ใช้ในการตรวจสอบสถานะการชำระเงิน
    const checkPaymentStatus = async () => {
      if (paymentIntentId) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/check-payment-status`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId }),
          });
  
          const data = await response.json();
          
          if (data.status === 'succeeded') {
            console.log('Payment successful');
            console.log('data.metadata', data.metadata);
  
            // ส่งข้อมูลไปสร้าง order
            const orderPayload = {
              items: data.metadata.items, // สมมติว่า data.metadata.items เป็นข้อมูลที่จำเป็น
              payment_method: 'online_payment',
              shipping_address: data.metadata.shipping_address,
              payment_intent_id: paymentIntentId
            };
  
            await axios.post(
              `${import.meta.env.VITE_API_URL}/orders`,
              orderPayload,
              { withCredentials: true }
            );
          } else if (data.status === 'requires_action') {
            console.log('Payment requires additional authentication');
          } else if (data.status === 'failed') {
            console.log('Payment failed');
          } else {
            console.log('Unknown payment status');
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }
    };
  
    // เรียกฟังก์ชันเพื่อเช็คสถานะการชำระเงิน
    checkPaymentStatus();



  return (
    <Container maxWidth="lg" sx={{ mb: '300px', mt: '100px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img src={successImage} alt="" />
        <Typography color='#34C759' fontWeight={'500'} mt={'16px'}>Payment completed please wait for the delivery process.</Typography>
      </Box>
    </Container>

  )
}

export default CompletePage