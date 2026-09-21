import { useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Package,
  Plane,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Pill } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser, useHydrated } from "@/hooks/useAuth";
import { setMode } from "@/services/authService";

export const Route = createFileRoute("/select-mode")({
  head: () => ({
    meta: [
      { title: "Choose your mode — AIRBRIDGE" },
      {
        name: "description",
        content:
          "Use AIRBRIDGE to transport an eligible item or to carry items as a verified traveler on your next international flight.",
      },
      { property: "og:title", content: "Choose your mode — AIRBRIDGE" },
      {
        property: "og:description",
        content: "One account, two modes: sender and verified traveler. Switch anytime from your profile.",
      },
    ],
  }),
  component: SelectMode,
});

const senderFeatures = [
  "Find matching travelers",
  "Track shipment",
  "Secure handover",
  "Delivery confirmation",
];

const travelerFeatures = [
  "Add upcoming flight",
  "Set carrying capacity",
  "Review matched requests",
  "Earn a service reward",
];

function SelectMode() {
  const hydrated = useHydrated();
  const user = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) navigate({ to: "/login", replace: true });
    else if (user.role === "admin") navigate({ to: "/admin", replace: true });
  }, [hydrated, user, navigate]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-screen bg-surface p-8">
        <div className="mx-auto max-w-4xl space-y-4">
          <Skeleton className="h-10 w-72" />
          <div className="grid gap-5 md:grid-cols-2">
            <Skeleton className="h-80 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  function choose(mode: "sender" | "traveler") {
    setMode(mode);
    navigate({ to: mode === "sender" ? "/sender/dashboard" : "/traveler/dashboard" });
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="focus-ring rounded-lg">
            <Logo />
          </Link>
          <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user.avatarInitials}
            </span>
            <span className="hidden sm:inline">{user.name}</span>
          </span>
        </div>
      </header>

      <main className="container-page py-12 lg:py-16">
        <div className="max-w-2xl">
          <Pill tone="success" icon={ShieldCheck}>
            Demo Verified account
          </Pill>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            How would you like to use AIRBRIDGE?
          </h1>
          <p className="mt-3 text-muted-foreground">
            Pick a mode to continue. Your account works on both sides of the platform.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <article className="animate-rise card-soft flex flex-col p-7 transition-shadow hover:shadow-[var(--shadow-lift)]">
            <span className="grid size-12 place-items-center rounded-xl bg-accent-soft text-accent">
              <Package className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-bold">I Want to Transport an Item</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Send an eligible item to another country through a verified traveler.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {senderFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-success" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="mt-7 w-full" size="lg" onClick={() => choose("sender")}>
              Transport an Item
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </article>

          <article className="animate-rise card-soft flex flex-col p-7 transition-shadow hover:shadow-[var(--shadow-lift)]">
            <span className="grid size-12 place-items-center rounded-xl bg-success-soft text-success">
              <Plane className="size-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-xl font-bold">I Want to Travel &amp; Carry</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Share your upcoming international journey and carry eligible items for other users.
            </p>
            <ul className="mt-5 space-y-2 text-sm">
              {travelerFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-success" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
            <Button className="mt-7 w-full" size="lg" variant="secondary" onClick={() => choose("traveler")}>
              Become a Traveler
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </article>
        </div>

        <p className="mt-8 flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <RefreshCcw className="size-4" aria-hidden />
          You can switch modes anytime from your profile.
        </p>
      </main>
    </div>
  );
}
