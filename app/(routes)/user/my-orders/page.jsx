'use client';
import GlobalApi from '../../../_utils/globalapi';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function MyOrders() {
  const { user } = useUser();
  const [orderList, setOrderList] = useState([]);

  useEffect(() => {
    if (user) {
      GetUserOrders();
    }
  }, [user]);

  const GetUserOrders = () => {
    GlobalApi.GetUserOrders(user?.primaryEmailAddress?.emailAddress)
      .then(resp => {
        console.log('📦 Orders fetched from API:', resp);
        setOrderList(resp?.orders || []);
      })
      .catch(err => {
        console.error('❌ Error fetching orders:', err);
      });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {orderList.map((order, index) => {
          console.log(`🧾 Order ${index + 1}:`, order);
          console.log('🛒 orderDetail:', order?.orderDetail);

          return (
            <div key={order.id || index} className="p-4 border rounded-xl shadow-sm flex flex-col gap-3 bg-white">
              <h2 className="text-md font-semibold">📅 {moment(order?.createdAt).format('DD-MMM-yyyy')}</h2>
              <h2 className="text-sm text-gray-700">
                Order Total Amount: <span className="font-semibold text-black">₹{(order.orderAmount || 0).toFixed(2)}</span>
              </h2>
              <h2 className="text-sm text-gray-700">
                Address: <span className="text-black">{order.address}</span>
              </h2>

              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <h2 className="text-sm text-primary underline">View Order Detail</h2>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3 mt-2">
                      {Array.isArray(order?.orderDetail) && order.orderDetail.length > 0 ? (
                        order.orderDetail.map((item, idx) => {
                          console.log(`🧾 Item ${idx + 1} in Order ${index + 1}:`, item);
                          return (
                            <div key={idx} className="flex justify-between text-sm text-gray-800">
                              <h2>🍽 {item.name || 'Unnamed Item'}</h2>
                              <h2 className="font-medium text-black">₹{item.price?.toFixed(2) || '0.00'}</h2>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-red-600">No order items found.</p>
                      )}
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold text-md mt-2">
                        <span>Total (Incl. Taxes):</span>
                        <span>₹{(order.orderAmount || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyOrders;
