import { createFileRoute, Link } from "@tanstack/react-router";
import OrderSuccessPage from "@/views/OrderSuccessPage";
import { getOrder } from "@/lib/store.functions";

export const Route = createFileRoute("/checkout/success/$orderId")({
  loader: ({ params }) => getOrder({ data: { id: parseInt(params.orderId, 10) || 0 } }),
  head: () => ({ meta: [
    { title: "Order Confirmed | HENRO" },
    { name: "description", content: "Your HENRO order has been received." },
    { property: "og:title", content: "Order Confirmed | HENRO" },
    { property: "og:description", content: "Your HENRO order has been received." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "robots", content: "noindex" },
  ] }),
  notFoundComponent: () => (
    <div className="max-w-xl mx-auto py-32 text-center space-y-4">
      <h1 className="text-3xl font-editorial">Order not found</h1>
      <Link to="/" className="text-amber-300 underline">Return home</Link>
    </div>
  ),
  component: () => {
    const d = Route.useLoaderData();
    return <OrderSuccessPage order={d.order} items={d.items} />;
  },
});
