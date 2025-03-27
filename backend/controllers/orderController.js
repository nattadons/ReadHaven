require('dotenv').config();
const Order = require('../models/order'); 
const Product = require('../models/product'); 
const stripe = require('stripe')(process.env.SK_LIVE);

// สร้างคำสั่งซื้อ
const createOrder = async (req, res) => {
    try {
        const { items, payment_method, shipping_address, payment_intent_id } = req.body;
        const userId = req.user.userId;

        // ตรวจสอบสินค้า
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

        // ข้อมูลการชำระเงิน
        let payment_details = null;
        
        // หากมีการชำระผ่าน Stripe (online payment)
        if (payment_method === 'online_payment' && payment_intent_id) {
            // ดึงข้อมูลการชำระเงินจาก Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
            
            payment_details = {
                payment_intent_id: payment_intent_id,
                status: paymentIntent.status,
                payment_date: new Date(paymentIntent.created * 1000),
                amount: paymentIntent.amount / 100
            };
            
            // เพิ่มข้อมูลเพิ่มเติมถ้ามี charges
            if (paymentIntent.charges && paymentIntent.charges.data.length > 0) {
                const charge = paymentIntent.charges.data[0];
                
                // เพิ่มข้อมูลบัตรถ้ามี
                if (charge.payment_method_details && charge.payment_method_details.card) {
                    payment_details.payment_method_details = {
                        type: charge.payment_method_details.type,
                        last4: charge.payment_method_details.card.last4,
                        brand: charge.payment_method_details.card.brand
                    };
                }
                
                // เพิ่ม receipt URL ถ้ามี
                if (charge.receipt_url) {
                    payment_details.receipt_url = charge.receipt_url;
                }
            }
        }

        // สร้างข้อมูล order
        const orderData = {
            user: userId,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: products.find(p => p._id.toString() === item.product).price
            })),
            total_price,
            payment_method,
            payment_details,
            shipping_address,
            status: payment_method === 'cash' ? 'pending' : 
                   (payment_details?.status === 'succeeded' ? 'paid' : 'processing')
        };

        // ใช้ findOneAndUpdate ด้วย upsert: true สำหรับ online payment
        let order;
        
        if (payment_method === 'online_payment' && payment_intent_id) {
            // ตรวจสอบและสร้าง order ด้วย atomic operation
            order = await Order.findOneAndUpdate(
                { 'payment_details.payment_intent_id': payment_intent_id },
                { $setOnInsert: orderData },
                { upsert: true, new: true }
            );
            
            // ตรวจสอบว่า order นี้เพิ่งถูกสร้าง หรือมีอยู่ก่อนแล้ว
            const isNewlyCreated = order.createdAt.getTime() === order.updatedAt.getTime();
            
            if (!isNewlyCreated) {
                return res.status(200).json({
                    message: 'คำสั่งซื้อนี้ถูกสร้างไปแล้ว',
                    order
                });
            }
        } else {
            // กรณีชำระเงินสด ให้สร้าง order ใหม่ทันที
            order = new Order(orderData);
            await order.save();
        }

        res.status(201).json({
            message: 'สร้างคำสั่งซื้อสำเร็จ',
            order
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ:', error);
        
        // ตรวจสอบว่าเป็น error จาก duplicate key หรือไม่
        if (error.code === 11000 && error.keyPattern && error.keyPattern['payment_details.payment_intent_id']) {
            // มีการพยายามบันทึก payment_intent_id ซ้ำ ให้ดึง order ที่มีอยู่แล้วมาแสดง
            try {
                const existingOrder = await Order.findOne({
                    'payment_details.payment_intent_id': req.body.payment_intent_id
                });
                
                if (existingOrder) {
                    return res.status(200).json({
                        message: 'คำสั่งซื้อนี้ถูกสร้างไปแล้ว',
                        order: existingOrder
                    });
                }
            } catch (findError) {
                console.error('เกิดข้อผิดพลาดในการค้นหาคำสั่งซื้อที่มีอยู่:', findError);
            }
            
            return res.status(409).json({ 
                message: 'คำสั่งซื้อซ้ำ: มีคำสั่งซื้อที่ใช้ payment_intent_id นี้อยู่แล้ว'
            });
        }
        
        // กรณีเกิด error อื่นๆ
        res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ', 
            error: error.message 
        });
    }
};
const getOrderByUserId = async (req, res) => {
    try {
        const userId = req.user.userId;  // ดึง userId จากข้อมูลผู้ใช้ที่เข้าสู่ระบบ

        // ค้นหา Order ที่เป็นของผู้ใช้คนนั้นทั้งหมด
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });

        // ตรวจสอบว่ามีคำสั่งซื้อหรือไม่
        if (orders.length === 0) {
            return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อของคุณ' });
        }

        res.status(200).json({ message: 'ดึงข้อมูลคำสั่งซื้อสำเร็จ', orders });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ', error: error.message });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const { orderId } = req.params; // ดึง orderId จากพารามิเตอร์ URL

        let orders;

        if (orderId) {
            // ถ้ามีการส่ง orderId มาให้ค้นหาคำสั่งซื้อนั้น
            orders = await Order.findOne({ _id: orderId });
            if (!orders) {
                return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อนี้' });
            }
        } else {
            // ถ้าไม่มี orderId ให้ดึงคำสั่งซื้อทั้งหมด
            orders = await Order.find().sort({ createdAt: -1 });
            if (orders.length === 0) {
                return res.status(404).json({ message: 'ไม่มีคำสั่งซื้อในระบบ' });
            }
        }

        res.status(200).json({ message: 'ดึงข้อมูลคำสั่งซื้อสำเร็จ', orders });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงคำสั่งซื้อ', error: error.message });
    }
};



const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // ตรวจสอบว่า orderId มีอยู่หรือไม่
        if (!orderId) {
            return res.status(400).json({ message: 'ต้องระบุรหัสคำสั่งซื้อ' });
        }

        // ลบคำสั่งซื้อโดยตรง
        const result = await Order.findByIdAndDelete(orderId);
        
        // ตรวจสอบว่าคำสั่งซื้อถูกลบแล้วหรือไม่
        if (!result) {
            return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อนี้' });
        }

        res.status(200).json({ 
            message: 'ลบคำสั่งซื้อสำเร็จ',
            deleted_order_id: orderId
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบคำสั่งซื้อ:', error);
        res.status(500).json({ 
            message: 'เกิดข้อผิดพลาดในการลบคำสั่งซื้อ', 
            error: error.message 
        });
    }
};



const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params; // ดึง orderId จากพารามิเตอร์ URL
        const { status, shipping_address, payment_details } = req.body; // ข้อมูลที่สามารถอัปเดตได้

        // ตรวจสอบว่า orderId ถูกส่งมาหรือไม่
        if (!orderId) {
            return res.status(400).json({ message: 'ต้องระบุรหัสคำสั่งซื้อ' });
        }

        // ค้นหาและอัปเดตคำสั่งซื้อ
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { 
                $set: {
                    ...(status && { status }),
                    ...(shipping_address && { shipping_address }),
                    ...(payment_details && { payment_details })
                }
            },
            { new: true } // ส่งคืนค่าหลังจากอัปเดตแล้ว
        );

        // ตรวจสอบว่าพบคำสั่งซื้อหรือไม่
        if (!updatedOrder) {
            return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อนี้' });
        }

        res.status(200).json({
            message: 'อัปเดตคำสั่งซื้อสำเร็จ',
            order: updatedOrder
        });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการอัปเดตคำสั่งซื้อ:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดในการอัปเดตคำสั่งซื้อ',
            error: error.message
        });
    }
};




module.exports = {
    createOrder,
    getAllOrders, 
    deleteOrder,
    updateOrder,
    getOrderByUserId,
};