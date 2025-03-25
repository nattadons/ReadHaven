require('dotenv').config(); // โหลดค่าใน .env
const stripe_secret_key = process.env.SK_LIVE; // นำค่า Secret Key จาก .env
const stripe = require('stripe')(stripe_secret_key);

const calculateOrderAmount = (items) => {
  // คำนวณยอดรวมของออร์เดอร์
  let total = 0;
  items.forEach((item) => {
    total += item.price * item.quantity * 100; 
  });
  console.log('ราคาสินค้า',total);
  return total;
};

exports.createCheckoutSession = async (req, res) => {
  const { items, payment_method, shipping_address, payment_intent_id } = req.body;
  const orderpayload = req.body
  console.log('items',items);
  console.log('orderpayload',req.body);

  try {
    // สร้าง PaymentIntent กับยอดรวมและสกุลเงิน
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: 'thb',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(orderpayload ) // เก็บข้อมูลไว้ใน metadata
      }
      
    });

    // ส่ง clientSecret กลับไป
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};




exports.getPaymentIntent = async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    // ดึงข้อมูลจาก Stripe API
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // ส่งสถานะกลับไปยัง frontend
    const metadata = paymentIntent.metadata.items ? JSON.parse(paymentIntent.metadata.items) : {};

    
    res.json({ status: paymentIntent.status, metadata: metadata });
  } catch (error) {
    console.error('Error retrieving paymentIntent:', error);
    res.status(500).send('Error checking payment status');
  }
}
























