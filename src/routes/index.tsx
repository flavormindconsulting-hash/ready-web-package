import { createFileRoute } from "@tanstack/react-router";
import HomePage from "@/views/HomePage";
import { getHomeData } from "@/lib/store.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HENRO | Haute Shirting for Men" },
      { name: "description", content: "Bespoke Italian cotton oxfords, Normandy washed linen resort shirts, and heavyweight overshirts crafted for the modern man." },
      { property: "og:title", content: "HENRO | Haute Shirting for Men" },
      { property: "og:description", content: "Bespoke Italian cotton oxfords, Normandy linen resort shirts and heavyweight overshirts." },
    ],
  }),
  loader: () => getHomeData(),
  component: () => {
    const d = Route.useLoaderData();
    return <HomePage featuredProducts={d.featuredProducts} bestsellers={d.bestsellers} />;
  },
});
