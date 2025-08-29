"use client"

import React, { useState } from 'react'
import Header from './_components/Header'
import { Toaster } from 'sonner'
import { CartUpdateContext } from './_context/CartUpdateContext'

function Provider( {children}) {
  const  [updateCart, setUpdateCart] = useState(null)
  return (
     <CartUpdateContext.Provider value={{updateCart,setUpdateCart}}>
    <div>
     
        <Header/>
        <Toaster/>
             {children}
    
    </div>
  </CartUpdateContext.Provider>
    
  )
}

export default Provider