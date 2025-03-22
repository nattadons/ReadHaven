import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import CheckoutForm from './../components/CheckoutForm.jsx';
/* import axios from 'axios'; */

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_PK_TEST);

export default function PaymentPage() {
    const [clientSecret, setClientSecret] = useState("");

    const handleCheckout = async () => {
        const items = [
            { id: "item-1", name: "T-shirt", amount: 1000 },
            { id: "item-2", name: "Hat", amount: 500 },
        ];

        const response = await fetch(`${import.meta.env.VITE_API_URL}/payment/pay`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items }),
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
    };





    /* const TestCheckout = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/payment/testpay`);
            if (response.data.url) {
                window.location.href = response.data.url; // redirect to the Stripe Checkout session URL
            }
        } catch (error) {
            console.error('Error during the payment process:', error);
        }
    }; */



    return (
        <div>
            <button onClick={handleCheckout}>Checkout</button>
            {clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm clientSecret={clientSecret} />
                </Elements>
            )}
        </div>



    );
}
