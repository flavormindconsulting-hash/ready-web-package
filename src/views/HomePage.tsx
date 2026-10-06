import React from "react";
import Link from "@/compat/next-link";
import type { Product } from "@/lib/types";
import { ArrowRight, Sparkles, Check, Star, ShieldCheck, Layers, Scissors, Compass } from "lucide-react";
import { HomeClientSection } from "@/components/HomeClientSection";

export default function HomePage({ featuredProducts, bestsellers }: { featuredProducts: Product[]; bestsellers: Product[] }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
      
      {/* Editorial Campaign Hero */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex items-end justify-start overflow-hidden border-b border-neutral-800">
        {/* Background Image with Cinematic Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero/campaign-hero.jpg"
            alt="Henro Spring Summer 2026 Collection"
            className="w-full h-full object-cover object-[center_35%] scale-100 hover:scale-102 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/20" />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/80 border border-neutral-700/80 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-neutral-200 uppercase">
                SPRING / SUMMER 2026 CAMPAIGN
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-editorial font-light tracking-tight text-white leading-[1.05]">
              The Anatomy <br />
              <span className="italic font-serif text-neutral-300">of Haute</span> Shirting.
            </h1>

            <p className="text-sm sm:text-base text-neutral-300/90 max-w-lg leading-relaxed font-light">
              Slow-woven Albini Italian cottons, French Normandy washed linen, and Japanese selvedge chambray. Engineered for discerning men who notice the 22nd stitch.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="px-8 py-4 bg-white text-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all flex items-center gap-2 group shadow-2xl"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/products?category=Linen+%26+Resort"
                className="px-7 py-4 bg-neutral-900/80 hover:bg-neutral-900 text-white text-xs font-medium tracking-[0.2em] uppercase border border-neutral-700 backdrop-blur-md transition-colors"
              >
                The Linen Edit
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom stats ticker */}
        <div className="absolute bottom-4 right-4 sm:right-8 hidden md:flex items-center gap-6 text-[10px] font-mono tracking-widest text-neutral-400 bg-neutral-950/60 backdrop-blur-md px-4 py-2 border border-neutral-800 rounded">
          <span>ALBINI BERGAMO</span>
          <span>·</span>
          <span>120/2 TWO-PLY</span>
          <span>·</span>
          <span>MOTHER-OF-PEARL</span>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 overflow-hidden py-3">
        <div className="flex whitespace-nowrap gap-8 text-[11px] font-mono tracking-[0.3em] uppercase text-neutral-400 justify-around">
          <span>EGYPTIAN GIZA COTTON</span>
          <span className="text-amber-300">✦</span>
          <span>NORMANDY FRENCH LINEN</span>
          <span className="text-amber-300">✦</span>
          <span>TROCA PEARL BUTTONS</span>
          <span className="text-amber-300">✦</span>
          <span>JAPANESE SHUTTLE WEAVE</span>
          <span className="text-amber-300">✦</span>
          <span>FLOATING INTERLINING</span>
        </div>
      </div>

      {/* Curated Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-neutral-800 pb-6 gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300">
              CURATED EDITIONS
            </span>
            <h2 className="text-2xl sm:text-4xl font-editorial tracking-wide uppercase text-white mt-1">
              Seasonal Typologies
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Typologies</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Oxford & Formal */}
          <Link
            href="/products?category=Oxford+%26+Formal"
            className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-neutral-800"
          >
            <img
              src="/products/classic-white-oxford.jpg"
              alt="Oxford & Formal Shirts"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono tracking-widest text-amber-200 uppercase block mb-1">
                Albini Bergamo 120/2
              </span>
              <h3 className="text-xl font-editorial text-white tracking-wide uppercase">
                The Oxford & Formal Edit
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                Unrivaled collar roll, natural floating interlining, and Australian mother-of-pearl.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-white font-medium group-hover:text-amber-200 transition-colors">
                Discover Formals <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 2: Linen & Resort */}
          <Link
            href="/products?category=Linen+%26+Resort"
            className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-neutral-800"
          >
            <img
              src="/products/washed-olive-linen.jpg"
              alt="Normandy Linen Resort Shirts"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono tracking-widest text-amber-200 uppercase block mb-1">
                Grade-A Normandy Flax
              </span>
              <h3 className="text-xl font-editorial text-white tracking-wide uppercase">
                Raw Linen & Camp Collar
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                Enzyme-washed for cloud-soft handfeel and relaxed Mediterranean drape.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-white font-medium group-hover:text-amber-200 transition-colors">
                Discover Resort <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>

          {/* Card 3: Overshirts & Outerwear */}
          <Link
            href="/products?category=Overshirts"
            className="group relative aspect-[4/5] overflow-hidden bg-neutral-900 border border-neutral-800"
          >
            <img
              src="/products/charcoal-overshirt.jpg"
              alt="Overshirts & Outerwear"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono tracking-widest text-amber-200 uppercase block mb-1">
                380 GSM Prato Wool & Twill
              </span>
              <h3 className="text-xl font-editorial text-white tracking-wide uppercase">
                Overshirts & Layering
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                Heavyweight transitional pieces with cupro-lined sleeves and horn buttons.
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[11px] uppercase tracking-widest text-white font-medium group-hover:text-amber-200 transition-colors">
                Discover Overshirts <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Products Section with Interactive Quick View */}
      <HomeClientSection
        featuredProducts={featuredProducts}
        bestsellers={bestsellers}
      />

      {/* Split Craftsmanship & Heritage Atelier Section */}
      <section className="border-y border-neutral-800 bg-neutral-900/40 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Visual */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-neutral-900 border border-neutral-800">
              <img
                src="/hero/craftsmanship.jpg"
                alt="Henro master tailor at atelier workbench"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-neutral-950/90 border border-neutral-800 p-3 text-[11px] font-mono text-neutral-300 backdrop-blur-sm">
                <span className="text-amber-300 font-semibold">FIG. 04</span> — 22 Stitches Per Inch Lockstitch
              </div>
            </div>

            {/* Content Story */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-amber-300">
                <Scissors className="w-3.5 h-3.5" />
                <span>The Atelier Standard</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-editorial tracking-tight uppercase text-white leading-tight">
                Crafted without compromise, <br />
                from mill to cuff.
              </h2>

              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                In an era of disposable fashion, Henro operates as an architectural shirt maison. Every fabric is sourced directly from heritage family-owned mills in Bergamo, Italy and Okayama, Japan.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-200 flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      The Architectural Collar Roll
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Constructed with a floating un-fused interlining, allowing the collar to sit upright without artificial stiffness.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-200 flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      Genuine Australian Troca Pearl
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Thick 4.0mm buttons carved from natural mother-of-pearl, cross-stitched with crow’s foot security.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-200 flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
                      Split-Yoke Ergonomics
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Two separate pieces of bias-cut fabric at the upper back that contour naturally to your shoulder blades.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-white hover:text-amber-200 transition-colors"
                >
                  <span>Experience The Fit Difference</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Press & Quotes Banner */}
      <section className="py-20 bg-neutral-950 text-center max-w-4xl mx-auto px-4">
        <div className="flex justify-center gap-1 text-amber-300 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-300" />
          ))}
        </div>
        <blockquote className="text-2xl sm:text-3xl font-editorial italic text-neutral-200 leading-snug">
          “Henro has achieved what few modern menswear brands have managed: creating a shirt with the drape of Savile Row bespoke at an accessible echelon.”
        </blockquote>
        <div className="mt-6 text-xs uppercase tracking-[0.25em] text-neutral-500 font-mono">
          THE SARTORIAL EDITORIAL · PARIS FASHION WEEK REVIEW
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative py-24 bg-neutral-900 border-t border-neutral-800 overflow-hidden text-center">
        <div className="max-w-2xl mx-auto px-4 relative z-10 space-y-6">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300">
            DISCOVER YOUR FIT
          </span>
          <h2 className="text-3xl sm:text-5xl font-editorial uppercase text-white tracking-wide">
            Elevate Your Everyday Standard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            Complimentary worldwide express courier on orders over $150. Free returns and 30-day sizing exchanges.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-4 bg-white text-black text-xs font-semibold tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all shadow-xl"
            >
              Shop All Shirts
            </Link>
            <Link
              href="/admin"
              className="px-6 py-4 bg-neutral-950 text-amber-300 text-xs font-mono tracking-[0.2em] uppercase border border-amber-800/60 hover:bg-neutral-800 transition-colors"
            >
              Atelier Admin Portal
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
