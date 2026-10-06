import { createFileRoute } from "@tanstack/react-router";
import { db, rows, toCamel, toSnake, json } from "@/lib/store.server";

export const Route = createFileRoute("/api/newsletter")({
  server: { handlers: {
    POST: async ({ request }) => {
      const { email } = await request.json();
      if (!email || typeof email !== "string" || !email.includes("@") || email.length > 255) return json({ error: "A valid email is required" }, { status: 400 });
      const clean = email.trim().toLowerCase();
      const c = await db();
      const ex = await c.from("newsletter").select("id").eq("email", clean);
      if (ex.data && ex.data.length > 0) return json({ message: "You are already subscribed to the Henro Atelier Gazette." });
      const r = await c.from("newsletter").insert({ email: clean });
      if (r.error) return json({ error: "Failed to subscribe" }, { status: 500 });
      return json({ success: true, message: "Welcome to Henro Atelier. You will receive private collection previews." });
    },
  } },
});
