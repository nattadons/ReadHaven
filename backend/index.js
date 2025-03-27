require('dotenv').config(); // โหลดค่าใน .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const productRoutes = require('./routes/productRoutes');// Import product routes
const orderRoutes = require('./routes/orderRoutes');// Import order routes
const cartRoutes = require('./routes/cartRoutes');// Import cart routes
const paymentRoutes = require('./routes/paymentRoutes');

const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// ใช้ cookie-parser
const cookieParser = require('cookie-parser');




const app = express();


//ปรับการตั้งค่า Express เพื่อรองรับไฟล์ขนาดใหญ่:
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Middleware

app.use(cors({
  origin: [process.env.CLIENT_URL || 'https://boo-k-haven.vercel.app', process.env.API_URL, 'https://drive.google.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
}));


console.log('CLIENT_URL',process.env.CLIENT_URL);
// ใช้ cookie-parser
app.use(cookieParser());


// ✅ Set Cross-Origin-Opener-Policy
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});





app.use(express.json());

// เชื่อมต่อ MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));





// Routes
app.use('/users', userRoutes); // ใช้เส้นทาง /users สำหรับ user routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



