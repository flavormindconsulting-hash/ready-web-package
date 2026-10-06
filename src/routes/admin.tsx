import { createFileRoute } from "@tanstack/react-router";
import { AdminClient } from "@/views/AdminClient";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Atelier Command & Control | HENRO" },
      { name: "description", content: "Administrative console to manage shirt catalog, inventory, sizes, prices, orders, and reviews." },
      { property: "og:title", content: "Atelier Command & Control | HENRO" },
      { property: "og:description", content: "HENRO store administration." },
      { name: "robots", content: "noindex" },
    ],
  }),
  ssr: false,
  component: AdminClient,
});
