import { createContext, useContext, useMemo, useState } from 'react';
import { useUiFeedback } from './UiFeedbackContext';

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
  const { toast } = useUiFeedback();

  const persist = (next) => {
    setItems(next);
    localStorage.setItem('milk_cart', JSON.stringify(next));
  };

  const addToCart = (product, quantity = 1) => {
    const stock = Math.max(0, Number(product.stock) || 0);
    const addQty = Math.max(1, Number(quantity) || 1);
    if (stock <= 0) {
      toast('Sản phẩm hiện đã hết hàng.', 'warning');
      return;
    }
    const next = [...items];
    const found = next.find((item) => item.id === product.id);
    const previousQuantity = found?.quantity || 0;
    if (found) found.quantity = Math.min(stock, found.quantity + addQty);
    else next.push({ ...product, quantity: Math.min(stock, addQty) });
    persist(next);
    const addedQuantity = Math.min(stock, previousQuantity + addQty) - previousQuantity;
    if (addedQuantity > 0) toast(`Đã thêm “${product.name}” vào giỏ hàng.`);
    else toast(`Giỏ hàng đã đạt số lượng tối đa của “${product.name}”.`, 'info');
  };

  const updateQuantity = (id, quantity) => {
    persist(items.map((item) => {
      if (item.id !== id) return item;
      const requested = Number(quantity);
      const safeQuantity = Number.isFinite(requested) ? Math.trunc(requested) : 1;
      return {
        ...item,
        quantity: Math.max(1, Math.min(Number(item.stock || 999), safeQuantity))
      };
    }));
  };

  const removeItem = (id) => persist(items.filter((item) => item.id !== id));
  const clearCart = () => persist([]);
  const total = items.reduce((sum, item) => sum + Number(item.sale_price || item.price) * item.quantity, 0);

  const value = useMemo(() => ({ items, addToCart, updateQuantity, removeItem, clearCart, total, count: items.reduce((s, i) => s + i.quantity, 0) }), [items, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
