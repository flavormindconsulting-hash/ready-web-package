import { createFileRoute } from "@tanstack/react-router";
import { db } from "@/lib/store.server";

// Only this bucket's intentionally public catalog photographs can be served.
export const Route = createFileRoute("/api/public/product-photos/$filename")({
  server: { handlers: {
    GET: async ({ params }) => {
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/.test(params.filename))
        return new Response("Not found", { status: 404 });
      const client = await db();
      const { data, error } = await client.storage.from("product-photos").download(params.filename);
      if (error || !data) return new Response("Not found", { status: 404 });
      const ext = params.filename.split(".").pop();
      return new Response(data, { headers: {
        "Content-Type": ext === "jpg" ? "image/jpeg" : `image/${ext}`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      } });
    },
  } },
});