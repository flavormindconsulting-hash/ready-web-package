
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
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400">
      {/* Brand Value Pillars */}
      <div className="border-b border-neutral-900/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-200">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-200">
                Complimentary Courier
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                On all worldwide orders over ₹150
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-200">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-200">
                30-Day Atelier Exchange
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Complimentary size adjustments and prepaid returns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-200">
                Traceable Sartorial Mills
              </h4>
              <p className="text-xs text-neutral-500 mt-0.5">
                Albini Bergamo & Japanese Okayama selvedge
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          
          {/* Brand & Manifesto */}
          <div className="md:col-span-2 space-y-4">
            <div className="font-editorial text-3xl tracking-[0.28em] text-white">
              HENRO
            </div>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              Maison Henro was conceived on a singular tenet: the shirt is the quintessential cornerstone of modern masculinity. We source slow-spun Egyptian Giza cotton and French Normandy flax, finished with Australian mother-of-pearl buttons.
            </p>
            <div className="pt-2 text-[11px] text-neutral-500 tracking-widest uppercase font-mono">
              Bergamo · Okayama · Prato · Paris
            </div>
          </div>

          {/* Nav Column 1 */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/products?category=Oxford+%26+Formal" className="hover:text-white transition-colors">
                  Oxford & Dress
                </Link>
              </li>
              <li>
                <Link href="/products?category=Linen+%26+Resort" className="hover:text-white transition-colors">
                  Normandy Linen
                </Link>
              </li>
              <li>
                <Link href="/products?category=Overshirts" className="hover:text-white transition-colors">
                  Wool & Flannel Overshirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=Casual+Poplin" className="hover:text-white transition-colors">
                  Selvedge Chambray
                </Link>
              </li>
              <li>
                <Link href="/products?category=Knit+%26+Polo" className="hover:text-white transition-colors">
                  Cashmere-Cotton Knits
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              Atelier Services
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  All Shirts Index
                </Link>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Bespoke Monogramming</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Collar Stiffeners</span>
              </li>
              <li>
                <span className="text-neutral-500 cursor-default">Fabric Swatch Archive</span>
              </li>
              <li>
                <Link href="/admin" className="text-amber-300 hover:text-amber-200 transition-colors font-medium">
                  Atelier Admin Portal →
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h5 className="text-xs font-semibold uppercase tracking-widest text-white mb-4">
              The Atelier Gazette
            </h5>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Receive private invitations to seasonal drops, fabric archives, and sartorial notes.
            </p>
            <form onSubmit={handleNewsletter} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-500 pr-9"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {status && (
                <p
                  className={`text-[11px] ${
                    status.success ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} HENRO SARTORIAL MAISON. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6 text-[11px] tracking-wider uppercase font-mono">
            <Link href="/products" className="hover:text-neutral-300">Catalogue</Link>
            <span>·</span>
            <Link href="/checkout" className="hover:text-neutral-300">Checkout</Link>
            <span>·</span>
            <Link href="/admin" className="text-amber-400 hover:text-amber-300">Admin Control</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
