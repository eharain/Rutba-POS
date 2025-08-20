'use client';
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const add = (product) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx].__qty = (copy[idx].__qty || 1) + 1;
        return copy;
      }
      return [...prev, { ...product, __qty: 1 }];
    });
  };

  const remove = (id) => setItems(prev => prev.filter(p => p.id !== id));
  const clear = () => setItems([]);

  const setQty = (id, qty) => {
    setItems(prev => prev.map(p => p.id === id ? { ...p, __qty: Math.max(1, qty) } : p));
  };

  const total = items.reduce((sum, p) => sum + (p.attributes?.selling_price || p.selling_price || 0) * (p.__qty || 1), 0);

  return (
    <CartContext.Provider value={{ items, add, remove, clear, setQty, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
