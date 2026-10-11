import { createFileRoute } from "@tanstack/react-router";
import { db, json, requireAdmin } from "@/lib/store.server";

export const Route = createFileRoute("/api/admin/product-photos")({
  server: { handlers: {
    POST: async ({ request }) => {
      const denied = await requireAdmin(request);
      if (denied) return denied;
      try {
        if (Number(request.headers.get("content-length")) > 11 * 1024 * 1024)
          return json({ error: "Photos must be 10 MB or smaller." }, { status: 413 });
        const form = await request.formData();
        const file = form.get("photo");
        if (!file || typeof file === "string" || file.size === 0 || file.size > 10 * 1024 * 1024)
          return json({ error: "Choose a photo up to 10 MB." }, { status: 400 });
        const bytes = new Uint8Array(await file.arrayBuffer());
        let ext = "";
        let mime = "";
        if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) { ext = "jpg"; mime = "image/jpeg"; }
        else if ([137,80,78,71,13,10,26,10].every((n, i) => bytes[i] === n)) { ext = "png"; mime = "image/png"; }
        else if (new TextDecoder().decode(bytes.slice(0,4)) === "RIFF" && new TextDecoder().decode(bytes.slice(8,12)) === "WEBP") { ext = "webp"; mime = "image/webp"; }
        if (!ext) return json({ error: "Choose a JPG, PNG or WebP photo." }, { status: 400 });
        const filename = `${crypto.randomUUID()}.${ext}`;
        const client = await db();
        const { error } = await client.storage.from("product-photos").upload(filename, bytes, { contentType: mime, upsert: false });
        if (error) throw error;
        return json({ url: `/api/public/product-photos/${filename}` }, { status: 201 });
      } catch (error) {
        console.error("Product photo upload failed", error);
        return json({ error: "Photo upload failed. Please try again." }, { status: 500 });
      }
    },
  } },
});