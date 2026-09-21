import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  FileCheck2,
  Fingerprint,
  KeyRound,
  Package,
  Plane,
  QrCode,
  Route as RouteIcon,
  ScanLine,
  ShieldCheck,
  Timer,
  UserCheck,
} from "lucide-react";
import { MarketingPage } from "@/components/marketing/SiteChrome";
import { Pill, DemoTag } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AIRBRIDGE — Send What Matters. Travel What Matters." },
      {
        name: "description",
        content:
          "AIRBRIDGE connects people who need to move eligible items internationally with verified travelers already flying to their destination.",
      },
      { property: "og:title", content: "AIRBRIDGE — Send What Matters. Travel What Matters." },
      {
        property: "og:description",
        content:
          "Item eligibility checks, verified traveler matching, QR + OTP handover and a transparent chain of custody.",
      },
    ],
  }),
  component: Landing,
});

const trustPoints = [
  { icon: Fingerprint, label: "Identity verification" },
  { icon: Plane, label: "Flight verification" },
  { icon: FileCheck2, label: "Item eligibility checks" },
  { icon: QrCode, label: "Secure handover" },
  { icon: KeyRound, label: "OTP delivery confirmation" },
];

const routes = [
  { from: "Bengaluru", to: "Dubai", travelers: 6, next: "25 Sep" },
  { from: "Bengaluru", to: "London", travelers: 4, next: "02 Oct" },
  { from: "Mumbai", to: "Singapore", travelers: 3, next: "28 Sep" },
];

const chain = [
  { icon: Package, title: "Sender", body: "Describes an eligible item" },
  { icon: ShieldCheck, title: "AIRBRIDGE", body: "Eligibility + matching" },
  { icon: UserCheck, title: "Verified Traveler", body: "Accepts and inspects" },
  { icon: Plane, title: "International Flight", body: "Carried in person" },
  { icon: BadgeCheck, title: "Recipient", body: "Confirms with OTP" },
];

const steps = [
  {
    no: "01",
    title: "Describe Your Item",
    body: "Choose the category and provide item details.",
    icon: Package,
  },
  {
    no: "02",
    title: "Find a Verified Traveler",
    body: "AIRBRIDGE finds travelers flying along your route.",
    icon: RouteIcon,
  },
  {
    no: "03",
    title: "Secure Handover",
    body: "Both parties verify the package using QR/OTP.",
    icon: ScanLine,
  },
  {
    no: "04",
    title: "Confirm Delivery",
    body: "Recipient confirms delivery and the shipment is completed.",
    icon: BadgeCheck,
  },
];

const safety = [
  {
    icon: Fingerprint,
    title: "Identity Verification",
    body: "Users go through demo identity verification before participating.",
  },
  {
    icon: Plane,
    title: "Flight Verification",
    body: "Traveler's flight information is verified in the prototype.",
  },
  {
    icon: FileCheck2,
    title: "Item Eligibility",
    body: "The system checks item category, weight, value, battery information and destination.",
  },
  {
    icon: QrCode,
    title: "Secure Handover",
    body: "QR code + OTP + timestamp are recorded.",
  },
  {
    icon: Timer,
    title: "Chain of Custody",
    body: "Every important package event is recorded.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Detection",
    body: "Suspicious shipments can be flagged for review.",
  },
];

function Landing() {
  return (
    <MarketingPage>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at 70% 20%, black, transparent 70%)",
          }}
        />
        <div className="container-page relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="animate-rise">
            <Pill tone="info" icon={ShieldCheck}>
              Verified traveler delivery network
            </Pill>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
              Send What Matters.
              <br />
              Travel What Matters.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              AIRBRIDGE connects people who need to move eligible items internationally with verified
              travelers already flying to their destination.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/login">
                  Send an Item
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/login">Become a Traveler</Link>
              </Button>
            </div>

            <ul className="mt-9 grid gap-2.5 sm:grid-cols-2">
              {trustPoints.map((t) => (
                <li key={t.label} className="flex items-center gap-2.5 text-sm font-medium">
                  <span className="grid size-7 place-items-center rounded-lg bg-success-soft text-success">
                    <t.icon className="size-4" aria-hidden />
                  </span>
                  {t.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Flow visual */}
          <div className="animate-rise card-soft p-6 lg:p-7">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
                How a shipment moves
              </p>
              <DemoTag>Prototype</DemoTag>
            </div>

            <ol className="mt-5 space-y-3">
              {chain.map((c, i) => (
                <li key={c.title} className="relative">
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                      <c.icon className="size-4.5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{c.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{c.body}</p>
                    </div>
                  </div>
                  {i < chain.length - 1 ? (
                    <span aria-hidden className="ml-8 block h-3 w-px bg-border-strong" />
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-xl border border-border p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                Popular routes
              </p>
              <ul className="mt-3 space-y-2.5">
                {routes.map((r) => (
                  <li key={`${r.from}-${r.to}`} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      {r.from}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <span className="h-px w-5 bg-border-strong" />
                        <Plane className="size-3.5 rotate-45" aria-hidden />
                        <span className="h-px w-5 bg-border-strong" />
                      </span>
                      {r.to}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {r.travelers} travelers · next {r.next}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-16 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight">How AIRBRIDGE works</h2>
          <p className="mt-3 text-muted-foreground">
            Four clear steps. You always know what stage your shipment is on and what happens next.
          </p>
        </div>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.no} className="card-soft p-6 transition-shadow hover:shadow-[var(--shadow-lift)]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-accent">{s.no}</span>
                <span className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground">
                  <s.icon className="size-4.5" aria-hidden />
                </span>
              </div>
              <h3 className="mt-4 text-base font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link to="/how-it-works">
              See the full walkthrough
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>

      {/* Safety */}
      <section className="border-y border-border bg-surface py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-2xl">
            <Pill tone="success">Trust layer</Pill>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Built Around Trust</h2>
            <p className="mt-3 text-muted-foreground">
              Every shipment passes through eligibility checks, verified travelers and a recorded chain
              of custody. In this prototype these services are simulated demo services.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {safety.map((s) => (
              <article key={s.title} className="card-soft p-6">
                <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link to="/safety">Read the safety model</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/about">About the prototype</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Two sides */}
      <section className="container-page grid gap-5 py-16 lg:grid-cols-2 lg:py-20">
        <article className="card-soft flex flex-col p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-accent">
            <Package className="size-5" aria-hidden />
          </span>
          <h3 className="mt-5 text-xl font-bold">For senders</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Move eligible documents and small items with someone already flying your route. Check
            eligibility, compare matched travelers and track every custody event.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/login">Send an Item</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/for-senders">Learn more</Link>
            </Button>
          </div>
        </article>

        <article className="card-soft flex flex-col p-7">
          <span className="grid size-11 place-items-center rounded-xl bg-success-soft text-success">
            <Plane className="size-5" aria-hidden />
          </span>
          <h3 className="mt-5 text-xl font-bold">For travelers</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Share your upcoming international journey, set your spare capacity and review only requests
            that match your route, schedule and accepted categories.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/login">Become a Traveler</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/for-travelers">Learn more</Link>
            </Button>
          </div>
        </article>
      </section>

      <section className="border-t border-border bg-surface py-14">
        <div className="container-page flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Try the full demo flow</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Sign in with the demo accounts to walk through sending, carrying, handover, delivery and
              the operations console.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/login">
              Open the demo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </section>
    </MarketingPage>
  );
}
