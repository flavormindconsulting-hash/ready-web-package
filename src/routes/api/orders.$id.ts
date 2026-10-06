import { createFileRoute } from "@tanstack/react-router";
import { db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/orders/$id")({
  server: { handlers: {
    GET: async ({ params }) => {
      const id = parseInt(params.id, 10);
      if (isNaN(id)) return json({ error: "Invalid order ID" }, { status: 400 });
      const c = await db();
      const o = await c.from("orders").select("*").eq("id", id).maybeSingle();
      if (!o.data) return json({ error: "Order not found" }, { status: 404 });
      const it = await c.from("order_items").select("*").eq("order_id", id);
      return json({ ...toCamel(o.data), items: rows(it.data) });
    },
  } },
});
