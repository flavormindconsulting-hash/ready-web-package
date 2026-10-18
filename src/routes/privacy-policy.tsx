import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | HENRO" },
      { name: "description", content: "How HENRO collects, uses and protects your personal information when you shop with us." },
      { property: "og:title", content: "Privacy Policy | HENRO" },
      { property: "og:description", content: "How HENRO collects, uses and protects your personal information when you shop with us." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PrivacyPolicyPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl text-foreground">{title}</h2>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}

function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <p className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase">HENRO</p>
        <h1 className="font-display text-4xl text-foreground">Privacy Policy</h1>
        <p className="text-xs text-muted-foreground">Last updated: October 2026</p>
      </header>

      <Section title="1. Who we are">
        <p>HENRO ("we", "us", "our") is an online clothing store selling shirts through this website, operated from G - 601, Happy Residency, opposite to Rebounce, Vesu, Surat (Gujarat) - 395007, India. This policy explains what personal information we collect when you visit or shop with us, and how we use it, in line with the Digital Personal Data Protection Act, 2023 (India).</p>
      </Section>

      <Section title="2. Information we collect">
        <p>When you place an order we collect your name, email address, phone number, and shipping address, along with the items you purchased and the order value.</p>
        <p>If you subscribe to our newsletter, we collect your email address.</p>
        <p>Payment details (card, UPI, net-banking) are entered directly on our payment partner's secure page — we never see or store your card or bank details.</p>
      </Section>

      <Section title="3. How we use your information">
        <p>We use your information to process and deliver your order, contact you about your order, handle returns and refunds, send newsletters you subscribed to (you can unsubscribe anytime), and improve our store.</p>
        <p>We do not sell your personal information to anyone.</p>
      </Section>

      <Section title="4. Who we share it with">
        <p>We share your details only with the partners needed to serve you: our payment processor (to collect payment), our courier/shipping partners (to deliver your order), and our website hosting and database providers (to run the store securely).</p>
      </Section>

      <Section title="5. Data security">
        <p>Your data is stored on secure servers with encryption in transit. Access to order and customer information is restricted to the store owner through a password-protected admin area.</p>
      </Section>

      <Section title="6. Your rights">
        <p>You may ask us to see, correct, or delete your personal information at any time by emailing <a className="text-primary underline underline-offset-4" href="mailto:support@henro.in">support@henro.in</a>. We will respond within a reasonable time.</p>
      </Section>

      <Section title="7. Cookies">
        <p>We use only essential browser storage needed to keep your shopping bag and sign-in session working. We do not use advertising or tracking cookies.</p>
      </Section>

      <Section title="8. Changes to this policy">
        <p>If we update this policy, the new version will be posted on this page with a revised date.</p>
      </Section>

      <Section title="9. Contact">
        <p>For any privacy question or request, email <a className="text-primary underline underline-offset-4" href="mailto:support@henro.in">support@henro.in</a>.</p>
        <p>You can also write to us at: HENRO — G - 601, Happy Residency, opposite to Rebounce, Vesu, Surat (Gujarat) - 395007, India.</p>
      </Section>
    </div>
  );
}
