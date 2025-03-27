const express = require('express');
const { createCheckoutSession,getPaymentIntent } = require('../controllers/paymentController'); // นำเข้าฟังก์ชัน

const router = express.Router();

// กำหนด route สำหรับการชำระเงิน
router.post('/pay', createCheckoutSession);
router.post('/check-payment-status',getPaymentIntent);


module.exports = router;
