
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
  applyPromoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromoCode: () => void;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  shippingEstimate: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem("henro_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
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

  const applyPromoCode = async (code: string) => {
    try {
      const r = await fetch("/api/public/promo", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({code,items:cart})});
      const result = await r.json();
      if (!r.ok) return {success:false,message:result.error || "Cannot apply promo code."};
      setPromoCode(result.code); setDiscountAmount(result.discount);
      return {success:true,message:`${result.code} applied: ₹${result.discount.toFixed(2)} off.`};
    } catch {return {success:false,message:"Cannot check promo code. Please try again."};}
  };

  useEffect(() => {
    setPromoCode(""); setDiscountAmount(0);
  }, [cart]);

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountAmount(0);
    try {
      localStorage.removeItem("henro_promo");
    } catch {
      // ignore
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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
