import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  img: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_KEY = "cart";
const CART_SIG_KEY = "cart_sig";
const CART_SECRET = "scent-by-atarah-cart-integrity-v1";

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function createSignature(payload: string) {
  return hashString(`${payload}:${CART_SECRET}`);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      const signature = localStorage.getItem(CART_SIG_KEY);
      if (!saved || !signature) return [];
      const expected = createSignature(saved);
      if (signature !== expected) {
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(CART_SIG_KEY);
        console.warn("Cart data integrity check failed: cart cleared to prevent tampering.");
        return [];
      }
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const payload = JSON.stringify(items);
    localStorage.setItem(CART_KEY, payload);
    localStorage.setItem(CART_SIG_KEY, createSignature(payload));
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
