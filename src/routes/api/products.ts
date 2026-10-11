import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, db, rows, toCamel, toSnake, json } from "@/lib/store.server";
import { sizeValidationError } from "@/lib/product-sizes";

const str = (v: unknown, d: unknown) => (typeof v === "string" ? v : JSON.stringify(v ?? d));
export const Route = createFileRoute("/api/products")({
  server: { handlers: {
    GET: async ({ request }) => {
      try {
        const sp = new URL(request.url).searchParams;
        const c = await db();
        let q = c.from("products").select("*");
        const category = sp.get("category"), fit = sp.get("fit"), search = sp.get("search");
        if (category && category !== "All") q = q.eq("category", category);
        if (fit && fit !== "All") q = q.eq("fit", fit);
        if (sp.get("featured") === "true") q = q.eq("is_featured", true);
        if (search) { const s = search.replace(/[,()%]/g, " "); q = q.or(`name.ilike.%${s}%,description.ilike.%${s}%,material.ilike.%${s}%`); }
        if (sp.get("minPrice")) q = q.gte("price", sp.get("minPrice"));
        if (sp.get("maxPrice")) q = q.lte("price", sp.get("maxPrice"));
        const sort = sp.get("sort") || "featured";
        const map: Record<string, [string, boolean]> = { "price-asc": ["price", true], "price-desc": ["price", false], newest: ["created_at", false], "name-asc": ["name", true] };
        const [col, asc] = map[sort] ?? ["is_featured", false];
        const r = await q.order(col, { ascending: asc }).order("created_at", { ascending: false });
        if (r.error) throw r.error;
        return json(rows(r.data));
      } catch (e) { console.error(e); return json({ error: "Failed to fetch products" }, { status: 500 }); }
    },
    POST: async ({ request }) => {
      const denied = await requireAdmin(request); if (denied) return denied;
      try {
        const b = await request.json();
        const sizes = typeof b.sizes === "string" ? JSON.parse(b.sizes) : b.sizes ?? [];
        if (!Array.isArray(sizes) || sizes.some((row) => !row || typeof row.size !== "string"))
          return json({ error: "Invalid sizes." }, { status: 400 });
        const sizeError = sizeValidationError(sizes);
        if (sizeError) return json({ error: sizeError }, { status: 400 });
        const slug = b.slug || String(b.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const c = await db();
        const r = await c.from("products").insert(toSnake({
          slug, name: b.name, subtitle: b.subtitle || "", description: b.description, price: String(b.price),
          compareAtPrice: b.compareAtPrice ? String(b.compareAtPrice) : null, category: b.category || "Oxford & Formal",
          fit: b.fit || "Tailored Fit", material: b.material || "100% Organic Cotton",
          careInstructions: b.careInstructions || "Machine wash cold. Hang dry.",
          details: str(b.details, []), images: str(b.images, []), colors: str(b.colors, []),
          sizes: JSON.stringify(sizes),
          isFeatured: Boolean(b.isFeatured), isNew: Boolean(b.isNew), isBestseller: Boolean(b.isBestseller), inStock: b.inStock !== false,
        })).select().single();
        if (r.error) throw r.error;
        return json(toCamel(r.data), { status: 201 });
      } catch (e) { console.error(e); return json({ error: "Failed to create product" }, { status: 500 }); }
    },
  } },
});
