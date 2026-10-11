import { productImages } from "@/lib/brand-media";
import { Button } from "@/components/ui/button";

import React, { useState } from "react";
import Link from "@/compat/next-link";
import { Product, ProductSize, ProductColor } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { X, Check, ArrowRight, ShieldCheck, Ruler } from "lucide-react";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenSizeGuide?: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onOpenSizeGuide,
}) => {
  const { addToCart } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [added, setAdded] = useState(false);

  if (!product) return null;

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

  let detailsList: string[] = [];
  try {
    detailsList = typeof product.details === "string" ? JSON.parse(product.details || "[]") : product.details || [];
  } catch {
    detailsList = [];
  }

  const currentColor = selectedColor || colors[0]?.name || "Standard";

  const handleAddToCart = () => {
    if (!product.inStock || !sizes.some((s) => s.stock > 0)) return;
    if (!selectedSize) {
      setErrorMsg("Please select a size");
      return;
    }
    setErrorMsg("");

    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: parseFloat(product.price),
        image: images[selectedImageIndex] || images[0] || "",
        size: selectedSize,
        color: currentColor,
        quantity,
      },
      true
    );

    onClose();
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-overlay/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90dvh] overflow-y-auto bg-background border border-border text-foreground shadow-2xl rounded-sm z-10 animate-fade-in my-8">
        {/* Close Button */}
        <Button variant="atelier"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-muted-foreground hover:text-foreground bg-muted/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery side */}
          <div className="p-6 bg-muted/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted border border-border">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <Button variant="atelier"
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 flex-shrink-0 border overflow-hidden ${
                      selectedImageIndex === idx ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground mb-1">
                <span>{product.category}</span>
                <span>·</span>
                <span className="text-primary">{product.fit}</span>
              </div>

              <h2 className="text-lg md:text-xl font-editorial tracking-wide uppercase text-foreground font-medium">
                {product.name}
              </h2>

              {product.subtitle && (
                <p className="text-xs text-muted-foreground font-sans mt-1">
                  {product.subtitle}
                </p>
              )}

              <div className="flex items-center gap-3 mt-3">
                <span className="text-lg font-mono font-semibold text-foreground">
                  ₹{parseFloat(product.price).toFixed(2)}
                </span>
                {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <span className="text-sm font-mono text-muted-foreground line-through">
                    ₹{parseFloat(product.compareAtPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mt-4 line-clamp-3">
                {product.description}
              </p>

              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex flex-wrap gap-2 justify-between items-center text-xs mb-2">
                    <span className="uppercase tracking-widest text-muted-foreground text-[11px]">
                      Color: <strong className="text-foreground">{currentColor}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {colors.map((c, i) => (
                      <Button variant="atelier"
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border p-0.5 flex items-center justify-center transition-all ${
                          currentColor === c.name ? "border-primary scale-110" : "border-border opacity-70 hover:opacity-100"
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex flex-wrap gap-2 justify-between items-center text-xs mb-2">
                  <span className="uppercase tracking-widest text-muted-foreground text-[11px]">
                    Size: <strong className="text-foreground">{selectedSize || "Select"}</strong>
                  </span>
                  {onOpenSizeGuide && (
                    <Button variant="atelier"
                      onClick={onOpenSizeGuide}
                      className="text-primary/90 hover:underline flex items-center gap-1 text-[11px] uppercase tracking-wider"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Size Guide
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    const isOutOfStock = s.stock === 0;
                    return (
                      <Button variant="atelier"
                        key={s.size}
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedSize(s.size);
                          setErrorMsg("");
                        }}
                        className={`py-2 text-xs font-mono font-medium border text-center transition-colors ${
                          isOutOfStock
                            ? "border-border text-muted-foreground line-through bg-muted/30 cursor-not-allowed"
                            : isSelected
                            ? "border-primary bg-primary text-primary-foreground font-bold"
                            : "border-border bg-muted text-foreground hover:border-border"
                        }`}
                      >
                        {s.size}
                      </Button>
                    );
                  })}
                </div>
                {errorMsg && <p className="text-xs text-destructive mt-2">{errorMsg}</p>}
              </div>

              {/* Details Bullet points */}
              {detailsList.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border">
                  <ul className="text-[11px] text-muted-foreground space-y-1">
                    {detailsList.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <Button variant="atelier"
                onClick={handleAddToCart}
                disabled={added || !product.inStock || !sizes.some((s) => s.stock > 0)}
                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold text-xs tracking-normal uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-success" />
                    <span>Added To Bag</span>
                  </>
                ) : (
                  <span>{product.inStock && sizes.some((s) => s.stock > 0) ? "Add To Shopping Bag" : "Currently unavailable"}</span>
                )}
              </Button>

              <div className="flex flex-wrap gap-2 justify-between items-center text-xs">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground uppercase tracking-widest text-[11px] inline-flex items-center gap-1"
                >
                  <span>View Full Tailoring Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Material: {product.material}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
