
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

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 flex flex-col shadow-2xl animate-slide-in">
          
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold tracking-[0.2em] uppercase text-white">
                Shopping Bag
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                {totalItems} {totalItems === 1 ? "piece" : "pieces"} selected
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Tier Banner */}
          <div className="bg-neutral-900/80 px-6 py-3 border-b border-neutral-800/80 text-xs">
            <div className="flex items-center justify-between text-neutral-300 font-medium mb-1.5">
              <span>
                {amountNeededForFreeShipping > 0 ? (
                  <>
                    Add <strong className="text-amber-200">${amountNeededForFreeShipping.toFixed(2)}</strong> for Complimentary Express Courier
                  </>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    Unlocked: Complimentary Worldwide Express Courier
                  </span>
                )}
              </span>
              <span className="text-neutral-500 font-mono text-[11px]">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-300 h-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                  <Tag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-medium tracking-wider text-neutral-300">
                  Your bag is currently empty
                </h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
                  Discover our slow-woven Oxford shirts, French linen resort wear, and heavyweight overshirts.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black text-xs font-semibold tracking-widest uppercase hover:bg-neutral-200 transition-colors"
                >
                  <Link href="/products">Explore The Collection</Link>
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-neutral-900 group"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-24 bg-neutral-900 overflow-hidden flex-shrink-0 border border-neutral-800">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-medium uppercase tracking-wider text-neutral-200 hover:text-amber-200 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-500 hover:text-red-400 transition-colors ml-2 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                        <span className="bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800 font-mono">
                          Size {item.size}
                        </span>
                        <span>·</span>
                        <span className="text-neutral-400">{item.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-neutral-800 rounded bg-neutral-900/60">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-neutral-400 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center text-xs font-mono text-neutral-200 font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-6 h-6 flex items-center justify-center text-xs text-neutral-400 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-mono font-medium text-neutral-200">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with promo code & checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-neutral-800 bg-neutral-950 space-y-4">
              
              {/* Promo code bar */}
              <div>
                {promoCode ? (
                  <div className="flex items-center justify-between bg-neutral-900 px-3 py-2 border border-amber-900/50 rounded text-xs text-amber-200">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Tag className="w-3.5 h-3.5" />
                      {promoCode} applied (-${discountAmount.toFixed(2)})
                    </span>
                    <button
                      onClick={removePromoCode}
                      className="text-neutral-400 hover:text-white text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Promo code (e.g. HENRO10)"
                      className="flex-1 bg-neutral-900 border border-neutral-800 text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-300 placeholder-neutral-600 font-mono"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium uppercase tracking-wider rounded transition-colors"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      promoMessage.error ? "text-red-400" : "text-emerald-400"
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-neutral-400 pt-2 border-t border-neutral-900 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-amber-300">
                    <span>Voucher Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Courier</span>
                  <span>{finalShipping === 0 ? "FREE" : `$${finalShipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-white font-semibold pt-2 border-t border-neutral-800 font-sans tracking-wide">
                  <span className="uppercase tracking-widest text-xs">Estimated Total</span>
                  <span className="font-mono text-base text-amber-200">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout action */}
              <div className="space-y-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors rounded shadow-lg"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center gap-4 text-[10px] text-neutral-500 uppercase tracking-widest pt-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
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
