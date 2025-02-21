const Order = require('../models/order'); // เรียกใช้โมเดล Order
const Product = require('../models/product'); // โมเดลสินค้า
const User = require('../models/user'); // โมเดลผู้ใช้

// สร้างคำสั่งซื้อ
const createOrder = async (req, res) => {
    try {
        const { items, payment_method, shipping_address } = req.body;
        const userId = req.user.id; // ได้จาก middleware auth

        // ตรวจสอบว่าสินค้าทุกชิ้นมีอยู่ในระบบหรือไม่
        const productIds = items.map(item => item.product);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== items.length) {
            return res.status(400).json({ message: 'สินค้าบางรายการไม่มีอยู่ในระบบ' });
        }

        // คำนวณราคาสินค้าทั้งหมด
        const total_price = items.reduce((total, item) => {
            const product = products.find(p => p._id.toString() === item.product);
            return total + product.price * item.quantity;
        }, 0);

        // สร้างคำสั่งซื้อใหม่
        const newOrder = new Order({
            user: userId,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: products.find(p => p._id.toString() === item.product).price
            })),
            total_price,
            payment_method,
            shipping_address
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ', error: error.message });
    }
};



// ดึงคำสั่งซื้อของผู้ใช้
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId }).populate('items.product', 'name price');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'ไม่สามารถดึงคำสั่งซื้อของคุณได้', error: error.message });
    }
};



// ยกเลิกคำสั่งซื้อ
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
        }

        order.status = 'canceled';
        await order.save();

        res.status(200).json({ message: 'คำสั่งซื้อถูกยกเลิก', order });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ', error: error.message });
    }
};

module.exports = {
    createOrder,

    getUserOrders,

    cancelOrder
};
