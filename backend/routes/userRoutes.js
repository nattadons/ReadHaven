const express = require('express');
const {
  getUser,
  getAllUsers,
  createUser,
  loginUser,
  loginWithGoogle,// ฟังก์ชันที่สร้างผู้ใช้จาก Google
  logout, 
  updateUser, 
 
 
} = require('../controllers/userController');
const verifyToken = require('../middleware/authMiddleware'); // Import Middleware
const isAdmin = require('../middleware/authMiddleware');
const router = express.Router();

// GET: ดึงข้อมูลผู้ใช้ทั้งหมด (ต้องการ JWT)
router.get('/', verifyToken, getUser);

router.get('/getAll',verifyToken,isAdmin,getAllUsers)

// POST: สร้างผู้ใช้ใหม่ (Signup)
router.post('/signup', createUser);

// POST: Login
router.post('/login', loginUser);

// POST: สร้างผู้ใช้ใหม่จาก Google Login
router.post('/google', loginWithGoogle);  // เพิ่ม route สำหรับการสร้างผู้ใช้จาก Google


router.get('/logout', logout); // Add new logout route
// Add new update route - protected with verifyToken middleware
router.put('/update', verifyToken, updateUser);




module.exports = router;
  