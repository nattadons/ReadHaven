const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  email: { type: String, required: true },
  phone_number: String,
  image_profile: String,
  password: { type: String, required: true }, // เพิ่ม field นี้
});

module.exports = mongoose.model('Users', usersSchema);
