import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/store.server";
export const Route = createFileRoute("/api/admin/seed")({
  server: { handlers: { POST: async () => json({ error: "Whole-store reset is disabled to protect your shirts and orders." }, { status: 410 }) } },
});
