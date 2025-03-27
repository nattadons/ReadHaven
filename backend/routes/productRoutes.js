const express = require('express');
const {
  getAllProducts,
  getProductById,
  getProductsByOrder,
  getRecommendedProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  
 
} = require('../controllers/productController');

const isAdmin = require('../middleware/authMiddleware');
const verifyToken = require('../middleware/authMiddleware'); // Import Middleware

const router = express.Router();
const multer = require('multer');
const os = require('os'); // ใช้ temporary directory ของระบบ
const path = require("path");

// เปลี่ยนเป็นใช้ temporary directory เพื่อเก็บไฟล์ชั่วคราวก่อนอัพโหลดไป Google Drive
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir()); // เก็บไฟล์ชั่วคราวในระบบ
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// เพิ่มการตั้งค่า limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // จำกัดขนาดไฟล์ที่ 10MB
  }
});






// GET: ดึงข้อมูลสินค้าทั้งหมด
router.get('/', getAllProducts);

// GET: ดึงข้อมูลสินค้าตาม ID
router.get('/products/:id', getProductById);
// GET: ดึงข้อมูลสินค้าตาม ID
router.get('/orders',  getProductsByOrder,);

// GET: ดึงหนังสือแนะนำ
router.get('/products/:id/recommended', getRecommendedProducts);


router.post('/add',verifyToken, isAdmin, upload.single('image_product'), addProduct);

router.put('/update/:id', verifyToken, isAdmin, upload.single('image_product'), updateProduct);

router.delete('/delete/:id', verifyToken, isAdmin, deleteProduct);




module.exports = router;