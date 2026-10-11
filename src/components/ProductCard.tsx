
import React, { useState } from "react";
import Link from "@/compat/next-link";
import { Product, ProductSize, ProductColor } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Eye, Check, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Parse images, sizes, colors
  let images: string[] = [];
  try {
    images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
  } catch {
    images = [product.images];
  }

  let sizes: ProductSize[] = [];
  try {
    sizes = typeof product.sizes === "string" ? JSON.parse(product.sizes) : product.sizes;
  } catch {
    sizes = [{ size: "M", stock: 10 }];
  }

  let colors: ProductColor[] = [];
  try {
    colors = typeof product.colors === "string" ? JSON.parse(product.colors || "[]") : product.colors || [];
  } catch {
    colors = [{ name: "Standard", hex: "#FFFFFF" }];
  }

  const primaryImage = images[0] || "/products/classic-white-oxford.jpg";
  const secondaryImage = images[1] || primaryImage;
  const activeColor = colors[0]?.name || "Default";

  const handleQuickAdd = (sizeName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: parseFloat(product.price),
        image: primaryImage,
        size: sizeName,
        color: activeColor,
        quantity: 1,
      },
      true // open drawer
    );

    setSelectedSize(sizeName);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div
      className="group relative flex flex-col bg-neutral-950 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 border border-neutral-800/60">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isBestseller && (
            <span className="bg-neutral-900/90 text-amber-200 text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 border border-amber-800/40 backdrop-blur-sm">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="bg-white/90 text-black text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 backdrop-blur-sm">
              NEW DROP
            </span>
          )}
          {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
            <span className="bg-neutral-950/90 text-neutral-300 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 border border-neutral-800">
              SALE
            </span>
          )}
        </div>

        {/* Quick View Button */}
        {onQuickView && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label="Quick preview"
            className="absolute top-3 right-3 p-2 bg-neutral-900/80 hover:bg-neutral-900 text-neutral-300 hover:text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10 border border-neutral-700/60 shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}

        {/* Quick Add Size Bar (appears on hover) */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <p className="text-[10px] font-medium tracking-widest uppercase text-neutral-400 mb-1.5 text-center">
            Quick Add To Bag
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {sizes.map((s) => (
              <button
                key={s.size}
                disabled={s.stock === 0}
                onClick={(e) => handleQuickAdd(s.size, e)}
                className={`min-w-8 h-8 px-1.5 text-[11px] font-mono font-medium border transition-colors flex items-center justify-center ${
                  s.stock === 0
                    ? "border-neutral-800 text-neutral-600 line-through cursor-not-allowed bg-neutral-900/40"
                    : "border-neutral-700 bg-neutral-900/90 text-neutral-200 hover:border-white hover:bg-white hover:text-black"
                }`}
                title={s.stock === 0 ? "Out of stock" : `Add size ${s.size}`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details info */}
      <div className="pt-3 pb-2 flex flex-col space-y-1">
        {/* Color swatches */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 py-0.5">
            {colors.map((c, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full border border-neutral-700 shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest ml-1 font-mono">
              {colors.length} {colors.length === 1 ? "shade" : "shades"}
            </span>
          </div>
        )}

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="text-xs font-medium tracking-wide uppercase text-neutral-200 hover:text-amber-200 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        {/* Subtitle / Fabric origin */}
        {product.subtitle && (
          <p className="text-[11px] text-neutral-400 tracking-wide line-clamp-1 font-serif italic">
            {product.subtitle}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs font-mono font-semibold text-white">
            ₹{parseFloat(product.price).toFixed(2)}
          </span>
          {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
            <span className="text-xs font-mono text-neutral-500 line-through">
              ₹{parseFloat(product.compareAtPrice).toFixed(2)}
            </span>
          )}
          <span className="text-[10px] text-neutral-400 font-sans tracking-widest uppercase ml-auto">
            {product.fit}
          </span>
        </div>
      </div>
    </div>
  );
};
