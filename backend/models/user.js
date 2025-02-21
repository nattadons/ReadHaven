const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  email: { type: String, required: true },
  phone_number: String,
  image_profile: String,
  password: { type: String }, // field สำหรับ password ถ้าผู้ใช้สมัครผ่าน Google จะไม่ใช้
  googleId: { type: String },  // เพิ่ม googleId สำหรับผู้ใช้ที่ล็อกอินผ่าน Google
  imageUrl: { 
    type: String,
    required: function() { return !!this.googleId; } // ถ้ามี googleId -> imageUrl ต้องมีค่า
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
  
});

module.exports = mongoose.model('Users', usersSchema);
