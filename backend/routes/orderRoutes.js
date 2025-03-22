const express = require('express');
const {
    createOrder,
    getAllOrders, 
    deleteOrder,
    updateOrder,
    getOrderByUserId

} = require('../controllers/orderController');


const verifyToken = require('../middleware/authMiddleware'); // Import Middleware
const isAdmin = require('../middleware/authMiddleware');

const router = express.Router();

// สร้างคำสั่งซื้อ (ผู้ใช้ต้องล็อกอิน)
router.post('/', verifyToken, createOrder);
router.get('/get', verifyToken, getOrderByUserId)
router.get('/getAll', verifyToken, isAdmin, getAllOrders)
router.put('/update/:orderId', verifyToken , updateOrder)
router.delete('/delete/:orderId', verifyToken , isAdmin , deleteOrder)

module.exports = router;
