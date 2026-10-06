
import React, { useState } from "react";
import Link from "@/compat/next-link";
import { Product, Review, ProductSize, ProductColor } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { SizeGuideModal } from "@/components/SizeGuideModal";
import { ProductCard } from "@/components/ProductCard";
import {
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Ruler,
  ChevronRight,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Sparkles,
  Share2,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  initialReviews: Review[];
  relatedProducts: Product[];
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  initialReviews,
  relatedProducts,
}) => {
  const { addToCart } = useCart();

  // Parsing JSON fields safely
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

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.name || "Standard");
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeError, setSizeError] = useState("");
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Accordions
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");

  // Reviews & review submission
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewFit, setReviewFit] = useState("True to size");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState("");

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError("Please select a size to proceed");
      return;
    }
    setSizeError("");

    addToCart(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: parseFloat(product.price),
        image: images[selectedImageIndex] || images[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
      },
      true
    );

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  // Review calculations
  const totalReviewsCount = reviewsList.length;
  const averageRating =
    totalReviewsCount > 0
      ? (
          reviewsList.reduce((acc, curr) => acc + curr.rating, 0) /
          totalReviewsCount
        ).toFixed(1)
      : "5.0";

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewTitle.trim() || !reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName,
          rating,
          title: reviewTitle,
          comment: reviewComment,
          fitFeedback: reviewFit,
        }),
      });

      if (res.ok) {
        const created = await res.json();
        setReviewsList([created, ...reviewsList]);
        setReviewSuccessMsg("Your review has been published. Thank you.");
        setAuthorName("");
        setReviewTitle("");
        setReviewComment("");
        setTimeout(() => {
          setReviewSuccessMsg("");
          setReviewModalOpen(false);
        }, 1500);
      }
    } catch {
      // ignore
    } finally {
      setReviewSubmitting(false);
    }
  };

  const currentSizeObj = sizes.find((s) => s.size === selectedSize);

  return (
    <div className="bg-neutral-950 text-neutral-100 min-h-screen">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-neutral-900">
        <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-700" />
          <Link href="/products" className="hover:text-white transition-colors">
            Shirts
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-700" />
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-white transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3 h-3 text-neutral-700 hidden sm:inline" />
          <span className="text-neutral-300 font-semibold truncate hidden sm:inline">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails rail */}
            {images.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 sm:max-h-[650px] scrollbar-none flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 overflow-hidden border flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? "border-amber-300 opacity-100"
                        : "border-neutral-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover object-top" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-neutral-900 border border-neutral-800 group">
              <img
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 hover:scale-105"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {product.isBestseller && (
                  <span className="bg-neutral-950/90 text-amber-200 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 border border-amber-800/40 backdrop-blur-sm">
                    ATELIER BESTSELLER
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-white/90 text-black text-[10px] font-mono tracking-widest uppercase px-2.5 py-1">
                    NEW 2026 DROP
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Purchasing & Specifications (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
                <span>{product.category}</span>
                <span className="text-amber-300 font-semibold">{product.fit}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-editorial tracking-tight uppercase text-white font-medium">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-xs sm:text-sm text-neutral-400 italic font-serif mt-1">
                  {product.subtitle}
                </p>
              )}

              {/* Price & Rating Bar */}
              <div className="flex items-center justify-between pt-3 pb-1 border-b border-neutral-900">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-mono font-semibold text-white">
                    ${parseFloat(product.price).toFixed(2)}
                  </span>
                  {product.compareAtPrice &&
                    parseFloat(product.compareAtPrice) > parseFloat(product.price) && (
                      <span className="text-base font-mono text-neutral-500 line-through">
                        ${parseFloat(product.compareAtPrice).toFixed(2)}
                      </span>
                    )}
                </div>

                <a
                  href="#reviews-section"
                  className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-amber-200 transition-colors"
                >
                  <div className="flex text-amber-300">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    ({totalReviewsCount})
                  </span>
                </a>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed font-light">
              {product.description}
            </p>

            {/* Color Swatches */}
            {colors.length > 0 && (
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="uppercase tracking-widest text-neutral-400 text-[11px]">
                    Fabric Shade: <strong className="text-white">{selectedColor}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  {colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border p-0.5 flex items-center justify-center transition-all ${
                        selectedColor === c.name
                          ? "border-amber-300 scale-110 shadow-lg"
                          : "border-neutral-700 opacity-60 hover:opacity-100"
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
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="uppercase tracking-widest text-neutral-400 text-[11px]">
                  Select Size: <strong className="text-white">{selectedSize || "None chosen"}</strong>
                </span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-amber-200/90 hover:underline flex items-center gap-1 text-[11px] uppercase tracking-wider"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Fit Predictor & Guide
                </button>
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
                        setSizeError("");
                      }}
                      className={`py-3 text-xs font-mono font-medium border text-center transition-all relative ${
                        isOutOfStock
                          ? "border-neutral-800 text-neutral-600 line-through bg-neutral-900/30 cursor-not-allowed"
                          : isSelected
                          ? "border-white bg-white text-black font-bold shadow-md"
                          : "border-neutral-800 bg-neutral-900 text-neutral-200 hover:border-neutral-500"
                      }`}
                    >
                      {s.size}
                      {s.stock > 0 && s.stock <= 4 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stock Urgency indicator */}
              {currentSizeObj && currentSizeObj.stock <= 4 && currentSizeObj.stock > 0 && (
                <p className="text-[11px] font-mono text-amber-300 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Low Atelier Stock: Only {currentSizeObj.stock} shirts remaining in size {selectedSize}
                </p>
              )}

              {sizeError && <p className="text-xs text-red-400 mt-2 font-medium">{sizeError}</p>}
            </div>

            {/* Quantity and Add to Bag */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-neutral-800 rounded bg-neutral-900 px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-12 flex items-center justify-center text-sm text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-12 flex items-center justify-center text-sm text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-white text-black font-semibold text-xs tracking-[0.25em] uppercase hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 shadow-xl"
                >
                  {addedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : (
                    <span>Add to Shopping Bag</span>
                  )}
                </button>
              </div>

              {/* Value props */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-neutral-400">
                <div className="flex items-center gap-2 p-2 bg-neutral-900/40 border border-neutral-900 rounded">
                  <Truck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Complimentary Courier</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-neutral-900/40 border border-neutral-900 rounded">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                  <span>30-Day Atelier Returns</span>
                </div>
              </div>
            </div>

            {/* Collapsible Accordions: Details, Sizing, Care */}
            <div className="border-t border-neutral-900 pt-4 space-y-3">
              
              {/* Accordion 1: Details & Tailoring */}
              <div className="border border-neutral-900 rounded overflow-hidden">
                <button
                  onClick={() => toggleAccordion("details")}
                  className="w-full p-3.5 bg-neutral-900/60 text-left text-xs font-semibold uppercase tracking-widest text-neutral-200 flex items-center justify-between"
                >
                  <span>Atelier Tailoring Details</span>
                  {openAccordion === "details" ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
                {openAccordion === "details" && (
                  <div className="p-4 bg-neutral-950 text-xs text-neutral-400 space-y-2 border-t border-neutral-900">
                    <p className="text-white font-medium">Material: {product.material}</p>
                    {detailsList.length > 0 && (
                      <ul className="space-y-1.5 pt-1">
                        {detailsList.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-1.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Care & Maintenance */}
              <div className="border border-neutral-900 rounded overflow-hidden">
                <button
                  onClick={() => toggleAccordion("care")}
                  className="w-full p-3.5 bg-neutral-900/60 text-left text-xs font-semibold uppercase tracking-widest text-neutral-200 flex items-center justify-between"
                >
                  <span>Fabric Care Instructions</span>
                  {openAccordion === "care" ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
                {openAccordion === "care" && (
                  <div className="p-4 bg-neutral-950 text-xs text-neutral-400 leading-relaxed border-t border-neutral-900">
                    <p>{product.careInstructions || "Machine wash cold delicate. Hang to air dry. Medium steam."}</p>
                    <p className="mt-2 text-neutral-500 text-[11px]">
                      Tip: Our mother-of-pearl buttons are natural shell; avoid high heat chemical dry cleaners.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Sizing Advice */}
              <div className="border border-neutral-900 rounded overflow-hidden">
                <button
                  onClick={() => toggleAccordion("fit")}
                  className="w-full p-3.5 bg-neutral-900/60 text-left text-xs font-semibold uppercase tracking-widest text-neutral-200 flex items-center justify-between"
                >
                  <span>Fit & Drape Advice</span>
                  {openAccordion === "fit" ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>
                {openAccordion === "fit" && (
                  <div className="p-4 bg-neutral-950 text-xs text-neutral-400 leading-relaxed border-t border-neutral-900 space-y-1.5">
                    <p>
                      <strong>Fit Profile:</strong> {product.fit}.
                    </p>
                    <p>
                      Our model is 6'1" (185 cm) with a 39" chest and wears size <strong>M</strong>. If you are between sizes and prefer a sharper drape under suiting, take your normal size. For a more relaxed weekend aesthetic, size up one step.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Customer Reviews Section */}
      <section id="reviews-section" className="border-t border-neutral-900 bg-neutral-900/30 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-800 pb-8 mb-10 gap-6">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300">
                VERIFIED SARTORIAL CRITIQUES
              </span>
              <h2 className="text-2xl sm:text-3xl font-editorial uppercase text-white mt-1">
                Client Reviews & Fit Notes
              </h2>
            </div>

            <button
              onClick={() => setReviewModalOpen(true)}
              className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold uppercase tracking-widest border border-neutral-700 transition-colors flex items-center gap-2 self-start md:self-end"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>Write an Atelier Review</span>
            </button>
          </div>

          {/* Rating Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 p-6 sm:p-8 bg-neutral-950 border border-neutral-800 rounded">
            <div className="text-center md:text-left flex flex-col justify-center border-b md:border-b-0 md:border-r border-neutral-900 pb-6 md:pb-0 md:pr-8">
              <span className="text-5xl font-mono font-bold text-white tracking-tight">
                {averageRating}
              </span>
              <div className="flex justify-center md:justify-start text-amber-300 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-300" />
                ))}
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Based on {totalReviewsCount} verified gentleman reviews
              </p>
            </div>

            {/* Fit Feedback indicator */}
            <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-neutral-900 pb-6 md:pb-0 md:pr-8 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                Fit Sizing Consensus
              </h4>
              <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden flex">
                <div style={{ width: "88%" }} className="bg-amber-300" title="True to size (88%)" />
                <div style={{ width: "8%" }} className="bg-neutral-600" title="Runs small (8%)" />
                <div style={{ width: "4%" }} className="bg-neutral-800" title="Runs large (4%)" />
              </div>
              <div className="flex justify-between text-[10px] text-neutral-400 uppercase font-mono">
                <span>True to size (88%)</span>
                <span>Runs small (8%)</span>
              </div>
            </div>

            {/* Craft guarantee */}
            <div className="flex flex-col justify-center space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-200">
                100% Fit Guarantee
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                If the shirt does not drape to your exact preference, our London & New York ateliers provide complimentary size swaps within 30 days.
              </p>
            </div>
          </div>

          {/* List of Reviews */}
          <div className="space-y-6">
            {reviewsList.length === 0 ? (
              <p className="text-xs text-neutral-500 py-8 text-center font-mono">
                No reviews yet. Be the first gentleman to review this shirt.
              </p>
            ) : (
              reviewsList.map((rev) => (
                <div
                  key={rev.id}
                  className="p-6 bg-neutral-950 border border-neutral-900 rounded space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-300">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-300" />
                        ))}
                      </div>
                      <span className="text-xs font-semibold uppercase text-white tracking-wider">
                        {rev.authorName}
                      </span>
                      {rev.verifiedPurchase && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded-full font-mono">
                          <Check className="w-3 h-3" />
                          Verified Atelier Buyer
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-neutral-500">
                      {new Date(rev.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-neutral-200">
                    "{rev.title}"
                  </h4>

                  <p className="text-xs text-neutral-400 leading-relaxed font-light">
                    {rev.comment}
                  </p>

                  {rev.fitFeedback && (
                    <div className="text-[11px] font-mono text-amber-200/80">
                      Fit note: <span className="text-white font-medium">{rev.fitFeedback}</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* Related Products / Complete The Look */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-neutral-900">
          <div className="border-b border-neutral-800 pb-6 mb-10">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300">
              MAISON COMPANIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-editorial uppercase text-white mt-1">
              Complete Your Sartorial Wardrobe
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Write Review Modal */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setReviewModalOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded z-10 shadow-2xl animate-fade-in">
            <h3 className="text-base font-editorial uppercase tracking-wider text-white mb-1">
              Review: {product.name}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Share your fit impressions and handfeel evaluation for fellow connoisseurs.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Your Name / Title
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alexander W., London"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-300 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating ? "fill-amber-300" : "text-neutral-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Fit Consensus
                </label>
                <select
                  value={reviewFit}
                  onChange={(e) => setReviewFit(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                >
                  <option value="True to size">True to size</option>
                  <option value="Runs slightly small">Runs slightly small</option>
                  <option value="Runs slightly large">Runs slightly large</option>
                  <option value="Relaxed drape">Relaxed drape</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  required
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Impeccable collar roll and texture"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Review Commentary
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Detail the handfeel, stitch quality, button thickness, and drape..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-300 leading-relaxed"
                />
              </div>

              {reviewSuccessMsg && (
                <p className="text-xs text-emerald-400 font-medium">{reviewSuccessMsg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="flex-1 py-3 bg-white text-black font-semibold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors"
                >
                  {reviewSubmitting ? "Publishing..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-3 bg-neutral-900 text-neutral-400 hover:text-white text-xs uppercase tracking-wider rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
};
