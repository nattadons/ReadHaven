const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // ควรเก็บในไฟล์ .env

// Middleware สำหรับตรวจสอบ JWT
const verifyToken = (req, res, next) => {
  //const token = req.headers.authorization?.split(' ')[1]; // ดึง Token จาก Header
  const token = req.cookies.token; // ดึง Token จาก Cookie
  if (!token) {
    return res.status(401).json({ message: 'Access denied! No token provided.' });
  }

  try {
    // ตรวจสอบ Token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // เก็บข้อมูล payload ที่ decode แล้วไว้ใน req
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token!' });
  }
};

module.exports = verifyToken;



// ตรวจสอบว่าเป็น admin หรือไม่
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'ไม่มีสิทธิ์เข้าถึงส่วนนี้ เฉพาะผู้ดูแลระบบเท่านั้น' });
  }
};
