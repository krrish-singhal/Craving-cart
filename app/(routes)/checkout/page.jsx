import CheckoutClient from '@/app/_components/CheckoutClient'
import React from 'react'
import { Suspense } from 'react'

function page() {
  return (
    <Suspense>
   <CheckoutClient/>
   </Suspense>
  )
}

export default page