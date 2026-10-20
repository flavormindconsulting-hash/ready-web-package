import { createFileRoute } from "@tanstack/react-router";

// Owner-only: list and update social links (url + on/off toggle).
export const Route = createFileRoute("/api/admin/social-links")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { db, rows, json, requireAdmin } = await import("@/lib/store.server");
        const deny = await requireAdmin(request);
        if (deny) return deny;
        const c = await db();
        const r = await c.from("social_links").select("*").order("sort_order", { ascending: true });
        return json(rows(r.data));
      },
      PUT: async ({ request }) => {
        const { db, json, requireAdmin } = await import("@/lib/store.server");
        const deny = await requireAdmin(request);
        if (deny) return deny;
        let body: { platform?: string; url?: string; isEnabled?: boolean };
        try {
          body = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, { status: 400 });
        }
        const platform = String(body.platform || "").trim();
        if (!platform) return json({ error: "platform is required" }, { status: 400 });
        const url = String(body.url || "").trim();
        if (url && !/^https:\/\/.+/i.test(url))
          return json({ error: "Link must start with https://" }, { status: 400 });
        if (body.isEnabled && !url)
          return json({ error: "Paste the page link before switching this icon on." }, { status: 400 });
        const c = await db();
        const r = await c
          .from("social_links")
          .update({ url, is_enabled: Boolean(body.isEnabled), updated_at: new Date().toISOString() })
          .eq("platform", platform)
          .select("platform");
        if (!r.data || r.data.length === 0) return json({ error: "Unknown platform" }, { status: 404 });
        return json({ ok: true });
      },
    },
  },
});
