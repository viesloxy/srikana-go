import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("srikanago_cart") || "[]");
    } catch {
      return [];
    }
  });
  const [activeTenant, setActiveTenant] = useState(null);

  useEffect(() => {
    localStorage.setItem("srikanago_cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (menu, tenantId, tenantName) => {
    if (activeTenant && activeTenant.id !== tenantId) {
      if (!window.confirm("Keranjang Anda berisi item dari tenant lain. Kosongkan dan mulai baru?")) return;
      clearCart();
    }
    setActiveTenant({ id: tenantId, nama: tenantName });
    setCart((prev) => {
      const existing = prev.find((i) => i.id_menu === menu.id_menu);
      if (existing) {
        return prev.map((i) =>
          i.id_menu === menu.id_menu ? { ...i, qty: i.qty + 1, subtotal: (i.qty + 1) * i.harga } : i
        );
      }
      return [...prev, { ...menu, qty: 1, subtotal: menu.harga }];
    });
  };

  const removeItem = (id_menu) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id_menu !== id_menu);
      if (updated.length === 0) setActiveTenant(null);
      return updated;
    });
  };

  const updateQty = (id_menu, qty) => {
    if (qty < 1) { removeItem(id_menu); return; }
    setCart((prev) =>
      prev.map((i) =>
        i.id_menu === id_menu ? { ...i, qty, subtotal: qty * i.harga } : i
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveTenant(null);
  };

  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, activeTenant, addItem, removeItem, updateQty, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
