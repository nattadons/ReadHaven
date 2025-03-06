const express = require('express');
const { createCheckoutSession } = require('../controllers/paymentController');

const router = express.Router();

// กำหนด route สำหรับการชำระเงิน
router.post('/pay', createCheckoutSession);

module.exports = router;
