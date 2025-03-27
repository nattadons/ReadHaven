const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],
    total_price: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        enum: ['online_payment', 'cash'],
        required: true
    },
    payment_details: {
        payment_intent_id: { type: String, sparse: true },
        transaction_id: String,
        status: {
            type: String,
            enum: ['requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'succeeded', 'canceled']
        },
        payment_date: Date,
        amount: Number,
        payment_method_details: {
            type: String,
            last4: String,
            brand: String
        },
        receipt_url: String
    },
    shipping_address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'shipped', 'delivered', 'canceled', 'payment_failed',],
        default: 'pending'
    }
}, { timestamps: true });

// สร้าง unique index สำหรับ payment_intent_id
// sparse: true จะช่วยให้เก็บเอกสารที่ไม่มี payment_intent_id ได้
orderSchema.index({ 'payment_details.payment_intent_id': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Order', orderSchema);