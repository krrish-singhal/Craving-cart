"use client";
import React, { useEffect, useRef, useState } from "react";
import GlobalApi from "../_utils/globalapi";
import Image from "next/image";
import { ArrowRightCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link"; 

function CategoryList() {
  const listRef = useRef(null);
  const [categoryList, setCategoryList] = useState([]);
  const params = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState([]);

  useEffect(() => {
    const category = params.get("category");
    if (category) {
      setSelectedCategory(category);
    }
  }, [params]);

  useEffect(() => {
    getCategoryList();
  }, []);

  const getCategoryList = () => {
    GlobalApi.GetCategory().then((resp) => {
      setCategoryList(resp.categories);
    });
  };

  const scrollRightHandler = () => {
    if (listRef.current) {
      listRef.current.scrollBy({
        left: 250,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative mt-6">
      <div
        className="flex gap-8 overflow-x-auto px-4 scrollbar-hide"
        ref={listRef}
        style={{
          scrollbarWidth: "none", 
          msOverflowStyle: "none", 
        }}
      >
        {categoryList &&
          categoryList.map((category, index) => (
            <Link
              href={`?category=${category.slug}`}
              key={index}
              className={`flex flex-col items-center gap-2 min-w-[96px] ${
                selectedCategory === category.slug
                  ? "p-2 rounded-lg transition-colors duration-300 bg-gray-100"
                  : ""
              }`}
            >
              <Image
                src={category.icon?.url}
                alt={category.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover hover:scale-110 transition duration-300"
              />
              <h2 className="text-sm font-medium text-center w-24 truncate">
                {category.name}
              </h2>
            </Link>
          ))}
      </div>

      {/* Scroll Right Arrow */}
      <ArrowRightCircle
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-full text-gray-700 w-8 h-8 cursor-pointer shadow-md hover:scale-105 transition"
        onClick={scrollRightHandler}
      />
    </div>
  );
}

export default CategoryList;
