
import React, { useState } from "react";
import Link from "@/compat/next-link";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { ArrowRight, Sparkles } from "lucide-react";

interface HomeClientSectionProps {
  featuredProducts: Product[];
  bestsellers: Product[];
}

export const HomeClientSection: React.FC<HomeClientSectionProps> = ({
  featuredProducts,
  bestsellers,
}) => {
  const [activeTab, setActiveTab] = useState<"featured" | "bestsellers">("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const displayList = activeTab === "featured" ? featuredProducts : bestsellers;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-800 pb-6 mb-10 gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300">
            THE ARCHIVE
          </span>
          <h2 className="text-2xl sm:text-4xl font-editorial tracking-wide uppercase text-white mt-1">
            Featured Essentials
          </h2>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-6 text-xs uppercase tracking-[0.2em] font-medium">
          <button
            onClick={() => setActiveTab("featured")}
            className={`py-1 relative transition-colors ${
              activeTab === "featured" ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Curated Drops ({featuredProducts.length})
            {activeTab === "featured" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-300" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("bestsellers")}
            className={`py-1 relative transition-colors ${
              activeTab === "bestsellers" ? "text-white font-semibold" : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            Bestsellers ({bestsellers.length})
            {activeTab === "bestsellers" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-300" />
            )}
          </button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {displayList.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        ))}
      </div>

      {/* Bottom link to view full catalogue */}
      <div className="mt-14 text-center">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-neutral-700 bg-neutral-900/50 hover:bg-neutral-900 text-white text-xs font-semibold tracking-[0.25em] uppercase transition-colors"
        >
          <span>Explore All 12 Tailored Shirts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onOpenSizeGuide={() => {
          setQuickViewProduct(null);
          setSizeGuideOpen(true);
        }}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </section>
  );
};
