import React from "react";
import Link from "@/compat/next-link";
import type { Order, OrderItem } from "@/lib/types";
import {
  CheckCircle,
  Package,
  Truck,
  ArrowRight,
  Printer,
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";
import { OrderPrintButton } from "@/components/OrderPrintButton";

export default function OrderSuccessPage({ order, items }: { order: Order; items: OrderItem[] }) {
  // Delivery date estimate (4 business days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-background text-foreground min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Status Banner */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-success-soft/60 border border-success flex items-center justify-center text-success">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-primary">
            ORDER CONFIRMED & REGISTERED
          </span>

          <h1 className="text-3xl sm:text-5xl font-editorial uppercase text-foreground tracking-normal">
            Thank You, {order.customerName.split(" ")[0]}
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto font-light leading-relaxed">
            Your tailoring commission has been received and queued at our atelier. A detailed confirmation has been dispatched to{" "}
            <strong className="text-foreground font-mono">{order.customerEmail}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-muted border border-border rounded font-mono text-xs text-foreground">
            <span>Order Reference:</span>
            <span className="text-primary font-bold">{order.orderNumber}</span>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="p-6 sm:p-8 bg-muted/40 border border-border rounded space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground">
                Fulfillment Timeline
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Estimated Delivery: {formattedDelivery}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-background border border-primary/60 rounded space-y-1">
              <span className="text-[10px] font-mono text-primary uppercase">Step 1 · Completed</span>
              <h4 className="text-xs font-semibold text-foreground">Order Registered</h4>
              <p className="text-[11px] text-muted-foreground">Payment cleared & verified</p>
            </div>

            <div className="p-3 bg-background border border-primary/40 rounded space-y-1">
              <span className="text-[10px] font-mono text-primary uppercase">Step 2 · Active</span>
              <h4 className="text-xs font-semibold text-foreground">Pattern & Stitch Quality</h4>
              <p className="text-[11px] text-muted-foreground">22-stitch seam inspection</p>
            </div>

            <div className="p-3 bg-background/60 border border-border rounded space-y-1 opacity-70">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Step 3 · Pending</span>
              <h4 className="text-xs font-semibold text-foreground">Archival Boxing</h4>
              <p className="text-[11px] text-muted-foreground">Hand-pressed in rigid box</p>
            </div>

            <div className="p-3 bg-background/60 border border-border rounded space-y-1 opacity-70">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Step 4 · Pending</span>
              <h4 className="text-xs font-semibold text-foreground">Courier Handover</h4>
              <p className="text-[11px] text-muted-foreground">Tracking code sent via SMS</p>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Items Purchased (7 cols) */}
          <div className="md:col-span-7 p-6 bg-muted/30 border border-border rounded space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground border-b border-border pb-3">
              Commissioned Shirts ({items.length})
            </h3>

            <div className="space-y-4 divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-4">
                  <div className="w-16 h-20 bg-muted border border-border overflow-hidden flex-shrink-0">
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-xs font-medium uppercase text-foreground hover:text-primary transition-colors"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Size: <strong className="text-foreground font-mono">{item.size}</strong> · Shade: {item.color}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-muted-foreground">Qty: {item.quantity}</span>
                      <span className="text-foreground font-semibold">
                        ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs font-mono text-muted-foreground pt-4 border-t border-border">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-primary">
                  <span>Promotional Voucher</span>
                  <span>-₹{parseFloat(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{order.shippingMethod}</span>
                <span>
                  {parseFloat(order.shippingCost) === 0
                    ? "FREE"
                    : `₹${parseFloat(order.shippingCost).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>₹{parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground font-semibold text-sm pt-2 border-t border-border">
                <span className="uppercase tracking-widest font-sans text-xs">Total Charged</span>
                <span className="font-mono text-primary">₹{parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details & Actions (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery address card */}
            <div className="p-6 bg-muted/30 border border-border rounded space-y-3 text-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span>Delivery Destination</span>
              </div>
              <div className="text-foreground space-y-1 leading-relaxed">
                <p className="font-semibold text-foreground">{order.customerName}</p>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}, {order.shippingPostalCode}
                </p>
                <p>{order.shippingCountry}</p>
                {order.customerPhone && <p className="font-mono text-muted-foreground">{order.customerPhone}</p>}
              </div>
              <div className="pt-2 border-t border-border text-[11px] text-muted-foreground">
                Method: <span className="text-foreground font-medium">{order.shippingMethod}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <OrderPrintButton />

              <Link
                href="/products"
                className="w-full py-3.5 bg-primary text-primary-foreground font-semibold text-xs tracking-normal uppercase hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin"
                className="w-full py-2.5 bg-muted hover:bg-secondary text-primary text-xs font-mono uppercase tracking-wider border border-primary/50 rounded flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Order in Admin Panel →</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
