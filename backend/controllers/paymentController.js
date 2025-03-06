
require('dotenv').config(); // โหลดค่าใน .env
const stripe_secret_key = process.env.SK_TEST;
const stripe = require('stripe')(stripe_secret_key);


const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
           price: 'price_1Qzc5xRutjOCuudtS8jvzb5f',
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}?success=true`,
      cancel_url: `${process.env.CLIENT_URL}?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createCheckoutSession };
