import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import Image from "@/compat/next-image";
import Link from "@/compat/next-link";
import { useCart } from "@/lib/cart-context";
import { X, Trash2, ArrowRight, ShieldCheck, Tag, Sparkles } from "lucide-react";

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    promoCode,
    discountAmount,
    applyPromoCode,
    removePromoCode,
    freeShippingThreshold,
    amountNeededForFreeShipping,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; error: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyPromoCode(promoInput);
    setPromoMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setPromoInput("");
    }
  };

  const finalShipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const grandTotal = Math.max(0, subtotal - discountAmount + finalShipping);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div
        className="absolute inset-0 bg-overlay/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md h-[100dvh] bg-background border-l border-border flex flex-col shadow-2xl animate-slide-in">
          
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-foreground">
                Shopping Bag
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {totalItems} {totalItems === 1 ? "piece" : "pieces"} selected
              </p>
            </div>
            <Button variant="atelier"
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Free Shipping Tier Banner */}
          <div className="bg-muted/80 px-6 py-3 border-b border-border/80 text-xs">
            <div className="flex items-center justify-between text-foreground font-medium mb-1.5">
              <span>
                {amountNeededForFreeShipping > 0 ? (
                  <>
                    Add <strong className="text-primary">₹{amountNeededForFreeShipping.toFixed(2)}</strong> for Complimentary Express Courier
                  </>
                ) : (
                  <span className="text-success flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Unlocked: Complimentary Worldwide Express Courier
                  </span>
                )}
              </span>
              <span className="text-muted-foreground font-mono text-[11px]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                  <Tag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-medium tracking-wider text-foreground">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  Discover our slow-woven Oxford shirts, French linen resort wear, and heavyweight overshirts.
                </p>
                <Button variant="atelier"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-xs font-semibold tracking-widest uppercase hover:bg-secondary transition-colors"
                >
                  <Link href="/products">Explore The Collection</Link>
                </Button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-border group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-muted overflow-hidden flex-shrink-0 border border-border">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-medium uppercase tracking-wider text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <Button variant="atelier"
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-2 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <span className="bg-muted px-1.5 py-0.5 rounded border border-border font-mono">
                          Size {item.size}
                        </span>
                        <span>·</span>
                        <span className="text-muted-foreground">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-border rounded bg-muted/60">
                        <Button variant="atelier"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                          aria-label="Decrease quantity"
                        >
                          -
                        </Button>
                        <span className="w-7 text-center text-xs font-mono text-foreground font-semibold">
                          {item.quantity}
                        </span>
                        <Button variant="atelier"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          +
                        </Button>
                      </div>

                      <span className="text-xs font-mono font-medium text-foreground">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with promo code & checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] shrink-0 border-t border-border bg-background space-y-4">
              
              {/* Promo code bar */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-muted px-3 py-2 border border-primary/50 rounded text-xs text-primary">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Tag className="w-3.5 h-3.5" />
                      {promoCode} applied (-₹{discountAmount.toFixed(2)})
                    </span>
                    <Button variant="atelier"
                      onClick={removePromoCode}
                      className="text-muted-foreground hover:text-foreground text-[11px] underline"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code"
                      className="min-w-0 flex-1 bg-muted border border-border text-foreground text-xs px-3 py-2 rounded focus:outline-none focus:border-primary placeholder-muted-foreground font-mono"
                    />
                    <Button variant="atelier"
                      type="submit"
                      className="px-3 py-2 bg-secondary hover:bg-secondary text-foreground text-xs font-medium uppercase tracking-wider rounded transition-colors"
                    >
                      Apply
                    </Button>
                  </form>
                )}
                {promoMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      promoMessage.error ? "text-destructive" : "text-success"
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Voucher Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span>{finalShipping === 0 ? "FREE" : `₹${finalShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-foreground font-semibold pt-2 border-t border-border font-sans tracking-wide">
                  <span className="uppercase tracking-widest text-xs">Estimated Total</span>
                  <span className="font-mono text-base text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout action */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-semibold text-xs tracking-normal uppercase hover:bg-primary/90 transition-colors rounded shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                    Encrypted Atelier Checkout
                  </span>
                  <span>·</span>
                  <span>Complimentary Returns</span>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
