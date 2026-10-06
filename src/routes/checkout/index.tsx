import { createFileRoute } from "@tanstack/react-router";
import CheckoutPage from "@/views/CheckoutPage";

export const Route = createFileRoute("/checkout/")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | HENRO" },
      { name: "description", content: "Complete your HENRO order with complimentary shipping over $150." },
      { property: "og:title", content: "Secure Checkout | HENRO" },
      { property: "og:description", content: "Complete your HENRO order." },
    ],
  }),
  component: CheckoutPage,
});
