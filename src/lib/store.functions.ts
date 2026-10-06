import { createServerFn } from "@tanstack/react-start";
import { notFound } from "@tanstack/react-router";
import { z } from "zod";

export const getHomeData = createServerFn({ method: "GET" }).handler(async () => {
  const { db, rows } = await import("./store.server");
  const c = await db();
  const [f, b] = await Promise.all([
    c.from("products").select("*").eq("is_featured", true).limit(8),
    c.from("products").select("*").eq("is_bestseller", true).limit(4),
  ]);
  return { featuredProducts: rows(f.data), bestsellers: rows(b.data) };
});

export const getAllProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { db, rows } = await import("./store.server");
  const c = await db();
  const r = await c.from("products").select("*").order("is_featured", { ascending: false }).order("created_at", { ascending: false });
  return rows(r.data);
});

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { db, rows, toCamel } = await import("./store.server");
    const c = await db();
    const p = await c.from("products").select("*").eq("slug", data.slug).maybeSingle();
    if (!p.data) throw notFound();
    const [rv, rel] = await Promise.all([
      c.from("reviews").select("*").eq("product_id", p.data.id).order("created_at", { ascending: false }),
      c.from("products").select("*").neq("id", p.data.id).limit(4),
    ]);
    return { product: toCamel(p.data), reviews: rows(rv.data), related: rows(rel.data) };
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.number().int() }).parse(d))
  .handler(async ({ data }) => {
    const { db, rows, toCamel } = await import("./store.server");
    const c = await db();
    const o = await c.from("orders").select("*").eq("id", data.id).maybeSingle();
    if (!o.data) throw notFound();
    const it = await c.from("order_items").select("*").eq("order_id", data.id);
    return { order: toCamel(o.data), items: rows(it.data) };
  });
