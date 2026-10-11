import logo from "@/assets/henro-logo.png";
import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import Link from "@/compat/next-link";
import { ArrowRight, ShieldCheck, RefreshCw, Truck, Check } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ message: string; success: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ message: data.message || "Subscribed successfully.", success: true });
        setEmail("");
      } else {
        setStatus({ message: data.error || "Subscription failed.", success: false });
      }
    } catch {
      setStatus({ message: "Network error. Please try again.", success: false });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div><img src={logo} alt="HENRO" className="w-24 h-20 object-contain brightness-0 invert" /><p className="text-sm opacity-75 mt-4 max-w-xs">A signature of your own.<br />Considered shirts for everyday life.</p></div>
        <div><h3 className="text-sm font-semibold mb-5">The collection</h3><nav className="flex flex-col gap-3 text-xs opacity-80"><Link href="/products">All shirts</Link><Link href="/products?category=Oxford+%26+Formal">Oxford & formal</Link><Link href="/products?category=Linen+%26+Resort">Linen & resort</Link><Link href="/products?category=Overshirts">Overshirts</Link></nav></div>
        <div><h3 className="text-sm font-semibold mb-5">Your HENRO</h3><nav className="flex flex-col gap-3 text-xs opacity-80"><Link href="/checkout">Shopping bag & checkout</Link><Link href="/admin">Owner sign in</Link><span>Complimentary shipping over ₹150</span><span>30-day returns</span></nav></div>
        <div><h3 className="font-display text-xl mb-3">Stay in the know.</h3><p className="text-xs opacity-75 mb-5">New collections. Fresh perspectives.</p><form onSubmit={handleNewsletter}><div className="flex border-b border-primary-foreground/40"><input type="email" aria-label="Newsletter email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm py-3 placeholder:text-primary-foreground/60 outline-none" /><Button variant="atelier" type="submit" disabled={submitting} aria-label="Subscribe" className="px-3"><ArrowRight className="size-5" /></Button></div>{status && <p className="text-xs mt-3" role="status">{status.message}</p>}</form></div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-primary-foreground/20 px-6 sm:px-8 py-6 flex flex-wrap gap-3 justify-between text-[10px] opacity-65"><span>© {new Date().getFullYear()} HENRO. All rights reserved.</span><span>INDIAN RUPEES / INR ₹</span></div>
    </footer>
  );
};
