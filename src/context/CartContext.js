// src/context/CartContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart from storage when the app starts
  useEffect(() => {
    const saved = localStorage.getItem("shubhCart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    localStorage.setItem("shubhCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size) => {
    const newItem = { 
      ...product, 
      selectedSize: size, 
      cartId: Date.now() // Unique ID for this specific item in cart
    };
    setCart([...cart, newItem]);
    alert("Added to bag!");
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}