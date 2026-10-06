export interface ProductSize {
  size: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  subtitle?: string | null;
  description: string;
  price: string;
  compareAtPrice?: string | null;
  category: string;
  fit: string;
  material: string;
  careInstructions?: string | null;
  details?: string | null; // parsed to string[]
  images: string; // parsed to string[]
  colors?: string | null; // parsed to ProductColor[]
  sizes: string; // parsed to ProductSize[]
  isFeatured?: boolean | null;
  isNew?: boolean | null;
  isBestseller?: boolean | null;
  inStock?: boolean | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Review {
  id: number;
  productId: number;
  authorName: string;
  rating: number;
  title: string;
  comment: string;
  fitFeedback?: string | null;
  verifiedPurchase?: boolean | null;
  createdAt: string | Date;
}

export interface CartItem {
  id: string; // unique key `${productId}-${size}-${color}`
  productId: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId?: number | null;
  productName: string;
  productSlug: string;
  productImage: string;
  size: string;
  color: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingMethod: string;
  shippingCost: string;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  promoCode?: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items?: OrderItem[];
}
