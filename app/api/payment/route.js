import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { amount } = await request.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount, // amount in paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
    payment_capture: 1,
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order Creation Failed:', error);
    return NextResponse.json(
      { error: 'Order creation failed', details: error.message },
      { status: 500 }
    );
  }
}
