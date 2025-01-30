const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // ควรเก็บในไฟล์ .env

// Middleware สำหรับตรวจสอบ JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // ดึง Token จาก Header

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
