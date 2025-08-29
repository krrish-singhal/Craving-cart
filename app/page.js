
'use client';

import { Suspense } from "react";
import CategoryList from "./_components/CategoryList";
import BusinessList from "./_components/BuisnessList";




export default function Home() {
  return (
    <div>
       <Suspense fallback={<div>Loading restaurants...</div>}>
      <CategoryList />
      
 
     
        <BusinessList />
 
      </Suspense>
    </div>
  );
}
