const express = require('express');
const {
  getAllProducts,
  getProductById,
  getRecommendedProducts // เพิ่ม function ใหม่
} = require('../controllers/productController');

const router = express.Router();

// GET: ดึงข้อมูลสินค้าทั้งหมด
router.get('/', getAllProducts);

// GET: ดึงข้อมูลสินค้าตาม ID
router.get('/products/:id', getProductById);

// GET: ดึงหนังสือแนะนำ
router.get('/products/:id/recommended', getRecommendedProducts);

module.exports = router;