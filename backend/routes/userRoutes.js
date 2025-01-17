const express = require('express');
const bcrypt = require('bcrypt'); // ใช้สำหรับเข้ารหัส password
const Users = require('../models/user'); // ดึง schema ของ user จาก model

const router = express.Router();

// GET: ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', async (req, res) => {
  try {
    const users = await Users.find(); // ดึงข้อมูลผู้ใช้ทั้งหมดจากฐานข้อมูล
    res.json(users); // ส่งข้อมูลกลับในรูปแบบ JSON
  } catch (err) {
    res.status(500).json({ error: err.message }); // ส่ง error 500 พร้อมข้อความ error
  }
});

// POST: สร้างผู้ใช้ใหม่ (Signup)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone_number, password } = req.body;

    // ตรวจสอบว่า email มีในระบบหรือยัง
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // เข้ารหัส Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const newUser = new Users({
      name,
      email,
      phone_number,
      password: hashedPassword, // เก็บ password แบบเข้ารหัส
    });

    const savedUser = await newUser.save(); // บันทึกผู้ใช้ใหม่ในฐานข้อมูล
    res.status(201).json({ message: 'User created successfully!', user: savedUser });
  } catch (err) {
    res.status(500).json({ error: err.message }); // ส่ง error 500 พร้อมข้อความ error
  }
});

// POST: Login (ตรวจสอบ email และ password)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // ค้นหา user จาก email
    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    // ตรวจสอบ password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }

    res.status(200).json({ message: 'Login successful!', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: แก้ไขข้อมูลผู้ใช้
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // อัปเดตข้อมูลในฐานข้อมูล
    const updatedUser = await Users.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: ลบผู้ใช้
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // ลบผู้ใช้ในฐานข้อมูล
    const deletedUser = await Users.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.status(200).json({ message: 'User deleted successfully!', user: deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
