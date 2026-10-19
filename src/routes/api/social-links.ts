import { createFileRoute } from "@tanstack/react-router";

// Public: only enabled social links with a URL are exposed.
export const Route = createFileRoute("/api/social-links")({
  server: {
    handlers: {
      GET: async () => {
        const { db, rows, json } = await import("@/lib/store.server");
        const c = await db();
        const r = await c
          .from("social_links")
          .select("platform,label,url,sort_order")
          .eq("is_enabled", true)
          .neq("url", "")
          .order("sort_order", { ascending: true });
        return json(rows(r.data));
      },
    },
  },
});
