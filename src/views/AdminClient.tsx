import { Button } from "@/components/ui/button";

import { adminFetch } from "@/lib/admin-fetch";
import React, { useState, useEffect } from "react";
import Link from "@/compat/next-link";
import { Product, Order, Review, ProductSize, ProductColor } from "@/lib/types";
import {
  SlidersHorizontal,
  Package,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  RefreshCw,
  Eye,
  Star,
  ExternalLink,
  Search,
  AlertCircle,
  Filter,
} from "lucide-react";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalReviews: number;
  avgOrderValue: number;
}

export const AdminClient: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders" | "reviews">("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [reviewsList, setReviewsList] = useState<(Review & { productName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Search & Filter in Admin
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("All");

  // Product Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    subtitle: "",
    description: "",
    price: "145.00",
    compareAtPrice: "175.00",
    category: "Oxford & Formal",
    fit: "Tailored Fit",
    material: "100% Giza 87 Egyptian Cotton",
    careInstructions: "Machine wash cold 30°C. Hang dry.",
    details: "Albini Italian mill fabric\nAustralian mother-of-pearl buttons\nSplit back yoke",
    images: "/products/classic-white-oxford.jpg",
    colors: "White:#FFFFFF, Blue:#BFD7EA",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 8 },
      { size: "XXL", stock: 4 },
    ] as ProductSize[],
    isFeatured: false,
    isNew: false,
    isBestseller: false,
    inStock: true,
  });

  const [formSaving, setFormSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [statsRes, productsRes, ordersRes, reviewsRes] = await Promise.all([
        adminFetch("/api/admin/stats"),
        adminFetch("/api/products"),
        adminFetch("/api/admin/orders"),
        adminFetch("/api/reviews"),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (productsRes.ok) setProductsList(await productsRes.json());
      if (ordersRes.ok) setOrdersList(await ordersRes.json());
      if (reviewsRes.ok) setReviewsList(await reviewsRes.json());
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      subtitle: "",
      description: "",
      price: "145.00",
      compareAtPrice: "175.00",
      category: "Oxford & Formal",
      fit: "Tailored Fit",
      material: "100% Giza 87 Egyptian Cotton",
      careInstructions: "Machine wash cold 30°C. Hang dry.",
      details: "Albini Italian mill fabric\nMother-of-pearl Troca buttons\nSplit back yoke",
      images: "/products/classic-white-oxford.jpg",
      colors: "White:#FFFFFF, Blue:#BFD7EA",
      sizes: [
        { size: "S", stock: 10 },
        { size: "M", stock: 15 },
        { size: "L", stock: 15 },
        { size: "XL", stock: 8 },
        { size: "XXL", stock: 4 },
      ],
      isFeatured: false,
      isNew: true,
      isBestseller: false,
      inStock: true,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);

    let parsedDetails = "";
    try {
      const arr = typeof p.details === "string" ? JSON.parse(p.details) : p.details;
      parsedDetails = Array.isArray(arr) ? arr.join("\n") : p.details || "";
    } catch {
      parsedDetails = p.details || "";
    }

    let parsedImages = "";
    try {
      const arr = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
      parsedImages = Array.isArray(arr) ? arr.join("\n") : p.images;
    } catch {
      parsedImages = p.images;
    }

    let parsedColors = "";
    try {
      const arr: ProductColor[] = typeof p.colors === "string" ? JSON.parse(p.colors) : p.colors || [];
      parsedColors = arr.map((c) => `${c.name}:${c.hex}`).join(", ");
    } catch {
      parsedColors = "";
    }

    let parsedSizes: ProductSize[] = [];
    try {
      parsedSizes = typeof p.sizes === "string" ? JSON.parse(p.sizes) : p.sizes;
    } catch {
      parsedSizes = [
        { size: "S", stock: 5 },
        { size: "M", stock: 10 },
        { size: "L", stock: 10 },
      ];
    }

    setFormData({
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle || "",
      description: p.description,
      price: p.price,
      compareAtPrice: p.compareAtPrice || "",
      category: p.category,
      fit: p.fit,
      material: p.material,
      careInstructions: p.careInstructions || "",
      details: parsedDetails,
      images: parsedImages,
      colors: parsedColors,
      sizes: parsedSizes,
      isFeatured: Boolean(p.isFeatured),
      isNew: Boolean(p.isNew),
      isBestseller: Boolean(p.isBestseller),
      inStock: p.inStock !== false,
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleStockChange = (index: number, stock: number) => {
    const updated = [...formData.sizes];
    const row = updated[index];
    if (!row) return;
    row.stock = Math.max(0, stock);
    setFormData({ ...formData, sizes: updated });
  };

  const handleAddSizeRow = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: "NEW", stock: 5 }],
    });
  };

  const handleRemoveSizeRow = (index: number) => {
    const updated = formData.sizes.filter((_, i) => i !== index);
    setFormData({ ...formData, sizes: updated });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      setFormError("Please fill in required fields: Name, Price, and Description.");
      return;
    }

    setFormSaving(true);
    setFormError("");

    // Prepare arrays
    const detailsArr = formData.details
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const imagesArr = formData.images
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const colorsArr = formData.colors
      .split(",")
      .map((pair) => {
        const [name, hex] = pair.split(":").map((s) => s?.trim());
        return name ? { name, hex: hex || "#FFFFFF" } : null;
      })
      .filter((c): c is ProductColor => c !== null);

    const payload = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      subtitle: formData.subtitle,
      description: formData.description,
      price: formData.price,
      compareAtPrice: formData.compareAtPrice || null,
      category: formData.category,
      fit: formData.fit,
      material: formData.material,
      careInstructions: formData.careInstructions,
      details: detailsArr,
      images: imagesArr.length > 0 ? imagesArr : ["/products/classic-white-oxford.jpg"],
      colors: colorsArr,
      sizes: formData.sizes,
      isFeatured: formData.isFeatured,
      isNew: formData.isNew,
      isBestseller: formData.isBestseller,
      inStock: formData.inStock,
    };

    try {
      let res;
      if (editingProduct) {
        res = await adminFetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await adminFetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        setActionSuccess(
          editingProduct ? "Shirt updated successfully." : "New shirt added to atelier."
        );
        setTimeout(() => setActionSuccess(""), 3000);
        await fetchData();
      } else {
        const errData = await res.json();
        setFormError(errData.error || "Failed to save shirt.");
      }
    } catch {
      setFormError("Network error while saving.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the atelier catalog?`)) {
      return;
    }

    try {
      const res = await adminFetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setActionSuccess(`"${name}" has been removed.`);
        setTimeout(() => setActionSuccess(""), 3000);
        await fetchData();
      }
    } catch {
      alert("Failed to delete shirt.");
    }
  };

  const handleToggleStock = async (product: Product) => {
    try {
      const res = await adminFetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inStock: !product.inStock }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch {
      // ignore
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await adminFetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setActionSuccess(`Order #${orderId} status updated to ${newStatus}.`);
        setTimeout(() => setActionSuccess(""), 3000);
        await fetchData();
      }
    } catch {
      alert("Failed to update order status");
    }
  };

  const handleDeleteReview = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer review?")) return;
    try {
      const res = await adminFetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setActionSuccess("Review deleted.");
        setTimeout(() => setActionSuccess(""), 3000);
        await fetchData();
      }
    } catch {
      alert("Failed to delete review");
    }
  };

  const handleReseedDb = async () => {
    if (!confirm("Reset database to pristine Henro demo seed? (Existing edits will be re-initialized)")) {
      return;
    }
    setRefreshing(true);
    try {
      const res = await adminFetch("/api/admin/seed", { method: "POST" });
      if (res.ok) {
        setActionSuccess("Database reset to demo state.");
        setTimeout(() => setActionSuccess(""), 3000);
        await fetchData();
      }
    } catch {
      alert("Failed to reseed database");
    } finally {
      setRefreshing(false);
    }
  };

  // Filtered products in Admin table
  const filteredAdminProducts = productsList.filter((p) => {
    if (productCategoryFilter !== "All" && p.category !== productCategoryFilter) {
      return false;
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.fit.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="bg-background text-foreground min-h-screen">
      
      {/* Top Admin Navigation Header */}
      <div className="border-b border-border bg-muted/60 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-3 grid grid-cols-[minmax(0,1fr)_auto] gap-3 items-center">
          
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="font-editorial text-lg tracking-widest text-foreground uppercase">
                HENRO
              </span>
              <span className="text-[10px] font-mono tracking-widest text-primary bg-warning-soft/60 border border-primary/80 px-2 py-0.5 rounded">
                ADMIN
              </span>
            </div>

            {/* Tabs */}
            <div className="hidden md:flex items-center gap-1 ml-6 text-xs font-mono uppercase tracking-wider">
              {[
                { id: "overview", label: "Overview & Metrics" },
                { id: "products", label: `Catalog (${productsList.length})` },
                { id: "orders", label: `Orders (${ordersList.length})` },
                { id: "reviews", label: `Reviews (${reviewsList.length})` },
              ].map((tab) => (
                <Button variant="atelier"
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded transition-colors ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="atelier"
              onClick={fetchData}
              disabled={refreshing}
              title="Refresh Atelier Data"
              className="p-2 text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary rounded transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            </Button>

            <Button variant="atelier"
              onClick={handleReseedDb}
              title="Reset Demo Dataset"
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-wider bg-secondary/80 hover:bg-secondary text-foreground rounded border border-border"
            >
              Reset Seed
            </Button>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-secondary hover:bg-secondary text-foreground text-xs font-medium uppercase tracking-wider rounded transition-colors"
            >
              <span>Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="flex md:hidden border-t border-border/60 overflow-x-auto p-2 gap-2 text-xs font-mono">
          {[
            { id: "overview", label: "Overview" },
            { id: "products", label: `Shirts (${productsList.length})` },
            { id: "orders", label: `Orders (${ordersList.length})` },
            { id: "reviews", label: `Reviews (${reviewsList.length})` },
          ].map((tab) => (
            <Button variant="atelier"
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded whitespace-nowrap ${
                activeTab === tab.id ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Admin Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Success toast banner */}
        {actionSuccess && (
          <div className="mb-6 p-4 bg-success-soft/80 border border-success rounded text-success text-xs flex items-center justify-between font-mono animate-fade-in">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-success" />
              {actionSuccess}
            </span>
            <Button variant="atelier" onClick={() => setActionSuccess("")} className="text-success hover:text-foreground">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="p-6 bg-muted/50 border border-border rounded space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                  <span>Gross Atelier Revenue</span>
                  <IndianRupee className="w-4 h-4 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
                  ₹{stats ? stats.totalRevenue.toFixed(2) : "0.00"}
                </div>
                <div className="text-[11px] text-success flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" />
                  <span>Real commissions via checkout</span>
                </div>
              </div>

              <div className="p-6 bg-muted/50 border border-border rounded space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                  <span>Total Commissions</span>
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
                  {stats ? stats.totalOrders : 0}
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Processed in atelier queue
                </div>
              </div>

              <div className="p-6 bg-muted/50 border border-border rounded space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                  <span>Average Commission (AOV)</span>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
                  ₹{stats ? stats.avgOrderValue.toFixed(2) : "0.00"}
                </div>
                <div className="text-[11px] text-muted-foreground font-mono">
                  Per gentleman order
                </div>
              </div>

              <div className="p-6 bg-muted/50 border border-border rounded space-y-2">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono uppercase">
                  <span>Active Catalog Pieces</span>
                  <Package className="w-4 h-4 text-primary" />
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-bold text-foreground">
                  {stats ? stats.totalProducts : 0}
                </div>
                <div className="text-[11px] text-primary font-mono">
                  {reviewsList.length} verified client reviews
                </div>
              </div>

            </div>

            {/* Quick Actions & Recent Orders preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Orders (8 cols) */}
              <div className="lg:col-span-8 p-6 bg-muted/40 border border-border rounded space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                    Recent Atelier Commissions
                  </h3>
                  <Button variant="atelier"
                    onClick={() => setActiveTab("orders")}
                    className="text-xs text-primary font-mono hover:underline uppercase"
                  >
                    View All Orders →
                  </Button>
                </div>

                {ordersList.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center font-mono">
                    No orders placed yet. Test the checkout flow to see live commissions appear here!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="text-[10px] uppercase font-mono text-muted-foreground border-b border-border">
                        <tr>
                          <th className="py-2">Order</th>
                          <th className="py-2">Gentleman</th>
                          <th className="py-2">Total</th>
                          <th className="py-2">Status</th>
                          <th className="py-2">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border font-mono">
                        {ordersList.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-muted/60">
                            <td className="py-3 font-semibold text-foreground">
                              {order.orderNumber}
                            </td>
                            <td className="py-3 text-foreground">
                              {order.customerName}
                            </td>
                            <td className="py-3 text-primary">
                              ₹{parseFloat(order.total).toFixed(2)}
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                                  order.status === "Delivered"
                                    ? "bg-success-soft text-success border border-success"
                                    : order.status === "Shipped"
                                    ? "bg-secondary text-primary border border-primary"
                                    : "bg-warning-soft text-primary border border-primary"
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-muted-foreground text-[11px]">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Actions Card (4 cols) */}
              <div className="lg:col-span-4 p-6 bg-muted/40 border border-border rounded space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground border-b border-border pb-3">
                  Quick Atelier Actions
                </h3>

                <div className="space-y-2">
                  <Button variant="atelier"
                    onClick={openAddModal}
                    className="w-full py-3 bg-primary text-primary-foreground font-semibold text-xs tracking-normal uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 rounded"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Commission New Shirt</span>
                  </Button>

                  <Button variant="atelier"
                    onClick={() => setActiveTab("products")}
                    className="w-full py-2.5 bg-secondary hover:bg-secondary text-foreground text-xs font-mono uppercase tracking-wider rounded border border-border flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Manage Sizes & Prices</span>
                  </Button>

                  <Button variant="atelier"
                    onClick={() => setActiveTab("orders")}
                    className="w-full py-2.5 bg-secondary hover:bg-secondary text-foreground text-xs font-mono uppercase tracking-wider rounded border border-border flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Update Delivery Statuses</span>
                  </Button>

                  <Button variant="atelier"
                    onClick={handleReseedDb}
                    className="w-full py-2.5 bg-background hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-mono uppercase tracking-wider rounded border border-border flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-primary" />
                    <span>Reset Demo Catalog</span>
                  </Button>
                </div>

                <div className="pt-2 text-[11px] text-muted-foreground leading-relaxed font-mono">
                  Tip: Changes made in the catalog (pricing, sizes, inventory counts) reflect instantly across the storefront, size pickers, and checkout.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Bar: Search, Category filter, and Add Shirt Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 border border-border rounded">
              
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search shirts by name, fit..."
                    className="w-full bg-background border border-border rounded pl-9 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground uppercase tracking-wider focus:outline-none"
                >
                  <option value="All">All Typologies</option>
                  <option value="Oxford & Formal">Oxford & Formal</option>
                  <option value="Linen & Resort">Linen & Resort</option>
                  <option value="Overshirts">Overshirts</option>
                  <option value="Casual Poplin">Casual Poplin</option>
                  <option value="Knit & Polo">Knit & Polo</option>
                </select>
              </div>

              <Button variant="atelier"
                onClick={openAddModal}
                className="w-full sm:w-auto px-5 py-2 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-widest hover:bg-secondary transition-colors flex items-center justify-center gap-2 rounded"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Shirt</span>
              </Button>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto border border-border rounded bg-muted/30">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/80 text-[10px] uppercase font-mono tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Shirt</th>
                    <th className="py-3 px-4">Typology / Fit</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Sizes & Inventory</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredAdminProducts.map((p) => {
                    let images: string[] = [];
                    try {
                      images = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
                    } catch {
                      images = [p.images];
                    }

                    let sizes: ProductSize[] = [];
                    try {
                      sizes = typeof p.sizes === "string" ? JSON.parse(p.sizes) : p.sizes;
                    } catch {
                      sizes = [];
                    }

                    const totalStock = sizes.reduce((sum, s) => sum + s.stock, 0);

                    return (
                      <tr key={p.id} className="hover:bg-muted/60 transition-colors">
                        
                        {/* Thumbnail & Title */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-14 bg-muted border border-border overflow-hidden flex-shrink-0">
                              <img
                                src={images[0] || "/products/classic-white-oxford.jpg"}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/products/${p.slug}`}
                                className="font-semibold text-foreground uppercase hover:text-primary transition-colors flex items-center gap-1"
                              >
                                {p.name}
                                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                              </Link>
                              <p className="text-[11px] text-muted-foreground italic line-clamp-1">
                                {p.subtitle || p.material}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category & Fit */}
                        <td className="py-3 px-4 font-mono text-[11px]">
                          <div className="text-foreground">{p.category}</div>
                          <div className="text-primary/80">{p.fit}</div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-mono">
                          <div className="font-semibold text-foreground">
                            ₹{parseFloat(p.price).toFixed(2)}
                          </div>
                          {p.compareAtPrice && (
                            <div className="text-[11px] text-muted-foreground line-through">
                              ₹{parseFloat(p.compareAtPrice).toFixed(2)}
                            </div>
                          )}
                        </td>

                        {/* Sizes & Stock */}
                        <td className="py-3 px-4 font-mono">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {sizes.map((s) => (
                              <span
                                key={s.size}
                                className={`text-[10px] px-1.5 py-0.5 rounded border ${
                                  s.stock > 0
                                    ? "bg-muted border-border text-foreground"
                                    : "bg-danger-soft/40 border-destructive text-destructive line-through"
                                }`}
                              >
                                {s.size}: <strong>{s.stock}</strong>
                              </span>
                            ))}
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-1">
                            Total Units: {totalStock}
                          </div>
                        </td>

                        {/* In Stock Toggle */}
                        <td className="py-3 px-4">
                          <Button variant="atelier"
                            onClick={() => handleToggleStock(p)}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider font-semibold border transition-colors ${
                              p.inStock
                                ? "bg-success-soft text-success border-success"
                                : "bg-danger-soft text-destructive border-destructive"
                            }`}
                          >
                            {p.inStock ? "In Stock" : "Archived"}
                          </Button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="atelier"
                              onClick={() => openEditModal(p)}
                              className="p-1.5 text-muted-foreground hover:text-foreground bg-secondary hover:bg-secondary rounded transition-colors"
                              title="Edit shirt sizes, prices, details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </Button>

                            <Button variant="atelier"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-muted-foreground hover:text-destructive bg-secondary hover:bg-danger-soft/60 rounded transition-colors"
                              title="Delete shirt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-muted/50 border border-border rounded text-xs font-mono">
              <span className="uppercase text-muted-foreground">
                Atelier Client Commissions: <strong className="text-foreground">{ordersList.length}</strong>
              </span>
              <span className="text-muted-foreground">
                Update status from 'Processing' to 'Shipped' or 'Delivered'
              </span>
            </div>

            <div className="overflow-x-auto border border-border rounded bg-muted/30">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/80 text-[10px] uppercase font-mono tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Order Ref</th>
                    <th className="py-3 px-4">Client Contact</th>
                    <th className="py-3 px-4">Items Commissioned</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status & Dispatch</th>
                    <th className="py-3 px-4">Destination</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ordersList.map((order) => (
                    <tr key={order.id} className="hover:bg-muted/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-primary">
                        {order.orderNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-foreground">{order.customerName}</div>
                        <div className="text-[11px] font-mono text-muted-foreground">{order.customerEmail}</div>
                      </td>

                      <td className="py-3 px-4 text-xs font-mono">
                        {order.items && order.items.length > 0 ? (
                          <div className="space-y-1">
                            {order.items.map((it) => (
                              <div key={it.id} className="text-foreground">
                                • {it.productName} ({it.size}) × {it.quantity}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">View items</span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <div className="text-foreground font-semibold">
                          ₹{parseFloat(order.total).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {order.shippingMethod}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`px-2.5 py-1 rounded text-xs font-mono uppercase font-semibold border cursor-pointer focus:outline-none ${
                            order.status === "Delivered"
                              ? "bg-success-soft text-success border-success"
                              : order.status === "Shipped"
                              ? "bg-secondary text-primary border-primary"
                              : order.status === "Processing"
                              ? "bg-warning-soft text-primary border-primary"
                              : "bg-muted text-foreground border-border"
                          }`}
                        >
                          <option value="Pending" className="bg-muted text-foreground">Pending</option>
                          <option value="Processing" className="bg-muted text-foreground">Processing</option>
                          <option value="Shipped" className="bg-muted text-foreground">Shipped</option>
                          <option value="Delivered" className="bg-muted text-foreground">Delivered</option>
                          <option value="Cancelled" className="bg-muted text-foreground">Cancelled</option>
                        </select>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground">
                        <div>{order.shippingCity}, {order.shippingCountry}</div>
                        <div className="text-muted-foreground">{order.shippingPostalCode}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MANAGEMENT */}
        {activeTab === "reviews" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap gap-3 items-center justify-between p-4 bg-muted/50 border border-border rounded text-xs font-mono">
              <span className="uppercase text-muted-foreground">
                Client Reviews Archive: <strong className="text-foreground">{reviewsList.length}</strong>
              </span>
              <span className="text-muted-foreground">
                Verified buyer reviews and fit feedback notes
              </span>
            </div>

            <div className="overflow-x-auto border border-border rounded bg-muted/30">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted/80 text-[10px] uppercase font-mono tracking-widest text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-3 px-4">Shirt</th>
                    <th className="py-3 px-4">Reviewer</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Critique & Headline</th>
                    <th className="py-3 px-4">Fit Feedback</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviewsList.map((rev) => (
                    <tr key={rev.id} className="hover:bg-muted/60">
                      <td className="py-3 px-4 font-medium text-foreground max-w-xs">
                        {rev.productName || `Product #${rev.productId}`}
                      </td>

                      <td className="py-3 px-4 font-mono text-foreground">
                        {rev.authorName}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex text-primary">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-primary" />
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-foreground">"{rev.title}"</div>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                          {rev.comment}
                        </p>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-primary">
                        {rev.fitFeedback || "True to size"}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button variant="atelier"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive bg-secondary hover:bg-danger-soft/60 rounded transition-colors"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Product Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-overlay/85 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-3xl bg-background border border-border p-6 sm:p-8 rounded z-10 shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div>
                <h3 className="text-base font-editorial uppercase tracking-wider text-foreground">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Commission New Shirt into Catalog"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Set prices, adjust size inventories, and define sartorial specs.
                </p>
              </div>
              <Button variant="atelier"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {formError && (
              <div className="mb-4 p-3 bg-danger-soft/80 border border-destructive rounded text-destructive text-xs font-mono">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Row 1: Name & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Shirt Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. The Grandview Oxford Shirt"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Fabric Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. 120/2 double-twisted Albini cotton"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Row 2: Category, Fit, Material */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Typology / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Oxford & Formal">Oxford & Formal</option>
                    <option value="Linen & Resort">Linen & Resort</option>
                    <option value="Overshirts">Overshirts</option>
                    <option value="Casual Poplin">Casual Poplin</option>
                    <option value="Knit & Polo">Knit & Polo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Fit Silhouette
                  </label>
                  <select
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Tailored Fit">Tailored Fit</option>
                    <option value="Relaxed Fit">Relaxed Fit</option>
                    <option value="Classic Fit">Classic Fit</option>
                    <option value="Oversized Fit">Oversized Fit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Material Composition
                  </label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="100% Giza 87 Egyptian Cotton"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Row 3: Price & Compare-At Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Compare-At Price (₹, strike-through)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="Optional compare price"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              {/* Row 4: SIZES & STOCK MATRIX (Crucial Requirement!) */}
              <div className="p-4 bg-muted/60 border border-border rounded space-y-3">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
                    Sizes & Inventory Allocation
                  </h4>
                  <Button variant="atelier"
                    type="button"
                    onClick={handleAddSizeRow}
                    className="text-[10px] font-mono text-primary hover:underline uppercase flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Size Option
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {formData.sizes.map((s, idx) => (
                    <div key={idx} className="p-2 bg-background border border-border rounded">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono text-xs font-bold text-foreground">{s.size}</span>
                        {formData.sizes.length > 1 && (
                          <Button variant="atelier"
                            type="button"
                            onClick={() => handleRemoveSizeRow(idx)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground mb-0.5">
                        Units in Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={s.stock}
                        onChange={(e) => handleStockChange(idx, parseInt(e.target.value) || 0)}
                        className="w-full bg-muted border border-border rounded px-2 py-1 text-xs text-foreground font-mono text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Description & Tailoring bullets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Editorial Description *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Tailoring Details (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.details}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    placeholder="Albini Italian mill fabric&#10;Mother-of-pearl Troca buttons&#10;Split back yoke"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary leading-relaxed font-mono"
                  />
                </div>
              </div>

              {/* Row 6: Images & Color Variants */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Image URLs (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="/products/classic-white-oxford.jpg&#10;https://..."
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Color Swatches (Format: Name:#HEX, Name:#HEX)
                  </label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Crisp White:#FFFFFF, French Blue:#4682B4"
                    className="w-full bg-muted border border-border rounded px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    e.g. Pure White:#FFFFFF, Sky Blue:#C5D9E8, Olive:#556B2F
                  </p>
                </div>
              </div>

              {/* Row 7: Flags (Featured, Bestseller, New, In Stock) */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-muted text-primary"
                  />
                  <span className="uppercase text-foreground">Featured Atelier Piece</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-muted text-primary"
                  />
                  <span className="uppercase text-foreground">New 2026 Drop</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isBestseller}
                    onChange={(e) => setFormData({ ...formData, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-muted text-primary"
                  />
                  <span className="uppercase text-foreground">Bestseller Badge</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-muted text-primary"
                  />
                  <span className="uppercase text-success font-medium">In-Stock Status</span>
                </label>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="atelier"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-muted text-muted-foreground hover:text-foreground text-xs uppercase tracking-wider rounded"
                >
                  Cancel
                </Button>
                <Button variant="atelier"
                  type="submit"
                  disabled={formSaving}
                  className="px-8 py-2.5 bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-widest hover:bg-secondary transition-colors rounded shadow-lg"
                >
                  {formSaving ? "Saving..." : editingProduct ? "Save Changes" : "Create Shirt"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
