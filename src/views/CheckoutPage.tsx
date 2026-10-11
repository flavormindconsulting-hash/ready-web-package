
import React, { useState } from "react";
import Link from "@/compat/next-link";
import { useRouter } from "@/compat/next-navigation";
import { useCart } from "@/lib/cart-context";
import {
  ShieldCheck,
  Lock,
  ArrowRight,
  Truck,
  CreditCard,
  CheckCircle,
  Tag,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discountAmount,
    promoCode,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useCart();

  // Customer & Shipping Form State
  const [formData, setFormData] = useState({
    name: "Alexander Wright",
    email: "a.wright@alpinestudio.com",
    phone: "+1 (212) 555-0198",
    address: "740 Park Avenue, Apt 11B",
    city: "New York",
    state: "NY",
    postalCode: "10021",
    country: "United States",
  });

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "atelier">(
    "standard"
  );

  // Payment Form State
  const [cardData, setCardData] = useState({
    cardNumber: "4242 •••• •••• 4242",
    cardExpiry: "08/28",
    cardCvc: "892",
    cardName: "Alexander Wright",
  });

  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Shipping cost calculation
  const getShippingCost = () => {
    if (shippingMethod === "express") return 15;
    if (shippingMethod === "atelier") return 25;
    // Standard: free if over ₹150, else ₹15
    return subtotal >= 150 ? 0 : 15;
  };

  const shippingCost = getShippingCost();
  const estimatedTax = (subtotal - discountAmount) * 0.08;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + estimatedTax);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFillDemoCard = () => {
    setCardData({
      cardNumber: "4242 4242 4242 4242",
      cardExpiry: "12/28",
      cardCvc: "789",
      cardName: formData.name || "Alexander Wright",
    });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMsg({ text: res.message, error: !res.success });
    if (res.success) setPromoInput("");
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      setErrorMessage("Your shopping bag is empty");
      return;
    }

    if (!formData.name || !formData.email || !formData.address) {
      setErrorMessage("Please complete all required shipping fields");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const shippingMethodName =
        shippingMethod === "atelier"
          ? "White Glove Atelier Delivery"
          : shippingMethod === "express"
          ? "Express Priority Courier"
          : "Standard Courier";

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          shippingAddress: `${formData.address}, ${formData.state || ""}`,
          shippingCity: formData.city,
          shippingPostalCode: formData.postalCode,
          shippingCountry: formData.country,
          shippingMethod: shippingMethodName,
          shippingCost: shippingCost,
          subtotal: subtotal,
          discount: discountAmount,
          tax: estimatedTax,
          total: grandTotal,
          promoCode: promoCode || null,
          items: cart,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();
        router.push(`/checkout/success/${data.orderId}`);
      } else {
        setErrorMessage(data.error || "Failed to process order. Please try again.");
      }
    } catch {
      setErrorMessage("A connection error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="w-16 h-16 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500 mb-4">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-editorial tracking-wider uppercase text-white mb-2">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-neutral-400 max-w-sm mb-6">
          Explore our collection of Italian oxfords, Normandy washed linen, and heavyweight overshirts.
        </p>
        <Link
          href="/products"
          className="px-8 py-3.5 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors"
        >
          Explore Shirts
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-neutral-800">
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Return to Boutique</span>
          </Link>

          <div className="text-center">
            <span className="font-editorial text-2xl tracking-[0.3em] text-white">
              HENRO
            </span>
            <span className="block text-[9px] tracking-[0.3em] text-neutral-500 uppercase font-mono">
              SECURE ATELIER CHECKOUT
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">256-Bit SSL Encrypted</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Checkout Details (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Step 1: Contact Information */}
              <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-300 text-black text-xs font-mono font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-white">
                      Customer Contact
                    </h2>
                  </div>
                  <span className="text-[10px] text-neutral-500 uppercase font-mono">Guest / Member</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Lord Julian Vance"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Email Address (for receipt & tracking) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="julian@domain.com"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Phone Number (for Courier SMS delivery notifications)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Destination */}
              <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-300 text-black text-xs font-mono font-bold flex items-center justify-center">
                    2
                  </span>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white">
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street name, suite or penthouse"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      State / Region / Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="NY"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Postal / ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="10021"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Japan">Japan</option>
                      <option value="Germany">Germany</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Courier Selection */}
              <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-300 text-black text-xs font-mono font-bold flex items-center justify-center">
                    3
                  </span>
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-white">
                    Delivery Speed & Packaging
                  </h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                      shippingMethod === "standard"
                        ? "border-amber-300 bg-neutral-900/90"
                        : "border-neutral-800 hover:border-neutral-700 bg-neutral-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="text-amber-300 focus:ring-0"
                      />
                      <div>
                        <div className="text-xs font-medium uppercase text-white">
                          Standard Courier (3-5 Business Days)
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Recycled archival box with acid-free tissue
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white">
                      {subtotal >= 150 ? "FREE" : "₹15.00"}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                      shippingMethod === "express"
                        ? "border-amber-300 bg-neutral-900/90"
                        : "border-neutral-800 hover:border-neutral-700 bg-neutral-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="text-amber-300 focus:ring-0"
                      />
                      <div>
                        <div className="text-xs font-medium uppercase text-white">
                          Express Priority (1-2 Business Days)
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          DHL Express with direct signature required
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white">₹15.00</span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 border rounded cursor-pointer transition-colors ${
                      shippingMethod === "atelier"
                        ? "border-amber-300 bg-neutral-900/90"
                        : "border-neutral-800 hover:border-neutral-700 bg-neutral-950"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        checked={shippingMethod === "atelier"}
                        onChange={() => setShippingMethod("atelier")}
                        className="text-amber-300 focus:ring-0"
                      />
                      <div>
                        <div className="text-xs font-medium uppercase text-amber-200">
                          White Glove Atelier Delivery + Wooden Hanger
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Hand-pressed, cedarwood hanger, dust bag included
                        </div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-white">₹25.00</span>
                  </label>
                </div>
              </div>

              {/* Step 4: Payment Simulation */}
              <div className="p-6 bg-neutral-900/40 border border-neutral-800 rounded space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-300 text-black text-xs font-mono font-bold flex items-center justify-center">
                      4
                    </span>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-white">
                      Payment Simulation
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemoCard}
                    className="text-[10px] font-mono text-amber-300 border border-amber-900 bg-amber-950/40 px-2 py-0.5 rounded hover:bg-amber-900/50 uppercase tracking-widest flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Auto-Fill Test Card
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardData.cardNumber}
                        onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300 font-mono tracking-wider pl-9"
                      />
                      <CreditCard className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        Expires (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardData.cardExpiry}
                        onChange={(e) => setCardData({ ...cardData, cardExpiry: e.target.value })}
                        placeholder="12/28"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300 font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cardCvc}
                        onChange={(e) => setCardData({ ...cardData, cardCvc: e.target.value })}
                        placeholder="892"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300 font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 bg-neutral-900/60 border border-neutral-800 rounded p-6 space-y-6">
                
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white border-b border-neutral-800 pb-3">
                  Order Summary ({cart.length} {cart.length === 1 ? "shirt" : "shirts"})
                </h3>

                {/* Items preview */}
                <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <div className="w-14 h-16 bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <p className="font-medium uppercase text-neutral-200 line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            Size {item.size} · {item.color} · Qty {item.quantity}
                          </p>
                        </div>
                        <span className="font-mono text-neutral-200">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo code */}
                <div className="pt-2 border-t border-neutral-800">
                  {promoCode ? (
                    <div className="flex items-center justify-between bg-neutral-950 px-3 py-2 border border-amber-900/60 rounded text-xs text-amber-200">
                      <span className="flex items-center gap-1.5 font-mono">
                        <Tag className="w-3.5 h-3.5" />
                        {promoCode} applied (-₹{discountAmount.toFixed(2)})
                      </span>
                      <button
                        type="button"
                        onClick={removePromoCode}
                        className="text-neutral-400 hover:text-white text-[11px] underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="Voucher code (HENRO10)"
                        className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-3 py-1.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-amber-300 font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleApplyPromo}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs uppercase font-medium rounded transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {promoMsg && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        promoMsg.error ? "text-red-400" : "text-emerald-400"
                      }`}
                    >
                      {promoMsg.text}
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-amber-300">
                      <span>Promotional Discount</span>
                      <span>-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Courier Delivery</span>
                    <span>{shippingCost === 0 ? "FREE" : `₹₹{shippingCost.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span>₹{estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white font-semibold text-base pt-3 border-t border-neutral-800 font-sans tracking-wide">
                    <span className="uppercase text-xs tracking-widest">Total Due</span>
                    <span className="font-mono text-amber-200">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Securing Order...</span>
                  ) : (
                    <>
                      <span>Complete Atelier Purchase</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Complimentary 30-Day Exchanges</span>
                </div>

              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
