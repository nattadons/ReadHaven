const express = require('express');
const {
    createOrder,
    getOrders,
    getUserOrders,
    updateOrderStatus,
    cancelOrder
} = require('../controllers/orderController');
const verifyToken = require('../middleware/authMiddleware'); // Import Middleware


const router = express.Router();

// สร้างคำสั่งซื้อ (ผู้ใช้ต้องล็อกอิน)
router.post('/', verifyToken, createOrder);

// ดึงคำสั่งซื้อของผู้ใช้ที่ล็อกอินอยู่
router.get('/my-orders', verifyToken, getUserOrders);





// ยกเลิกคำสั่งซื้อ (ผู้ใช้ต้องล็อกอิน)
router.delete('/:orderId', verifyToken, cancelOrder);

module.exports = router;
