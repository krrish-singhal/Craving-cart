"use client";
import { useEffect } from "react";

export default function RazorpayButton({ orderId, amount }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Public key (Test mode)
      amount: amount * 100, // Amount in paise
      currency: "INR",
      name: "Craving Cart",
      description: "Delicious Order Payment",
      order_id: orderId, // From backend
      handler: function (response) {
        alert("Payment Success: " + response.razorpay_payment_id);
        // Optionally call your backend to verify payment
      },
      prefill: {
        name: "Krrish",
        email: "krrish@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#ff6347",
      },
      method: {
        upi: true, // enable UPI
        netbanking: false,
        card: false,
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay with UPI</button>;
}
