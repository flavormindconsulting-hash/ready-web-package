import { createFileRoute } from "@tanstack/react-router";
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
        const o = await c.from("orders").insert(toSnake({
          orderNumber, customerName: b.customerName.trim(), customerEmail: b.customerEmail.trim().toLowerCase(),
          customerPhone: b.customerPhone ? b.customerPhone.trim() : null, shippingAddress: b.shippingAddress.trim(),
          shippingCity: b.shippingCity ? b.shippingCity.trim() : "City", shippingPostalCode: b.shippingPostalCode ? b.shippingPostalCode.trim() : "00000",
          shippingCountry: b.shippingCountry || "United States", shippingMethod: b.shippingMethod || "Standard Courier",
          shippingCost: n(b.shippingCost), subtotal: n(b.subtotal), discount: n(b.discount), tax: n(b.tax), total: n(b.total),
          promoCode: b.promoCode || null, status: "Processing", paymentStatus: "Paid",
        })).select().single();
        if (o.error) throw o.error;
        const items = b.items.map((i: any) => toSnake({
          orderId: o.data.id, productId: i.productId || null, productName: i.name, productSlug: i.slug, productImage: i.image,
          size: i.size, color: i.color, price: Number(i.price).toFixed(2), quantity: i.quantity,
        }));
        const ir = await c.from("order_items").insert(items);
        if (ir.error) throw ir.error;
        return json({ success: true, orderId: o.data.id, orderNumber: o.data.order_number });
      } catch (e) { console.error(e); return json({ error: "Checkout failed" }, { status: 500 }); }
    },
  } },
});
