import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/admin/reviews/$id")({
  server: { handlers: {
    DELETE: async ({params, request}) => {
      const denied = await requireAdmin(request); if (denied) return denied;
      const id = parseInt(params.id, 10);
      if (isNaN(id)) return json({ error: "Invalid review ID" }, { status: 400 });
      const c = await db();
      const r = await c.from("reviews").delete().eq("id", id).select().maybeSingle();
      if (!r.data) return json({ error: "Review not found" }, { status: 404 });
      return json({ success: true, deleted: toCamel(r.data) });
    },
  } },
});
