import { createFileRoute } from "@tanstack/react-router";
import { priceCart, checkPromo } from "@/lib/promos.server";
import { db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/checkout")({
  server: { handlers: {
    POST: async ({ request }) => {
      try {
        const b = await request.json();
        if (!b.customerName || !b.customerEmail || !b.shippingAddress || !b.items || b.items.length === 0)
          return json({ error: "Missing required checkout information" }, { status: 400 });
        const orderNumber = `HN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const n = (v: unknown) => Number(v || 0).toFixed(2);
        const c = await db();
        const {subtotal, prices} = await priceCart(b.items);
        const discount = b.promoCode ? (await checkPromo(b.promoCode, subtotal)).discount : 0;
        const shippingCost = b.shippingMethod === "White Glove Atelier Delivery" ? 25 : b.shippingMethod === "Express Priority Courier" ? 15 : subtotal >= 150 ? 0 : 15;
        const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
        const total = Math.round((subtotal - discount + shippingCost + tax) * 100) / 100;
        const o = await c.from("orders").insert(toSnake({
          orderNumber, customerName: b.customerName.trim(), customerEmail: b.customerEmail.trim().toLowerCase(),
          customerPhone: b.customerPhone ? b.customerPhone.trim() : null, shippingAddress: b.shippingAddress.trim(),
          shippingCity: b.shippingCity ? b.shippingCity.trim() : "City", shippingPostalCode: b.shippingPostalCode ? b.shippingPostalCode.trim() : "00000",
          shippingCountry: b.shippingCountry || "United States", shippingMethod: b.shippingMethod || "Standard Courier",
          shippingCost: n(shippingCost), subtotal: n(subtotal), discount: n(discount), tax: n(tax), total: n(total),
          promoCode: b.promoCode || null, status: "Processing", paymentStatus: "Paid",
        })).select().single();
        if (o.error) throw o.error;
        const items = b.items.map((i: any) => toSnake({
          orderId: o.data.id, productId: i.productId || null, productName: i.name, productSlug: i.slug, productImage: i.image,
          size: i.size, color: i.color, price: Number(prices.get(i.productId)).toFixed(2), quantity: i.quantity,
        }));
        const ir = await c.from("order_items").insert(items);
        if (ir.error) throw ir.error;
        return json({ success: true, orderId: o.data.id, orderNumber: o.data.order_number });
      } catch (e) { return json({ error: e instanceof Error ? e.message : "Checkout failed" }, { status: 400 }); }
    },
  } },
});
