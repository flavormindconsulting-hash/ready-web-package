import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/admin/stats")({
  server: { handlers: {
    GET: async ({ request }) => {
      const denied = await requireAdmin(request); if (denied) return denied;
      const c = await db();
      const [p, o, r, recent] = await Promise.all([
        c.from("products").select("id", { count: "exact", head: true }),
        c.from("orders").select("total"),
        c.from("reviews").select("id", { count: "exact", head: true }),
        c.from("orders").select("*").order("created_at", { ascending: false }).limit(5),
      ]);
      const totals = (o.data ?? []) as { total: number }[];
      const totalRevenue = totals.reduce((s, x) => s + Number(x.total), 0);
      const totalOrders = totals.length;
      return json({ totalRevenue, totalOrders, totalProducts: p.count ?? 0, totalReviews: r.count ?? 0,
        avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0, recentOrders: rows(recent.data) });
    },
  } },
});
