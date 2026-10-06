import { createFileRoute } from "@tanstack/react-router";
import { db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/reviews")({
  server: { handlers: {
    GET: async ({ request }) => {
      const pid = new URL(request.url).searchParams.get("productId");
      const c = await db();
      if (pid) {
        const r = await c.from("reviews").select("*").eq("product_id", parseInt(pid, 10)).order("created_at", { ascending: false });
        return json(rows(r.data));
      }
      const r = await c.from("reviews").select("*, products(name)").order("created_at", { ascending: false });
      return json((r.data ?? []).map((x: any) => { const { products, ...rest } = x; return { ...toCamel(rest), productName: products?.name ?? null }; }));
    },
    POST: async ({ request }) => {
      const b = await request.json();
      if (!b.productId || !b.authorName || !b.rating || !b.title || !b.comment) return json({ error: "Missing required review fields" }, { status: 400 });
      const c = await db();
      const r = await c.from("reviews").insert(toSnake({
        productId: parseInt(b.productId, 10), authorName: String(b.authorName).trim().slice(0, 100),
        rating: Math.min(5, Math.max(1, parseInt(b.rating, 10))), title: String(b.title).trim().slice(0, 200),
        comment: String(b.comment).trim().slice(0, 3000), fitFeedback: b.fitFeedback || "True to size", verifiedPurchase: true,
      })).select().single();
      if (r.error) return json({ error: "Failed to create review" }, { status: 500 });
      return json(toCamel(r.data), { status: 201 });
    },
  } },
});
