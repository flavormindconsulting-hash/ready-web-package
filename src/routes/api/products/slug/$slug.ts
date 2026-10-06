import { createFileRoute } from "@tanstack/react-router";
import { db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/products/slug/$slug")({
  server: { handlers: {
    GET: async ({ params }) => {
      const c = await db();
      const p = await c.from("products").select("*").eq("slug", params.slug).maybeSingle();
      if (!p.data) return json({ error: "Product not found" }, { status: 404 });
      const rv = await c.from("reviews").select("*").eq("product_id", p.data.id).order("created_at", { ascending: false });
      const rel = await c.from("products").select("*").neq("id", p.data.id).limit(4);
      return json({ product: toCamel(p.data), reviews: rows(rv.data), related: rows(rel.data) });
    },
  } },
});
