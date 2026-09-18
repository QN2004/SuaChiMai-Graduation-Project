import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('milk_cart') || '[]'));

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('milk_cart', JSON.stringify(next));
  };

  const addToCart = (product, quantity = 1) => {
    const next = [...items];
    const found = next.find((item) => item.id === product.id);
    if (found) found.quantity = Math.min(Number(product.stock || 999), found.quantity + quantity);
    else next.push({ ...product, quantity });
    persist(next);
  };

  const updateQuantity = (id, quantity) => {
    persist(items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, Math.min(Number(item.stock || 999), quantity)) } : item)));
  };

  const removeItem = (id) => persist(items.filter((item) => item.id !== id));
  const clearCart = () => persist([]);
  const total = items.reduce((sum, item) => sum + Number(item.sale_price || item.price) * item.quantity, 0);

  const value = useMemo(() => ({ items, addToCart, updateQuantity, removeItem, clearCart, total, count: items.reduce((s, i) => s + i.quantity, 0) }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
