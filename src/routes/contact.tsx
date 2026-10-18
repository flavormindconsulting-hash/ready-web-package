import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | HENRO" },
      { name: "description", content: "Reach the HENRO team — email support@henro.in or write to our Surat office for orders, returns and any question." },
      { property: "og:title", content: "Contact Us | HENRO" },
      { property: "og:description", content: "Reach the HENRO team — email support@henro.in or write to our Surat office for orders, returns and any question." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ContactPage,
});

const ADDRESS = "G - 601, Happy Residency, opposite to Rebounce, Vesu, Surat (Gujarat) - 395007, India";

function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-8 py-16 space-y-10">
      <header className="space-y-3">
        <p className="text-[10px] font-mono tracking-[0.3em] text-primary uppercase">HENRO</p>
        <h1 className="font-display text-4xl text-foreground">Contact Us</h1>
        <p className="text-sm text-muted-foreground max-w-xl">
          Questions about an order, a size, a return, or anything else — we read every message.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="border border-border rounded p-6 space-y-3">
          <Mail className="size-5 text-primary" />
          <h2 className="font-display text-lg text-foreground">Email us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The fastest way to reach us. Include your order number (it starts with "HN-") so we can help you faster.
          </p>
          <a
            className="inline-block text-sm text-primary underline underline-offset-4"
            href="mailto:support@henro.in"
          >
            support@henro.in
          </a>
        </div>

        <div className="border border-border rounded p-6 space-y-3">
          <MapPin className="size-5 text-primary" />
          <h2 className="font-display text-lg text-foreground">Write to us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{ADDRESS}</p>
        </div>
      </section>

      <section className="border border-border rounded p-6 space-y-3">
        <Clock className="size-5 text-primary" />
        <h2 className="font-display text-lg text-foreground">When can you expect a reply?</h2>
        <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
          <li>Order, shipping and sizing questions — within 1 working day.</li>
          <li>Return and exchange requests — return instructions within 2 working days.</li>
          <li>Refunds — processed within 5–7 working days after we receive and inspect your return.</li>
          <li>Complaints and grievances — resolved within 7 working days.</li>
        </ul>
        <p className="text-xs text-muted-foreground pt-1">
          For returns and refunds, please read our{" "}
          <a className="text-primary underline underline-offset-4" href="/returns-refunds">Return &amp; Refund Policy</a>.
          For how we handle your data, see our{" "}
          <a className="text-primary underline underline-offset-4" href="/privacy-policy">Privacy Policy</a>.
        </p>
      </section>
    </div>
  );
}
