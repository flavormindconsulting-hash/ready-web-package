import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/admin/orders")({
  server: { handlers: {
    GET: async () => {
      const c = await db();
      const r = await c.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
      return json((r.data ?? []).map((x: any) => { const { order_items, ...o } = x; return { ...toCamel(o), items: rows(order_items) }; }));
    },
  } },
});
