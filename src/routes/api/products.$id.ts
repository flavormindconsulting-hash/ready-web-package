import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, db, rows, toCamel, toSnake, json } from "@/lib/store.server";
import { sizeValidationError } from "@/lib/product-sizes";

export const Route = createFileRoute("/api/products/$id")({
  server: { handlers: {
    GET: async ({ params }) => {
      const id = parseInt(params.id, 10);
      if (isNaN(id)) return json({ error: "Invalid product id" }, { status: 400 });
      const c = await db();
      const p = await c.from("products").select("*").eq("id", id).maybeSingle();
      if (!p.data) return json({ error: "Product not found" }, { status: 404 });
      const rv = await c.from("reviews").select("*").eq("product_id", id);
      return json({ ...toCamel(p.data), reviews: rows(rv.data) });
    },
    PUT: async ({ params, request }) => {
      const denied = await requireAdmin(request); if (denied) return denied;
      try {
        const id = parseInt(params.id, 10);
        if (isNaN(id)) return json({ error: "Invalid product id" }, { status: 400 });
        const b = await request.json();
        if (b.sizes !== undefined) {
          const sizes = typeof b.sizes === "string" ? JSON.parse(b.sizes) : b.sizes;
          if (!Array.isArray(sizes) || sizes.some((row) => !row || typeof row.size !== "string"))
            return json({ error: "Invalid sizes." }, { status: 400 });
          const sizeError = sizeValidationError(sizes);
          if (sizeError) return json({ error: sizeError }, { status: 400 });
        }
        const u: Record<string, unknown> = { updatedAt: new Date() };
        for (const k of ["name", "slug", "subtitle", "description", "category", "fit", "material", "careInstructions"]) if (b[k] !== undefined) u[k] = b[k];
        if (b["price"] !== undefined) u["price"] = String(b["price"]);
        if (b["compareAtPrice"] !== undefined) u["compareAtPrice"] = b["compareAtPrice"] ? String(b["compareAtPrice"]) : null;
        for (const k of ["details", "images", "colors", "sizes"]) if (b[k] !== undefined) u[k] = typeof b[k] === "string" ? b[k] : JSON.stringify(b[k]);
        for (const k of ["isFeatured", "isNew", "isBestseller", "inStock"]) if (b[k] !== undefined) u[k] = Boolean(b[k]);
        const c = await db();
        const r = await c.from("products").update(toSnake(u)).eq("id", id).select().maybeSingle();
        if (!r.data) return json({ error: "Product not found" }, { status: 404 });
        return json(toCamel(r.data));
      } catch (e) { console.error(e); return json({ error: "Failed to update product" }, { status: 500 }); }
    },
    DELETE: async ({params, request}) => {
      const denied = await requireAdmin(request); if (denied) return denied;
      const id = parseInt(params.id, 10);
      if (isNaN(id)) return json({ error: "Invalid product id" }, { status: 400 });
      const c = await db();
      const r = await c.from("products").delete().eq("id", id).select().maybeSingle();
      if (!r.data) return json({ error: "Product not found" }, { status: 404 });
      return json({ success: true, deleted: toCamel(r.data) });
    },
  } },
});
