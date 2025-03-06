
import axios from 'axios';

const Checkout = () => {
  const handleCheckout = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment/pay`);
      if (response.data.url) {
        window.location.href = response.data.url; // redirect to the Stripe Checkout session URL
      }
    } catch (error) {
      console.error('Error during the payment process:', error);
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Checkout;
