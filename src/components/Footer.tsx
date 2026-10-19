import eagleLogo from "@/assets/henro-eagle-logo.jpg.asset.json";
import { Button } from "@/components/ui/button";

import React, { useEffect, useState } from "react";
import Link from "@/compat/next-link";
import { ArrowRight, ShieldCheck, RefreshCw, Truck, Check, Instagram, Facebook, Twitter, Youtube, MessageCircle } from "lucide-react";

interface SocialLink {
  platform: string;
  label: string;
  url: string;
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  facebook: Facebook,
  x: Twitter,
  youtube: Youtube,
  whatsapp: MessageCircle,
};

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    fetch("/api/social-links")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => Array.isArray(data) && setSocialLinks(data))
      .catch(() => {});
  }, []);
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
    <footer className="isolate bg-background text-foreground border-t border-border mt-0">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div><img src={eagleLogo.url} alt="HENRO gold eagle logo" className="footer-emblem w-44 h-44 object-contain" /><p className="text-sm text-muted-foreground mt-4 max-w-xs">A signature of your own.<br />Considered shirts for everyday life.</p></div>
        <div><h3 className="text-sm font-semibold mb-5">The collection</h3><nav className="flex flex-col gap-3 text-xs opacity-80"><Link href="/products">All shirts</Link><Link href="/products?category=Oxford+%26+Formal">Oxford & formal</Link><Link href="/products?category=Linen+%26+Resort">Linen & resort</Link><Link href="/products?category=Overshirts">Overshirts</Link></nav></div>
        <div><h3 className="text-sm font-semibold mb-5">Your HENRO</h3><nav className="flex flex-col gap-3 text-xs opacity-80"><Link href="/checkout">Shopping bag & checkout</Link><Link href="/admin">Owner sign in</Link><span>Complimentary shipping over ₹150</span><span>7-day returns</span></nav></div>
        <div><h3 className="font-display text-xl mb-3">Stay in the know.</h3><p className="text-xs opacity-75 mb-5">New collections. Fresh perspectives.</p><form onSubmit={handleNewsletter}><div className="flex border-b border-border"><input type="email" aria-label="Newsletter email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="min-w-0 flex-1 bg-transparent text-sm py-3 placeholder:text-muted-foreground outline-none" /><Button variant="atelier" type="submit" disabled={submitting} aria-label="Subscribe" className="px-3"><ArrowRight className="size-5" /></Button></div>{status && <p className="text-xs mt-3" role="status">{status.message}</p>}</form></div>
      </div>
      {socialLinks.length > 0 && (
        <div className="max-w-7xl mx-auto border-t border-border px-6 sm:px-8 py-7 flex items-center justify-center gap-6">
          {socialLinks.map((link) => {
            const Icon = SOCIAL_ICONS[link.platform];
            if (!Icon) return null;
            return (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`HENRO on ${link.label}`}
                title={link.label}
                className="text-foreground/80 hover:text-brand-gold transition-colors"
              >
                <Icon className="size-7" />
              </a>
            );
          })}
        </div>
      )}
      <div className="max-w-7xl mx-auto border-t border-border px-6 sm:px-8 py-6 flex flex-wrap gap-x-6 gap-y-3 justify-between text-[10px] text-muted-foreground"><span>© {new Date().getFullYear()} HENRO. All rights reserved.</span><nav className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/contact">Contact</Link><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms">Terms &amp; Conditions</Link><Link href="/returns-refunds">Return &amp; Refund Policy</Link></nav><span>INDIAN RUPEES / INR ₹</span></div>
      <div className="max-w-7xl mx-auto border-t border-border px-6 sm:px-8 py-5 text-[10px] leading-relaxed text-muted-foreground"><p className="font-semibold uppercase tracking-[0.18em] text-foreground/70 mb-1">Registered office</p><p>HENRO — G - 601, Happy Residency, opposite to Rebounce, Vesu, Surat (Gujarat) - 395007, India</p><p className="mt-1">Support: <a className="underline underline-offset-4" href="mailto:support@henro.in">support@henro.in</a></p></div>
    </footer>
  );
};
