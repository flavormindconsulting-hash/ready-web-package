
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

  let detailsList: string[] = [];
  try {
    detailsList = typeof product.details === "string" ? JSON.parse(product.details || "[]") : product.details || [];
  } catch {
    detailsList = [];
  }

  const currentColor = selectedColor || colors[0]?.name || "Standard";

  const handleAddToCart = () => {
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
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-neutral-950 border border-neutral-800 text-neutral-100 shadow-2xl rounded-sm overflow-hidden z-10 animate-fade-in my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-neutral-400 hover:text-white bg-neutral-900/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Gallery side */}
          <div className="p-6 bg-neutral-900/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-800">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-900 border border-neutral-800">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 flex-shrink-0 border overflow-hidden ${
                      selectedImageIndex === idx ? "border-amber-300" : "border-neutral-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details side */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-neutral-400 mb-1">
                <span>{product.category}</span>
                <span>·</span>
                <span className="text-amber-300">{product.fit}</span>
              </div>

              <h2 className="text-lg md:text-xl font-editorial tracking-wide uppercase text-white font-medium">
                {product.name}
              </h2>

              {product.subtitle && (
                <p className="text-xs text-neutral-400 italic font-serif mt-1">
                  {product.subtitle}
                </p>
              )}

              <div className="flex items-center gap-3 mt-3">
                <span className="text-lg font-mono font-semibold text-white">
                  ₹{parseFloat(product.price).toFixed(2)}
                </span>
                {product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                  <span className="text-sm font-mono text-neutral-500 line-through">
                    ₹{parseFloat(product.compareAtPrice).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-xs text-neutral-400 leading-relaxed mt-4 line-clamp-3">
                {product.description}
              </p>

              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="mt-5">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="uppercase tracking-widest text-neutral-400 text-[11px]">
                      Color: <strong className="text-white">{currentColor}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {colors.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border p-0.5 flex items-center justify-center transition-all ${
                          currentColor === c.name ? "border-amber-300 scale-110" : "border-neutral-700 opacity-70 hover:opacity-100"
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-full h-full rounded-full"
                          style={{ backgroundColor: c.hex }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className="mt-5">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="uppercase tracking-widest text-neutral-400 text-[11px]">
                    Size: <strong className="text-white">{selectedSize || "Select"}</strong>
                  </span>
                  {onOpenSizeGuide && (
                    <button
                      onClick={onOpenSizeGuide}
                      className="text-amber-200/90 hover:underline flex items-center gap-1 text-[11px] uppercase tracking-wider"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Size Guide
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {sizes.map((s) => {
                    const isSelected = selectedSize === s.size;
                    const isOutOfStock = s.stock === 0;
                    return (
                      <button
                        key={s.size}
                        disabled={isOutOfStock}
                        onClick={() => {
                          setSelectedSize(s.size);
                          setErrorMsg("");
                        }}
                        className={`py-2 text-xs font-mono font-medium border text-center transition-colors ${
                          isOutOfStock
                            ? "border-neutral-800 text-neutral-600 line-through bg-neutral-900/30 cursor-not-allowed"
                            : isSelected
                            ? "border-white bg-white text-black font-bold"
                            : "border-neutral-700 bg-neutral-900 text-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
                {errorMsg && <p className="text-xs text-red-400 mt-2">{errorMsg}</p>}
              </div>

              {/* Details Bullet points */}
              {detailsList.length > 0 && (
                <div className="mt-5 pt-4 border-t border-neutral-900">
                  <ul className="text-[11px] text-neutral-400 space-y-1">
                    {detailsList.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-200" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-neutral-900">
              <button
                onClick={handleAddToCart}
                disabled={added}
                className="w-full py-3.5 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added To Bag</span>
                  </>
                ) : (
                  <span>Add To Shopping Bag</span>
                )}
              </button>

              <div className="flex justify-between items-center text-xs">
                <Link
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white uppercase tracking-widest text-[11px] inline-flex items-center gap-1"
                >
                  <span>View Full Tailoring Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[10px] text-neutral-500 font-mono">
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
