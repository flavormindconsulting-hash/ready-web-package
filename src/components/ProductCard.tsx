import { productImages } from "@/lib/brand-media";
import { Button } from "@/components/ui/button";

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
  const images = productImages(product);

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
      className="group relative flex flex-col bg-background transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted border border-border/60">
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
            <span className="bg-muted/90 text-primary text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 border border-primary/40 backdrop-blur-sm">
              BESTSELLER
            </span>
          )}
          {product.isNew && (
            <span className="bg-primary/90 text-primary-foreground text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 backdrop-blur-sm">
              NEW DROP
            </span>
          )}
          {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
            <span className="bg-background/90 text-foreground text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 border border-border">
              SALE
            </span>
          )}
        </div>

        {/* Quick View Button */}
        {onQuickView && (
          <Button variant="atelier"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            aria-label="Quick preview"
            className="absolute top-3 right-3 p-2 bg-muted/80 hover:bg-muted text-foreground hover:text-foreground rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm z-10 border border-border/60 shadow-lg"
          >
            <Eye className="w-4 h-4" />
          </Button>
        )}

        {/* Quick Add Size Bar (appears on hover) */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-background/95 border-t border-border translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
          <p className="text-[10px] font-medium tracking-widest uppercase text-muted-foreground mb-1.5 text-center">
            {product.inStock && sizes.some((s) => s.stock > 0) ? "Quick Add To Bag" : "Currently unavailable"}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {sizes.map((s) => (
              <Button variant="atelier"
                key={s.size}
                disabled={!product.inStock || s.stock === 0}
                onClick={(e) => handleQuickAdd(s.size, e)}
                className={`min-w-8 h-8 px-1.5 text-[11px] font-mono font-medium border transition-colors flex items-center justify-center ${
                  s.stock === 0
                    ? "border-border text-muted-foreground line-through cursor-not-allowed bg-muted/40"
                    : "border-border bg-muted/90 text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground"
                }`}
                title={s.stock === 0 ? "Out of stock" : `Add size ${s.size}`}
              >
                {s.size}
              </Button>
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
                className="w-2.5 h-2.5 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest ml-1 font-mono">
              {colors.length} {colors.length === 1 ? "shade" : "shades"}
            </span>
          </div>
        )}

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold tracking-normal text-foreground hover:text-primary transition-colors line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Subtitle / Fabric origin */}
        {product.subtitle && (
          <p className="text-[11px] text-muted-foreground tracking-wide line-clamp-2 font-sans">
            {product.subtitle}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs font-mono font-semibold text-foreground">
            ₹{parseFloat(product.price).toFixed(2)}
          </span>
          {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
            <span className="text-xs font-mono text-muted-foreground line-through">
              ₹{parseFloat(product.compareAtPrice).toFixed(2)}
            </span>
          )}
          <span className="text-[10px] text-muted-foreground font-sans tracking-widest uppercase ml-auto">
            {product.fit}
          </span>
        </div>
      </div>
    </div>
  );
};
