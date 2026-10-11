
import React, { useState } from "react";
import Link from "@/compat/next-link";
import { usePathname } from "@/compat/next-navigation";
import { useCart } from "@/lib/cart-context";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: "ALL SHIRTS", href: "/products" },
    { label: "OXFORD & FORMAL", href: "/products?category=Oxford+%26+Formal" },
    { label: "LINEN & RESORT", href: "/products?category=Linen+%26+Resort" },
    { label: "OVERSHIRTS", href: "/products?category=Overshirts" },
    { label: "KNIT & SILK", href: "/products?category=Knit+%26+Polo" },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      {announcementVisible && (
        <div className="bg-neutral-900 border-b border-neutral-800 text-neutral-300 text-[11px] tracking-widest uppercase py-2 px-4 flex items-center justify-between text-center transition-all duration-300">
          <div className="hidden sm:block w-6" />
          <div className="flex-1 text-center font-medium">
            <span>COMPLIMENTARY WORLDWIDE COURIER OVER ₹150</span>
            <span className="mx-2 text-neutral-600">·</span>
            <span className="text-amber-200/90 font-semibold">CODE 'HENRO10' FOR 10% OFF</span>
            <span className="mx-2 text-neutral-600 hidden md:inline">·</span>
            <span className="hidden md:inline text-neutral-400">30-DAY ATELIER RETURNS</span>
          </div>
          <button
            onClick={() => setAnnouncementVisible(false)}
            aria-label="Dismiss announcement"
            className="text-neutral-500 hover:text-neutral-200 transition-colors p-0.5 ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button & Left Desktop Links */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <nav className="hidden lg:flex items-center gap-7 text-[12px] font-medium tracking-[0.16em] uppercase text-neutral-400">
              {navLinks.slice(0, 3).map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`transition-colors hover:text-white relative py-1 ${
                      isActive ? "text-white" : ""
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-200" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Central Luxury Brand Logo */}
          <div className="text-center">
            <Link
              href="/"
              className="font-editorial text-2xl sm:text-3xl font-light tracking-[0.32em] text-white hover:text-neutral-300 transition-colors inline-block"
            >
              HENRO
            </Link>
            <span className="block text-[9px] tracking-[0.35em] text-neutral-500 uppercase font-sans -mt-1">
              HAUTE SHIRTING
            </span>
          </div>

          {/* Right Desktop Nav & Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5">
            <nav className="hidden xl:flex items-center gap-6 text-[12px] font-medium tracking-[0.16em] uppercase text-neutral-400 mr-2">
              {navLinks.slice(3).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition-colors hover:text-white py-1"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search collection"
              className="p-2 text-neutral-300 hover:text-white transition-colors"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Admin Portal Direct Link */}
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] tracking-widest uppercase font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/60 rounded-full hover:bg-amber-900/50 transition-colors"
              title="Open Atelier Admin Panel"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="View Shopping Bag"
              className="relative p-2 text-neutral-300 hover:text-white transition-colors flex items-center gap-2 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform" />
              <span className="text-[11px] font-mono tracking-wider font-semibold text-neutral-300 group-hover:text-amber-200">
                [{totalItems}]
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-neutral-800 bg-neutral-900/95 py-4 px-4 sm:px-8 transition-all animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
              <Search className="w-5 h-5 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shirts by style, weave, linen, oxford, wool..."
                autoFocus
                className="w-full bg-transparent border-none text-white text-sm focus:outline-none placeholder-neutral-500 tracking-wide"
              />
              <button
                type="submit"
                className="text-xs uppercase tracking-widest text-amber-200 font-semibold px-3 py-1.5 hover:underline"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="p-1 text-neutral-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-neutral-950 border-r border-neutral-800 p-6 flex flex-col justify-between z-10 animate-slide-in">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
                <span className="font-editorial text-2xl tracking-[0.25em] text-white">
                  HENRO
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-8 flex flex-col gap-6 text-sm font-medium tracking-[0.2em] uppercase">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white hover:text-amber-200 flex items-center justify-between py-1 border-b border-neutral-900"
                >
                  <span>All Shirts</span>
                  <ArrowRight className="w-4 h-4 text-neutral-600" />
                </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-neutral-400 hover:text-white flex items-center justify-between py-1 border-b border-neutral-900"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-700" />
                  </Link>
                ))}
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-amber-300 font-semibold flex items-center gap-2 pt-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Admin Atelier Panel</span>
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-900 text-xs text-neutral-500 tracking-wider">
              <p className="uppercase font-medium text-neutral-400 mb-1">Maison Henro</p>
              <p>Milano · Okayama · Paris</p>
              <p className="mt-2 text-neutral-600">Complimentary Global Shipping</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
