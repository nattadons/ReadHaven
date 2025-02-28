const express = require('express');
const {
  getAllProducts,
  getProductById,
  getRecommendedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  
 
} = require('../controllers/productController');

const isAdmin = require('../middleware/authMiddleware');
const verifyToken = require('../middleware/authMiddleware'); // Import Middleware

const router = express.Router();

// GET: ดึงข้อมูลสินค้าทั้งหมด
router.get('/', getAllProducts);

// GET: ดึงข้อมูลสินค้าตาม ID
router.get('/products/:id', getProductById);

// GET: ดึงหนังสือแนะนำ
router.get('/products/:id/recommended', getRecommendedProducts);


router.post('/add', verifyToken, isAdmin, addProduct);

router.put('/update/:id', verifyToken, isAdmin, updateProduct);

router.delete('/delete/:id', verifyToken, isAdmin, deleteProduct);




module.exports = router;