'use client';

import { CartUpdateContext } from '@/app/_context/CartUpdateContext';
import GlobalApi from '../_utils/globalapi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useSearchParams,useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PayPalButtons } from '@paypal/react-paypal-js';


function CheckoutClient() {
  const params = useSearchParams();
  const { user } = useUser();
  const [cart, setCart] = useState([]);
  const { updateCart, setUpdateCart } = useContext(CartUpdateContext);

  const [deliveryAmount, setDeliveryAmount] = useState(5);
  const [taxAmount, setTaxAmount] = useState(0);
  const [total, setTotal] = useState(0.01);
  const [subTotal, setSubTotal] = useState(0);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router=useRouter();

  useEffect(() => {
    if (user) {
      GetUserCart();
    }
  }, [user, updateCart]);

  const GetUserCart = async () => {
    const resp = await GlobalApi.GetUserCart(user?.primaryEmailAddress.emailAddress);
    setCart(resp?.userCarts);
    calculateTotalAmount(resp?.userCarts);
  };

  const calculateTotalAmount = (cartItems) => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price;
    });
    setSubTotal(total.toFixed(2));
    const tax = total * 0.09;
    setTaxAmount(tax);
    setTotal(total + tax + deliveryAmount);
  };

  const addToOrder = async () => {
  setLoading(true);

  const data = {
    email: user.primaryEmailAddress.emailAddress,
    orderAmount: total,
    restaurantName: params.get('restaurant'),
    userName: user.fullName,
    phone: phone,
    address: address,
    zipCode: zip,
  };

  try {
    const resp = await GlobalApi.CreateNewOrder(data);
    const resultId = resp?.createOrder?.id;

    if (!resultId) throw new Error("Order not created");

    
    await Promise.all(
      cart.map((item) =>
        GlobalApi.UpdateOrderToAddOrderItems(
          item.productName,
          Number(item.price),
          resultId,
          user?.primaryEmailAddress.emailAddress
        )
      )
    );

    toast.success('Order Created Successfully!');
    setUpdateCart(!updateCart); 
    setCart([]); 
    await SendEmail();
    router.replace("/confirmation")
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error('Failed to create order');
  } finally {
    setLoading(false);
  }
};


const SendEmail = async () => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.firstName || "Customer",
        orderItems: cart.map((item) => ({
          title: item.productName,
          price: item.price,
          quantity: item.quantity || 1, // optional if quantity is not in your schema
        })),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Email error:", data);
      toast(`❌ Failed to send: ${data.message || "Unknown error"}`);
    } else {
      toast("✅ Confirmation Email Sent");
    }
  } catch (err) {
    console.error("❌ Email send failed:", err);
    toast("❌ Email sending failed");
  }
};


  // const handleRazorpayPayment = async () => {
  //   if (!username || !email || !phone || !zip || !address) {
  //     return toast.error('⚠️ Please fill all billing details');
  //   }

  //   try {
  //     setLoading(true);

  //     const res = await fetch('/api/payment', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ amount: Math.round(total * 100) }), // in paise
  //     });

  //     const data = await res.json();
  //     if (!data.id) {
  //       throw new Error('Order not created');
  //     }

  //     const options = {
  //       key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  //       amount: data.amount,
  //       currency: 'INR',
  //       name: 'Craving Cart',
  //       description: 'Order Payment',
  //       order_id: data.id,
  //       handler: async function (response) {
  //         // payment successful → create order
  //         const orderData = {
  //           email: user?.primaryEmailAddress.emailAddress,
  //           orderAmount: total,
  //           restaurantName: params.get('restaurant'),
  //           userName: username,
  //           phone,
  //           address,
  //           zipCode: zip,
  //         };

  //         const orderResp = await GlobalApi.CreateNewOrder(orderData);
  //         const orderId = orderResp?.createOrder?.id;

  //         if (orderId) {
  //           for (const item of cart) {
  //             await GlobalApi.UpdateOrderToAddOrderItems(
  //               item.productName,
  //               item.price,
  //               orderId,
  //               user?.primaryEmailAddress.emailAddress
  //             );
  //           }

  //           setUpdateCart(!updateCart);
  //           toast.success('✅ Order Placed Successfully!');
  //         } else {
  //           toast.error('❌ Failed to save order in DB');
  //         }

  //         setLoading(false);
  //       },
  //       prefill: {
  //         name: username,
  //         email,
  //         contact: phone,
  //       },
  //       theme: {
  //         color: '#F37254',
  //       },
  //       modal: {
  //         ondismiss: () => {
  //           toast.info('Payment cancelled');
  //           setLoading(false);
  //         },
  //       },
  //     };

  //     const razor = new window.Razorpay(options);
  //     razor.open();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('❌ Something went wrong during payment.');
  //     setLoading(false);
  //   }
  // };

  return (
    <div>
      <h2 className="font-bold text-2xl my-5">Checkout</h2>
      <div className="p-5 px-5 md:px-10 grid grid-cols-1 md:grid-cols-3 py-8">
        <div className="md:col-span-2 mx-20">
          <h2 className="font-bold text-3xl">Billing Details</h2>
          <div className="grid grid-cols-2 gap-10 mt-3">
            <Input placeholder="Name" onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-10 mt-3">
            <Input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
            <Input placeholder="Zip" onChange={(e) => setZip(e.target.value)} />
          </div>
          <div className="mt-3">
            <Input placeholder="Address" onChange={(e) => setAddress(e.target.value)} />
          </div>
        </div>

        <div className="mx-10 border">
          <h2 className="p-3 bg-gray-200 font-bold text-center">
            Total Cart ({cart?.length})
          </h2>
          <div className="p-4 flex flex-col gap-4">
            <h2 className="font-bold flex justify-between">
              Subtotal : <span>₹{subTotal}</span>
            </h2>
            <hr />
            <h2 className="flex justify-between">
              Delivery : <span>₹{deliveryAmount}</span>
            </h2>
            <h2 className="flex justify-between">
              Tax (9%) : <span>₹{taxAmount.toFixed(2)}</span>
            </h2>
            <hr />
            <h2 className="font-bold flex justify-between">
              Total : <span>₹{total.toFixed(2)}</span>
            </h2>
           {total>5&&  <PayPalButtons
                disabled={!(username&&email&&address&&zip)||loading}
                style={{ layout: "horizontal" }} 
                onApprove={async (data, actions) => {
  await actions.order.capture(); // Mark payment captured
  addToOrder();
   // Create order in your backend
}}

                createOrder={(data,actions)=>{
                  return actions.order.create({
                    purchase_units:[
                      {
                        amount:{
                          value:total.toFixed(2),
                          currency_code:'USD'
                        }
                      }
                    ]
                  })
                }}
                />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutClient;
