import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import starImage from '../../public/star.png';

function BusinessItem({ business }) {
  return (
    <Link
      href={'/restaurant/' + business?.slug}
      className='group p-3 rounded-2xl border border-transparent 
      hover:border-primary hover:bg-orange-50 transition-all duration-300 
      shadow-sm hover:shadow-lg cursor-pointer bg-white transform hover:-translate-y-1'
    >
      {/* Image Container */}
      <div className='w-full h-[160px] relative rounded-xl overflow-hidden'>
        <Image
          src={business.banner?.url || '/placeholder.jpg'}
          alt={business.name}
          fill
          className='object-[center_top] group-hover:scale-105 transition-transform duration-500 ease-in-out'
        />
      </div>

      {/* Content */}
      <div className='mt-3'>
        <h2 className='font-bold text-lg text-gray-800 truncate'>{business.name}</h2>

        <div className='flex justify-between items-center mt-1'>
          {/* Rating + Type */}
          <div className='flex items-center gap-2'>
            <Image src={starImage} alt='star' width={14} height={14} />
            <span className='text-gray-500 text-sm'>4.5</span>
            <span className='text-gray-400 text-sm'>
              • {business?.restroType?.[0] || 'Restaurant'}
            </span>
          </div>

          {/* Category */}
          <span className='text-sm text-primary font-medium'>
            {business?.categories?.[0]?.name || 'Other'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default BusinessItem;
