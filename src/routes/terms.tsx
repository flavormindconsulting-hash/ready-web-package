import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | HENRO" },
      { name: "description", content: "The terms that govern shopping at the HENRO online store." },
      { property: "og:title", content: "Terms & Conditions | HENRO" },
      { property: "og:description", content: "The terms that govern shopping at the HENRO online store." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TermsPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <p className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase">HENRO</p>
        <h1 className="font-display text-4xl text-foreground">Terms &amp; Conditions</h1>
        <p className="text-xs text-muted-foreground">Last updated: October 2026</p>
      </header>

      <Section title="1. About these terms">
        <p>These terms govern your use of the HENRO website and any purchase you make from us. By placing an order, you agree to these terms. HENRO is operated from G - 601, Happy Residency, opposite to Rebounce, Vesu, Surat (Gujarat) - 395007, India, and these terms are governed by Indian law.</p>
      </Section>

      <Section title="2. Products and pricing">
        <p>All prices are shown in Indian Rupees (₹/INR) and include applicable taxes unless stated otherwise. We work hard to show colours and details accurately, but slight variations can occur due to screen settings and the nature of fabric photography.</p>
        <p>We may update prices, products and availability at any time. If an item you ordered becomes unavailable, we will inform you and issue a full refund.</p>
      </Section>

      <Section title="3. Orders">
        <p>Your order is an offer to buy; it is accepted when we confirm it and dispatch the items. We may decline or cancel an order (for example due to a pricing error or stock issue) and will refund any payment in full in such cases.</p>
      </Section>

      <Section title="4. Payment">
        <p>Payments are processed securely by our payment partner. We never store your card, UPI or banking details. An order is confirmed only after successful payment.</p>
      </Section>

      <Section title="5. Shipping and delivery">
        <p>We currently ship within India. Delivery estimates are shown at checkout; delays can occasionally occur due to courier or weather conditions. Complimentary shipping applies on orders above the threshold shown at checkout.</p>
      </Section>

      <Section title="6. Returns and refunds">
        <p>Returns and refunds are governed by our Return &amp; Refund Policy, available on this website, which forms part of these terms.</p>
      </Section>

      <Section title="7. Intellectual property">
        <p>All content on this website — the HENRO name, logos, photographs, videos and text — belongs to HENRO and may not be copied or reused without written permission.</p>
      </Section>

      <Section title="8. Limitation of liability">
        <p>To the extent permitted by law, our liability for any claim relating to a purchase is limited to the amount you paid for the product concerned. Nothing in these terms limits your rights under the Consumer Protection Act, 2019.</p>
      </Section>

      <Section title="9. Contact and grievances">
        <p>For any question, complaint or grievance about your order or these terms, email <a className="text-primary underline underline-offset-4" href="mailto:support@henro.in">support@henro.in</a>. We aim to resolve complaints within 7 working days.</p>
        <p>You can also write to us at: HENRO — G - 601, Happy Residency, opposite to Rebounce, Vesu, Surat (Gujarat) - 395007, India.</p>
      </Section>
    </div>
  );
}
