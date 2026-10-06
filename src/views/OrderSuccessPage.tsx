import React from "react";
import Link from "@/compat/next-link";
import { notFound } from "@/compat/next-navigation";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";
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

export const revalidate = 0;

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderSuccessPage({ params }: PageProps) {
  const { orderId } = await params;
  const idNum = parseInt(orderId, 10);
  if (isNaN(idNum)) {
    notFound();
  }

  const orderResult = await db.select().from(orders).where(eq(orders.id, idNum));
  if (!orderResult || orderResult.length === 0) {
    notFound();
  }

  const order = orderResult[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, idNum));

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
    <div className="bg-neutral-950 text-neutral-100 min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Status Banner */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-amber-300">
            ORDER CONFIRMED & REGISTERED
          </span>

          <h1 className="text-3xl sm:text-5xl font-editorial uppercase text-white tracking-tight">
            Thank You, {order.customerName.split(" ")[0]}
          </h1>

          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto font-light leading-relaxed">
            Your tailoring commission has been received and queued at our atelier. A detailed confirmation has been dispatched to{" "}
            <strong className="text-white font-mono">{order.customerEmail}</strong>.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-neutral-900 border border-neutral-800 rounded font-mono text-xs text-neutral-200">
            <span>Order Reference:</span>
            <span className="text-amber-300 font-bold">{order.orderNumber}</span>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="p-6 sm:p-8 bg-neutral-900/40 border border-neutral-800 rounded space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
                Fulfillment Timeline
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono">
              <Calendar className="w-3.5 h-3.5 text-neutral-500" />
              <span>Estimated Delivery: {formattedDelivery}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3 bg-neutral-950 border border-amber-900/60 rounded space-y-1">
              <span className="text-[10px] font-mono text-amber-300 uppercase">Step 1 · Completed</span>
              <h4 className="text-xs font-semibold text-white">Order Registered</h4>
              <p className="text-[11px] text-neutral-500">Payment cleared & verified</p>
            </div>

            <div className="p-3 bg-neutral-950 border border-amber-400/40 rounded space-y-1">
              <span className="text-[10px] font-mono text-amber-200 uppercase">Step 2 · Active</span>
              <h4 className="text-xs font-semibold text-white">Pattern & Stitch Quality</h4>
              <p className="text-[11px] text-neutral-500">22-stitch seam inspection</p>
            </div>

            <div className="p-3 bg-neutral-950/60 border border-neutral-850 rounded space-y-1 opacity-70">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Step 3 · Pending</span>
              <h4 className="text-xs font-semibold text-neutral-300">Archival Boxing</h4>
              <p className="text-[11px] text-neutral-500">Hand-pressed in rigid box</p>
            </div>

            <div className="p-3 bg-neutral-950/60 border border-neutral-850 rounded space-y-1 opacity-70">
              <span className="text-[10px] font-mono text-neutral-500 uppercase">Step 4 · Pending</span>
              <h4 className="text-xs font-semibold text-neutral-300">Courier Handover</h4>
              <p className="text-[11px] text-neutral-500">Tracking code sent via SMS</p>
            </div>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Items Purchased (7 cols) */}
          <div className="md:col-span-7 p-6 bg-neutral-900/30 border border-neutral-800 rounded space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white border-b border-neutral-800 pb-3">
              Commissioned Shirts ({items.length})
            </h3>

            <div className="space-y-4 divide-y divide-neutral-900">
              {items.map((item) => (
                <div key={item.id} className="pt-3 first:pt-0 flex gap-4">
                  <div className="w-16 h-20 bg-neutral-900 border border-neutral-800 overflow-hidden flex-shrink-0">
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="text-xs font-medium uppercase text-white hover:text-amber-200 transition-colors"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        Size: <strong className="text-neutral-200 font-mono">{item.size}</strong> · Shade: {item.color}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="text-neutral-500">Qty: {item.quantity}</span>
                      <span className="text-white font-semibold">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs font-mono text-neutral-400 pt-4 border-t border-neutral-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-amber-300">
                  <span>Promotional Voucher</span>
                  <span>-${parseFloat(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{order.shippingMethod}</span>
                <span>
                  {parseFloat(order.shippingCost) === 0
                    ? "FREE"
                    : `$${parseFloat(order.shippingCost).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax</span>
                <span>${parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-semibold text-sm pt-2 border-t border-neutral-800">
                <span className="uppercase tracking-widest font-sans text-xs">Total Charged</span>
                <span className="font-mono text-amber-200">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Details & Actions (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Delivery address card */}
            <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded space-y-3 text-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>Delivery Destination</span>
              </div>
              <div className="text-neutral-300 space-y-1 leading-relaxed">
                <p className="font-semibold text-white">{order.customerName}</p>
                <p>{order.shippingAddress}</p>
                <p>
                  {order.shippingCity}, {order.shippingPostalCode}
                </p>
                <p>{order.shippingCountry}</p>
                {order.customerPhone && <p className="font-mono text-neutral-400">{order.customerPhone}</p>}
              </div>
              <div className="pt-2 border-t border-neutral-850 text-[11px] text-neutral-500">
                Method: <span className="text-neutral-300 font-medium">{order.shippingMethod}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <OrderPrintButton />

              <Link
                href="/products"
                className="w-full py-3.5 bg-white text-black font-semibold text-xs tracking-[0.2em] uppercase hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/admin"
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-850 text-amber-300 text-xs font-mono uppercase tracking-wider border border-amber-900/50 rounded flex items-center justify-center gap-1.5 transition-colors"
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
