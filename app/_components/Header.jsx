// components/Header.jsx
"use client";

import { useState, useContext, useEffect } from "react";
import { useUser, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/Button";
import { Moon, Sun, Search, ShoppingCart, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import HeaderChatbot from "./HeaderChatbot";
import GlobalApi from "../_utils/globalapi";
import { CartUpdateContext } from "../_context/CartUpdateContext";
import Cart from "./Cart";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { isSignedIn, user } = useUser();
  const { updateCart } = useContext(CartUpdateContext);
  const { theme, setTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      GetUserCart();
    }
  }, [updateCart, user]);

  const GetUserCart = async () => {
    try {
      const resp = await GlobalApi.GetUserCart(user?.primaryEmailAddress?.emailAddress);
      setCart(resp?.userCarts || []);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    }
  };

  return (
    <>
      <HeaderChatbot open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <header className="flex justify-between items-center py-4 px-4 md:px-10 shadow-sm sticky top-0 bg-white dark:bg-gray-900 dark:text-white z-50 transition-colors duration-300">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Craving Cart Logo"
            width={70}
            height={100}
            className="object-contain cursor-pointer rounded-b-full"
          />
        </Link>

        {/* Search */}
        <div className="hidden md:flex items-center border dark:border-gray-700 p-2 rounded-full bg-gray-100 dark:bg-gray-800 w-80">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent w-full px-2 outline-none text-sm dark:text-white"
          />
          <Search className="text-primary h-5 w-5" />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Chatbot Toggle */}
          <button
            onClick={() => setDrawerOpen((prev) => !prev)}
            title="Craving Detective"
            className="ml-2 p-2 rounded-full bg-gradient-to-tr from-green-500 to-green-700 shadow-lg hover:scale-105 transition-transform duration-200 border-2 border-white dark:border-gray-800 flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-700" />}
          </button>

          {/* Cart & User */}
          {isSignedIn ? (
            <div className="flex gap-3 items-center">
              {/* Cart */}
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex gap-2 items-center cursor-pointer">
                    <ShoppingCart />
                    <span className="p-1 px-4 rounded-full bg-slate-200 dark:bg-slate-600 text-sm">
                      {cart?.length || 0}
                    </span>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-4 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg border z-50">
                  <Cart cart={cart} />
                </PopoverContent>
              </Popover>

              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Image
                    src={user?.imageUrl || "/user.png"}
                    alt="User"
                    width={35}
                    height={35}
                    className="rounded-full cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="dark:bg-gray-800 dark:text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/user">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                  <Link href="/user/my-orders">
                    <DropdownMenuItem>My Orders</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem asChild>
                    <SignOutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="outline">Login</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Sign Up</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </header>
    </>
  );
}
