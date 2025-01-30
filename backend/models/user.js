const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  email: { type: String, required: true },
  phone_number: String,
  image_profile: String,
  password: { type: String }, // field สำหรับ password ถ้าผู้ใช้สมัครผ่าน Google จะไม่ใช้
  googleId: { type: String },  // เพิ่ม googleId สำหรับผู้ใช้ที่ล็อกอินผ่าน Google
  imageUrl: { type: String },   // เพิ่มฟิลด์สำหรับรูปโปรไฟล์จาก Google
});

module.exports = mongoose.model('Users', usersSchema);
