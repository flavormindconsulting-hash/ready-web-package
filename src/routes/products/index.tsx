import { createFileRoute } from "@tanstack/react-router";
import { ProductsClientCatalog } from "@/components/ProductsClientCatalog";
import { getAllProducts } from "@/lib/store.functions";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "The Collection | HENRO Atelier" },
      { name: "description", content: "Browse oxfords, linen resort shirts, overshirts, poplins and knit shirts from HENRO." },
      { property: "og:title", content: "The Collection | HENRO Atelier" },
      { property: "og:description", content: "Browse the full HENRO shirt archive." },
    ],
  }),
  loader: () => getAllProducts(),
  component: () => <ProductsClientCatalog initialProducts={Route.useLoaderData()} />,
});
