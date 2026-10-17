import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

const readCart = () => {
  try {
    const raw = localStorage.getItem('milk_cart');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem('milk_cart');
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('milk_cart', JSON.stringify(next));
  };

  const addToCart = (product, quantity = 1) => {
    const stock = Math.max(0, Number(product.stock) || 0);
    const addQty = Math.max(1, Number(quantity) || 1);
    if (stock <= 0) return;
    const next = [...items];
    const found = next.find((item) => item.id === product.id);
    if (found) found.quantity = Math.min(stock, found.quantity + addQty);
    else next.push({ ...product, quantity: Math.min(stock, addQty) });
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
