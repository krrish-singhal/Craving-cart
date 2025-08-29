'use client';
import React from 'react';

export default function RazorpayCheckout({ amount }) {
  const loadRazorpay = async () => {
    const res = await fetch('/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }), // amount in paise
    });

    const data = await res.json();

    if (!data.id) {
      alert('❌ Failed to create order');
      console.error(data);
      return;
    }

   const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: data.amount,
  currency: 'INR',
  name: 'Craving Cart',
  description: 'Purchase via Razorpay',
  order_id: data.id,
  handler: function (response) {
    alert('✅ Payment successful!');
    console.log('Payment ID:', response.razorpay_payment_id);
    console.log('Order ID:', response.razorpay_order_id);
    console.log('Signature:', response.razorpay_signature);
  },
  prefill: {
    name: 'Test User',
    email: 'test@example.com',
    contact: '9876543210',
  },
  theme: {
    color: '#1e40af',
  },
  method: {
    upi: true,
    card: true,
    netbanking: true,
    wallet: true
  },
  upi: {
    flow: 'collect' // ✅ Enables QR + manual UPI ID
  }
};


    const razor = new window.Razorpay(options);
    razor.open();
  };

  return (
    <button
      onClick={loadRazorpay}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      Pay ₹{amount / 100} via Razorpay
    </button>
  );
}
