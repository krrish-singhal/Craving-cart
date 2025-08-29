import { Button } from '@/components/ui/Button';
import { useUser } from '@clerk/nextjs';
import { SquarePlus } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import GlobalApi from "../../../_utils/globalapi"
import { toast } from 'sonner';
import { CartUpdateContext } from '@/app/_context/CartUpdateContext';

function MenuSection({ restaurant }) {
  const [menuItemList, setMenuItemList] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const {updateCart,setUpdateCart}=useContext(CartUpdateContext)

  useEffect(() => {
    if (restaurant?.menu?.length > 0) {
      FilterMenu(restaurant?.menu[0]?.category);
    }
  }, [restaurant]);

  const FilterMenu = (category) => {
    setLoading(true);
    const result = restaurant?.menu?.filter((item) => item.category === category);
    setTimeout(() => {
      setMenuItemList(result[0]);
      setLoading(false);
    }, 600); 
  };



  const addToCartHandler=(item)=>{
        toast('Adding to Cart')

        const data={
            email:user?.primaryEmailAddress?.emailAddress,
            name:item?.name,
            description:item?.description,
            productImage:item?.productImage?.url,
            price:item?.price,
            restaurantSlug:restaurant.slug,
            
        }
        GlobalApi.AddToCart(data).then(resp=>{
            console.log(resp);
            setUpdateCart(Date.now()); // or increment a counter

            
            toast('Added to Cart')
        },(error)=>{
            toast('Error while adding into the cart')

        })
    }

  return (
    <div className="grid grid-cols-4 mt-2">
      <div className="hidden md:flex flex-col mr-10 gap-2">
        {restaurant?.menu?.map((item, index) => (
          <Button
            variant="ghost"
            key={index}
            className="flex justify-start"
            onClick={() => FilterMenu(item.category)}
          >
            {item.category}
          </Button>
        ))}
      </div>

      <div className="md:col-span-3 col-span-4">
        <h2 className="font-extrabold text-lg">{menuItemList?.category}</h2>

        
        {loading ? (
          <div className="flex items-center justify-center h-52">
            <div className="loader-craving-cart"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            {menuItemList?.menuItem?.map((item, index) => (
              <div
                key={index}
                className="p-2 flex gap-3 border rounded-xl hover:border-primary cursor-pointer transition duration-300 hover:shadow-md"
              >
                <Image
                  src={item?.productImage?.url}
                  alt={item.name}
                  width={120}
                  height={120}
                  className="object-cover w-[120px] h-[120px] rounded-xl"
                />
                <div className="flex flex-col gap-1">
                  <h2 className="font-bold">{item.name}</h2>
                  <h2>₹{item.price}</h2>
                  <h2 className="text-sm text-gray-400 line-clamp-2">{item.description}</h2>
                  <SquarePlus className='cursor-pointer' onClick={() => addToCartHandler(item)} />

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MenuSection;
