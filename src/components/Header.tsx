import React, { useState, useEffect } from 'react';
import Link from '@/compat/next-link';
import { usePathname } from '@/compat/next-navigation';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import logo from '@/assets/henro-logo.png';
import { ShoppingBag, Search, Menu, X, ArrowRight, UserRound } from 'lucide-react';

const links = [
  { label: 'All shirts', href: '/products' },
  { label: 'Oxford & formal', href: '/products?category=Oxford+%26+Formal' },
  { label: 'Linen & resort', href: '/products?category=Linen+%26+Resort' },
  { label: 'Overshirts', href: '/products?category=Overshirts' },
];
export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState('');
  useEffect(() => { setMenu(false); setSearch(false); }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    window.addEventListener('keydown', close);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', close); };
  }, [menu]);
  return <>
    <div className="bg-primary text-primary-foreground text-center text-[10px] sm:text-xs py-2.5 px-4">
      <span>YOUR FIRST HENRO. 10% OFF WITH HENRO10</span>
      <span className="hidden sm:inline"> &nbsp; / &nbsp; COMPLIMENTARY SHIPPING OVER ₹150</span>
    </div>
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
        <div className="min-w-0">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setMenu(true)}><Menu /></Button>
          <nav className="hidden lg:flex gap-6 text-xs font-semibold uppercase">
            {links.slice(0,2).map(l => <Link key={l.href} href={l.href} className="hover:text-muted-foreground">{l.label}</Link>)}
          </nav>
        </div>
        <Link href="/" aria-label="HENRO home"><img src={logo} alt="HENRO" className="brand-logo" /></Link>
        <div className="min-w-0 flex justify-end items-center gap-0 sm:gap-2">
          <nav className="hidden xl:flex text-xs font-semibold uppercase gap-5 mr-4">{links.slice(2).map(l => <Link key={l.href} href={l.href}>{l.label}</Link>)}</nav>
          <Button variant="ghost" size="icon" aria-label="Search collection" title="Search" onClick={() => setSearch(!search)}><Search /></Button>
          <Button asChild variant="ghost" size="icon" className="hidden sm:inline-flex"><Link href="/admin" aria-label="Owner sign in" title="Owner sign in"><UserRound /></Link></Button>
          <Button variant="ghost" className="px-2 shrink-0" aria-label="View Shopping Bag" onClick={() => setIsCartOpen(true)}><ShoppingBag /><span className="text-xs">{totalItems}</span></Button>
        </div>
      </div>
      {search && <form action="/products" className="max-w-3xl mx-auto px-4 py-4 flex min-w-0 items-center gap-2 border-t border-border">
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input name="search" aria-label="Search shirts" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search the collection" autoFocus className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
        <Button type="submit" variant="ghost" size="icon" aria-label="Submit search"><ArrowRight /></Button>
        <Button variant="ghost" size="icon" type="button" aria-label="Close search" onClick={() => setSearch(false)}><X /></Button>
      </form>}
    </header>
    {menu && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Main menu">
      <div className="absolute inset-0 bg-overlay/60" onClick={() => setMenu(false)} />
      <div className="relative bg-background w-[min(88vw,360px)] h-[100dvh] p-6 flex flex-col">
        <div className="flex justify-between items-center border-b border-border pb-5"><img src={logo} alt="HENRO" className="brand-logo" /><Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setMenu(false)}><X /></Button></div>
        <nav className="mt-6 flex-1">{links.map(l => <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="flex items-center justify-between py-5 border-b border-border font-display text-lg">{l.label}<ArrowRight className="size-4" /></Link>)}</nav>
        <Link href="/admin" onClick={() => setMenu(false)} className="flex gap-2 items-center text-xs py-5"><UserRound className="size-4" />Owner sign in</Link>
        <p className="text-xs text-muted-foreground">HENRO / A signature of your own.</p>
      </div>
    </div>}
  </>;
};
