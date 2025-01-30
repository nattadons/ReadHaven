require('dotenv').config(); // โหลดค่าใน .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./routes/productRoute');// Import product routes
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

console.log("JWT คือ",JWT_SECRET);  // ทดสอบให้แน่ใจว่าอ่านค่าจาก .env ได้ถูกต้อง
console.log("GOOGLE_ID คือ",GOOGLE_CLIENT_ID);  
const app = express();

// Middleware

app.use(cors({
  origin: 'http://localhost:5173',  // อนุญาตเฉพาะ frontend นี้
  credentials: true  // อนุญาตให้ส่ง cookies หรือ Authorization headers
}));

app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/users', userRoutes); // ใช้เส้นทาง /users สำหรับ user routes
app.use('/products', productRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
