
import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "@/compat/next-navigation";
import { Product, ProductSize } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { QuickViewModal } from "@/components/QuickViewModal";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import {
  SlidersHorizontal,
  X,
  ChevronDown,
  LayoutGrid,
  Columns2,
  RotateCcw,
  Search,
} from "lucide-react";

interface ProductsClientCatalogProps {
  initialProducts: Product[];
}

export const ProductsClientCatalog: React.FC<ProductsClientCatalogProps> = ({
  initialProducts,
}) => {
  const searchParams = useSearchParams();

  // URL query params
  const initialCategory = searchParams.get("category") || "All";
  const initialFit = searchParams.get("fit") || "All";
  const initialSearch = searchParams.get("search") || "";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFit, setSelectedFit] = useState<string>(initialFit);
  const [selectedSize, setSelectedSize] = useState<string>("All");
  const [priceRange, setPriceRange] = useState<string>("All"); // 'All', 'under150', '150to180', 'over180'
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [gridColumns, setGridColumns] = useState<4 | 2>(4);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Modals
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Sync state if URL query params change
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get("search");
    if (search !== null) setSearchQuery(search);
  }, [searchParams]);

  const categories = [
    "All",
    "Oxford & Formal",
    "Linen & Resort",
    "Overshirts",
    "Casual Poplin",
    "Knit & Polo",
  ];

  const fits = ["All", "Tailored Fit", "Relaxed Fit", "Classic Fit", "Oversized Fit"];
  const sizes = ["All", "S", "M", "L", "XL", "XXL"];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        // Category
        if (selectedCategory !== "All" && product.category !== selectedCategory) {
          return false;
        }

        // Fit
        if (selectedFit !== "All" && product.fit !== selectedFit) {
          return false;
        }

        // In Stock
        if (inStockOnly && !product.inStock) {
          return false;
        }

        // Price
        const price = parseFloat(product.price);
        if (priceRange === "under150" && price >= 150) return false;
        if (priceRange === "150to180" && (price < 150 || price > 180)) return false;
        if (priceRange === "over180" && price <= 180) return false;

        // Size availability
        if (selectedSize !== "All") {
          try {
            const productSizes: ProductSize[] =
              typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
            const hasStock = productSizes.some(
              (s) => s.size === selectedSize && s.stock > 0
            );
            if (!hasStock) return false;
          } catch {
            // ignore
          }
        }

        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchMaterial = product.material.toLowerCase().includes(q);
          const matchCategory = product.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchMaterial && !matchCategory) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);

        if (sortBy === "price-asc") return priceA - priceB;
        if (sortBy === "price-desc") return priceB - priceA;
        if (sortBy === "name-asc") return a.name.localeCompare(b.name);
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // Default: featured first, then bestsellers
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [
    initialProducts,
    selectedCategory,
    selectedFit,
    selectedSize,
    priceRange,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (selectedFit !== "All" ? 1 : 0) +
    (selectedSize !== "All" ? 1 : 0) +
    (priceRange !== "All" ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedFit("All");
    setSelectedSize("All");
    setPriceRange("All");
    setInStockOnly(false);
    setSearchQuery("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Title & Collection Hero Header */}
      <div className="border-b border-neutral-800 pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300">
              HAUTE SHIRTING ATELIER
            </span>
            <h1 className="text-3xl sm:text-5xl font-editorial tracking-tight uppercase text-white mt-1">
              Men's Shirt Archive
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl font-light">
              Crafted with Italian 120/2 two-ply yarn, Normandy flax, and Okayama selvedge denim. Explore all architectural fits and weaves.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs font-mono uppercase tracking-wider text-amber-200 border border-amber-900/60 bg-amber-950/20 px-3 py-1.5 hover:bg-amber-900/40 rounded transition-colors"
            >
              Size & Fit Predictor
            </button>
          </div>
        </div>

        {/* Category Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-widest font-medium whitespace-nowrap border transition-all ${
                selectedCategory === cat
                  ? "border-white bg-white text-black font-semibold shadow-md"
                  : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white hover:border-neutral-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Control Bar: Filters toggle, Active count, Sorting, Grid switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-6 border-b border-neutral-900 text-xs">
        {/* Left: Mobile filter button & active filters indicator */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 text-white rounded font-medium uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}</span>
          </button>

          <span className="text-neutral-400 font-mono text-[11px]">
            Showing <strong className="text-white">{filteredProducts.length}</strong> of{" "}
            {initialProducts.length} shirts
          </span>

          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="hidden sm:flex items-center gap-1 text-[11px] text-amber-300 hover:underline uppercase tracking-wider"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          )}
        </div>

        {/* Right: Search box, Sort Dropdown & Column switcher */}
        <div className="flex items-center gap-3 ml-auto">
          {/* Quick filter input */}
          <div className="relative hidden sm:block">
            <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword..."
              className="bg-neutral-900 border border-neutral-800 rounded pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-neutral-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5">
            <span className="text-neutral-500 uppercase tracking-widest text-[10px] hidden md:inline">
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-neutral-200 text-xs focus:outline-none uppercase tracking-wider cursor-pointer"
            >
              <option value="featured" className="bg-neutral-900 text-white">Featured Atelier</option>
              <option value="price-asc" className="bg-neutral-900 text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-neutral-900 text-white">Price: High to Low</option>
              <option value="newest" className="bg-neutral-900 text-white">Newest Additions</option>
              <option value="name-asc" className="bg-neutral-900 text-white">Name: A to Z</option>
            </select>
          </div>

          {/* Grid Layout Switcher */}
          <div className="hidden md:flex items-center border border-neutral-800 rounded bg-neutral-900 p-0.5">
            <button
              onClick={() => setGridColumns(4)}
              className={`p-1.5 rounded transition-colors ${
                gridColumns === 4 ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
              title="4 Columns Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridColumns(2)}
              className={`p-1.5 rounded transition-colors ${
                gridColumns === 2 ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
              title="2 Columns Editorial"
            >
              <Columns2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Desktop Sidebar Filters + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block lg:col-span-1 space-y-8 pr-4">
          
          {/* Fit Filter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">
              Silhouette & Fit
            </h3>
            <div className="space-y-1.5">
              {fits.map((fit) => (
                <button
                  key={fit}
                  onClick={() => setSelectedFit(fit)}
                  className={`w-full text-left text-xs py-1 px-2 rounded transition-colors flex items-center justify-between ${
                    selectedFit === fit
                      ? "text-white bg-neutral-900 font-medium"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <span>{fit}</span>
                  {selectedFit === fit && <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">
              Sizes In Stock
            </h3>
            <div className="grid grid-cols-3 gap-1.5">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`py-1.5 text-xs font-mono border rounded transition-colors ${
                    selectedSize === s
                      ? "border-white bg-white text-black font-bold"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-3">
              Price Range
            </h3>
            <div className="space-y-1.5">
              {[
                { label: "All Prices", val: "All" },
                { label: "Under ₹150", val: "under150" },
                { label: "₹150 - ₹180", val: "150to180" },
                { label: "₹180 & Above", val: "over180" },
              ].map((p) => (
                <button
                  key={p.val}
                  onClick={() => setPriceRange(p.val)}
                  className={`w-full text-left text-xs py-1 px-2 rounded transition-colors flex items-center justify-between ${
                    priceRange === p.val
                      ? "text-white bg-neutral-900 font-medium"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <span>{p.label}</span>
                  {priceRange === p.val && <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />}
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Toggle */}
          <div className="pt-4 border-t border-neutral-900">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-900 text-amber-300 focus:ring-0"
              />
              <span className="text-xs uppercase tracking-wider text-neutral-300">
                In-Stock Ready to Ship
              </span>
            </label>
          </div>

          {/* Fabric mill note */}
          <div className="p-4 bg-neutral-900/50 border border-neutral-800/80 rounded text-[11px] text-neutral-400 space-y-2">
            <span className="text-amber-200 uppercase font-mono tracking-widest block font-semibold">
              The Henro Promise
            </span>
            <p>
              Every shirt ships in our bespoke rigid black archival gift box with complimentary collar stays.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-24 bg-neutral-900/30 border border-neutral-800 rounded p-8 space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-500">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-editorial uppercase tracking-wide text-white">
                No matching shirts found
              </h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Try loosening your filters or resetting the price and fit selections.
              </p>
              <button
                onClick={resetFilters}
                className="px-6 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-6 sm:gap-8 ${
                gridColumns === 4
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-neutral-950 border-l border-neutral-800 p-6 flex flex-col justify-between z-10 animate-slide-in">
            <div className="overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
                  Filter Shirts
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Fit */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Fit</h4>
                <div className="space-y-1">
                  {fits.map((fit) => (
                    <button
                      key={fit}
                      onClick={() => setSelectedFit(fit)}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded ${
                        selectedFit === fit ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400"
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Size</h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-1.5 text-xs font-mono border rounded ${
                        selectedSize === s
                          ? "border-white bg-white text-black font-bold"
                          : "border-neutral-800 bg-neutral-900 text-neutral-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs uppercase tracking-widest text-neutral-400 mb-2">Price</h4>
                <div className="space-y-1">
                  {[
                    { label: "All Prices", val: "All" },
                    { label: "Under ₹150", val: "under150" },
                    { label: "₹150 - ₹180", val: "150to180" },
                    { label: "₹180 & Above", val: "over180" },
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => setPriceRange(p.val)}
                      className={`w-full text-left text-xs py-1.5 px-2 rounded ${
                        priceRange === p.val ? "bg-neutral-800 text-white font-semibold" : "text-neutral-400"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-900 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest"
              >
                Apply Filters ({filteredProducts.length})
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2 text-neutral-400 text-xs uppercase tracking-wider"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};
