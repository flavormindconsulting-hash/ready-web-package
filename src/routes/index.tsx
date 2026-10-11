import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/views/HomePage";
import { getHomeData } from "@/lib/store.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HENRO | Signature Shirts & Everyday Essentials" },
      { name: "description", content: "Discover HENRO shirts, from crisp white classics to relaxed olive styles and everyday layers. A signature of your own." },
      { property: "og:title", content: "HENRO | Signature Shirts & Everyday Essentials" },
      { property: "og:description", content: "Discover signature HENRO shirts and considered everyday layers." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: () => getHomeData(),
  component: () => {
    const d = Route.useLoaderData();
    return <HomePage featuredProducts={d.featuredProducts} bestsellers={d.bestsellers} />;
  },
});
