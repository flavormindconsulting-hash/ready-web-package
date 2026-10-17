import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/returns-refunds")({
  head: () => ({
    meta: [
      { title: "Return & Refund Policy | HENRO" },
      { name: "description", content: "HENRO's 30-day return and refund policy — how to return a shirt and how refunds are processed." },
      { property: "og:title", content: "Return & Refund Policy | HENRO" },
      { property: "og:description", content: "HENRO's 30-day return and refund policy — how to return a shirt and how refunds are processed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ReturnsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <p className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase">HENRO</p>
        <h1 className="font-display text-4xl text-foreground">Return &amp; Refund Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: October 2026</p>
      </header>

      <Section title="1. 30-day returns">
        <p>If you are not happy with your purchase, you can return it within <strong className="text-foreground">30 days of delivery</strong> for a refund or exchange, provided the item is unworn, unwashed, and in its original condition with tags attached.</p>
      </Section>

      <Section title="2. How to start a return">
        <p>Email us at the address listed on this website with your order number (it starts with "HN-") and the reason for the return. We will reply with return instructions and the return shipping address within 2 working days.</p>
      </Section>

      <Section title="3. Condition of returned items">
        <p>Items must be returned in sellable condition. We cannot accept returns of items that are worn, washed, damaged by the customer, or missing tags. Please try shirts on carefully over clean clothing.</p>
      </Section>

      <Section title="4. Refunds">
        <p>Once we receive and inspect your return, we will process your refund within <strong className="text-foreground">5–7 working days</strong>. Refunds are made to the original payment method (card, UPI or bank account) through our payment partner. Depending on your bank, it may take a few extra days to appear in your account.</p>
      </Section>

      <Section title="5. Exchanges and size issues">
        <p>If you need a different size, write to us and we will arrange an exchange subject to stock availability. If the requested size is unavailable, we will issue a refund instead.</p>
      </Section>

      <Section title="6. Damaged or wrong items">
        <p>If your order arrives damaged, defective, or different from what you ordered, contact us within 48 hours of delivery with photos. We will arrange a free replacement or a full refund, including any shipping you paid.</p>
      </Section>

      <Section title="7. Cancellations">
        <p>You can cancel an order before it is dispatched for a full refund. Once dispatched, the standard return process applies.</p>
      </Section>

      <Section title="8. Contact">
        <p>For any return, exchange or refund question, email us at the address listed on this website and mention your order number.</p>
      </Section>
    </div>
  );
}
