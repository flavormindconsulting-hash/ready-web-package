
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem } from "./types";

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">, openDrawer?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  totalItems: number;
  promoCode: string;
  discountAmount: number;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  shippingEstimate: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_PROMOS: Record<string, number> = {
  HENRO10: 0.1, // 10% off
  WELCOME15: 0.15, // 15% off
  VIP20: 0.2, // 20% off
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem("henro_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedPromo = localStorage.getItem("henro_promo");
      if (savedPromo && VALID_PROMOS[savedPromo]) {
        setPromoCode(savedPromo);
        setDiscountPercent(VALID_PROMOS[savedPromo]);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem("henro_cart", JSON.stringify(cart));
      } catch {
        // ignore
      }
    }
  }, [cart, isMounted]);

  const addToCart = (item: Omit<CartItem, "id">, openDrawer = true) => {
    const id = `${item.productId}-${item.size}-${item.color}`;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, { ...item, id }];
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem("henro_cart");
    } catch {
      // ignore
    }
  };

  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (VALID_PROMOS[cleanCode]) {
      setPromoCode(cleanCode);
      setDiscountPercent(VALID_PROMOS[cleanCode]);
      try {
        localStorage.setItem("henro_promo", cleanCode);
      } catch {
        // ignore
      }
      return { success: true, message: `Promo code applied: ${(VALID_PROMOS[cleanCode] * 100)}% off!` };
    }
    return { success: false, message: "Invalid code. Try 'HENRO10' or 'WELCOME15'" };
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountPercent(0);
    try {
      localStorage.removeItem("henro_promo");
    } catch {
      // ignore
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discountAmount = subtotal * discountPercent;
  const freeShippingThreshold = 150;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingEstimate = subtotal > 0 && subtotal < freeShippingThreshold ? 15 : 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        totalItems,
        promoCode,
        discountAmount,
        applyPromoCode,
        removePromoCode,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        shippingEstimate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
