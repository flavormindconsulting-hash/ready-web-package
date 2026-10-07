import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/admin/orders/$id")({
  server: { handlers: {
    PUT: async ({ params, request }) => {
      const denied = await requireAdmin(request); if (denied) return denied;
      const id = parseInt(params.id, 10);
      if (isNaN(id)) return json({ error: "Invalid order ID" }, { status: 400 });
      const { status, paymentStatus } = await request.json();
      const c = await db();
      const r = await c.from("orders").update(toSnake({ status, paymentStatus })).eq("id", id).select().maybeSingle();
      if (!r.data) return json({ error: "Order not found" }, { status: 404 });
      return json(toCamel(r.data));
    },
    DELETE: async ({params, request}) => {
      const denied = await requireAdmin(request); if (denied) return denied;
      const id = parseInt(params.id, 10);
      if (isNaN(id)) return json({ error: "Invalid order ID" }, { status: 400 });
      const c = await db();
      const r = await c.from("orders").delete().eq("id", id).select().maybeSingle();
      if (!r.data) return json({ error: "Order not found" }, { status: 404 });
      return json({ success: true, deleted: toCamel(r.data) });
    },
  } },
});
