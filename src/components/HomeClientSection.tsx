import { Button } from "@/components/ui/button";

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-6 mb-10 gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">
            THE HENRO SELECTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-editorial tracking-wide uppercase text-foreground mt-1">
            Featured Essentials
          </h2>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-4 text-xs uppercase tracking-normal font-medium">
          <Button variant="atelier"
            onClick={() => setActiveTab("featured")}
            className={`py-1 relative transition-colors ${
              activeTab === "featured" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            New favourites ({featuredProducts.length})
            {activeTab === "featured" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary" />
            )}
          </Button>

          <Button variant="atelier"
            onClick={() => setActiveTab("bestsellers")}
            className={`py-1 relative transition-colors ${
              activeTab === "bestsellers" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Bestsellers ({bestsellers.length})
            {activeTab === "bestsellers" && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary" />
            )}
          </Button>
        </div>
      </div>

      {/* Grid of Product Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
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
          className="inline-flex items-center gap-2 px-8 py-3.5 border border-border bg-muted/50 hover:bg-muted text-foreground text-xs font-semibold tracking-[0.25em] uppercase transition-colors"
        >
          <span>Shop the full collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        key={quickViewProduct?.id ?? 'empty'}
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
