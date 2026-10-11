import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getProductBySlug } from "@/lib/store.functions";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => getProductBySlug({ data: { slug: params.slug } }),
  head: ({ loaderData }) =>
    loaderData
      ? { meta: [
          { title: `${loaderData.product.name} | HENRO Atelier` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} | HENRO Atelier` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ] }
      : { meta: [{ title: "Shirt Not Found | HENRO" }, { name: "description", content: "This shirt is not available. Explore the HENRO collection." }, { property: "og:title", content: "Shirt Not Found | HENRO" }, { property: "og:description", content: "Explore the HENRO shirt collection." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" }] },
  notFoundComponent: () => (
    <div className="max-w-xl mx-auto py-32 text-center space-y-4">
      <h1 className="text-3xl font-editorial">Shirt not found</h1>
      <Link to="/products" className="text-primary underline">Back to the collection</Link>
    </div>
  ),
  component: () => {
    const d = Route.useLoaderData();
    return <ProductDetailClient key={d.product.id} product={d.product} initialReviews={d.reviews} relatedProducts={d.related} />;
  },
});
