const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // ผู้สั่งซื้อ
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true }, // สินค้า
            quantity: { type: Number, required: true }, // จำนวนสินค้าที่สั่ง
            price: { type: Number, required: true } // ราคาต่อชิ้น
        }
    ],
    total_price: { type: Number, required: true }, // ราคารวมทั้งหมด
    status: { 
        type: String, 
        enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'], 
        default: 'pending' 
    }, // สถานะคำสั่งซื้อ
    payment_method: { 
        type: String, 
        enum: ['credit_card', 'paypal', 'bank_transfer', 'cod'], 
        required: true 
    }, // วิธีชำระเงิน
    transaction_id: { type: String }, // เก็บ transaction ID ถ้ามี
    shipping_address: { type: String, required: true }, // ที่อยู่จัดส่ง
    created_at: { type: Date, default: Date.now } // วันที่สั่งซื้อ
});

module.exports = mongoose.model('Orders', orderSchema);
