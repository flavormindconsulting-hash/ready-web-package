import { createFileRoute } from "@tanstack/react-router";
import { db, rows, toCamel, toSnake, json } from "@/lib/store.server";

import seed from "@/lib/seed-data.json";
export const Route = createFileRoute("/api/admin/seed")({
  server: { handlers: {
    POST: async () => {
      try {
        const c = await db();
        const t = await c.rpc("reset_store"); if (t.error) throw t.error;
        const s = seed as Record<string, Record<string, unknown>[]>;
        for (const table of ["products", "reviews", "orders", "order_items"]) {
          const r = await c.from(table).insert(s[table].map(({ id: _id, ...x }) => toSnake(x)));
          if (r.error) throw r.error;
        }
        return json({ success: true, message: "Database reseeded successfully" });
      } catch (e) { console.error(e); return json({ error: "Failed to reseed database", details: String(e) }, { status: 500 }); }
    },
  } },
});
