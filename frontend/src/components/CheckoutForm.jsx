import { useState } from "react";
import { Button ,Box} from "@mui/material"; // Import Button จาก MUI
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error} = await stripe.confirmPayment({
      
      elements,
      
      confirmParams: {
        return_url:window.location.origin + "/complete" ,
      },
    });

     
    


    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "accordion"
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />

      {/* เปลี่ยนปุ่ม MUI ให้เป็นปุ่ม submit */}
      <Box display={'flex'} justifyContent={'flex-end'} mt={3}>
      <Button

        type="submit"
        variant="contained"
        disabled={isLoading || !stripe || !elements}
        size="large" sx={{
          color: 'primary.main', backgroundColor: 'text.primary', width: { xs: '50%', sm: 'auto' },
          minWidth: { sm: '150px' },
        }}
      >
        {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
      </Button>
      </Box>

      {/* แสดงข้อความ error หรือ success */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
