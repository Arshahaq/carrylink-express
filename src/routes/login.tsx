import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, Copy, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { DemoTag, Pill } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHydrated } from "@/hooks/useAuth";
import { login } from "@/services/authService";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — AIRBRIDGE" },
      {
        name: "description",
        content:
          "Sign in to AIRBRIDGE with the demo sender, traveler or operations account to explore the full prototype flow.",
      },
      { property: "og:title", content: "Login — AIRBRIDGE" },
      {
        property: "og:description",
        content: "One login for both sides of the platform: send items or carry them as a verified traveler.",
      },
    ],
  }),
  component: LoginPage,
});

const demoAccounts = [
  {
    title: "Demo User 1 — Sender / Traveler",
    name: "Shahan Haq",
    email: "sender@airbridge.demo",
    password: "Demo@123",
  },
  {
    title: "Demo User 2 — Traveler / Sender",
    name: "Rahul Sharma",
    email: "traveler@airbridge.demo",
    password: "Demo@123",
  },
  {
    title: "Operations (admin)",
    name: "AIRBRIDGE Operations",
    email: "admin@airbridge.demo",
    password: "Admin@123",
  },
];

function LoginPage() {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setError(null);
  }, [email, password]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hydrated) return;
    if (!email.trim() || !password) {
      setError("Enter both your email address and password.");
      return;
    }
    setBusy(true);
    const result = login(email, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error ?? "Unable to sign in.");
      return;
    }
    toast.success(`Welcome back, ${result.user!.name.split(" ")[0]}`);
    navigate({ to: result.user!.role === "admin" ? "/admin" : "/select-mode" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Brand panel */}
      <aside className="hidden flex-col justify-between border-r border-border bg-surface p-10 lg:flex">
        <Link to="/" className="focus-ring w-fit rounded-lg">
          <Logo />
        </Link>
        <div className="max-w-md">
          <Pill tone="info" icon={ShieldCheck}>
            One account, both sides
          </Pill>
          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight">
            Send an item or carry one — with the same verified account.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            After signing in you choose how you want to use AIRBRIDGE. You can switch between sender and
            traveler mode at any time from your profile.
          </p>
          <ul className="mt-7 space-y-2.5 text-sm font-medium">
            {[
              "Item eligibility checks before matching",
              "Verified travelers on your exact route",
              "QR + OTP handover and delivery",
              "Recorded chain of custody",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <span className="grid size-6 place-items-center rounded-md bg-success-soft text-success">
                  <ShieldCheck className="size-3.5" aria-hidden />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-muted-foreground">
          Prototype for demonstration. Identity, flight and payment services shown here are simulated.
        </p>
      </aside>

      {/* Form */}
      <main className="flex items-center justify-center bg-background px-5 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden">
            <Link to="/" className="focus-ring inline-block rounded-lg">
              <Logo />
            </Link>
          </div>

          <h1 className="mt-8 text-2xl font-bold tracking-tight lg:mt-0">Sign in to AIRBRIDGE</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            One login for senders, travelers and operations.
          </p>

          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sender@airbridge.demo"
                  className="h-11 pl-9"
                  aria-invalid={Boolean(error)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Demo@123"
                  className="h-11 pl-9"
                  aria-invalid={Boolean(error)}
                />
              </div>
            </div>

            {error ? (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive-soft px-3 py-2.5 text-sm font-medium text-destructive"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden />
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </form>

          <section className="mt-8 rounded-xl border border-border bg-surface p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold">Demo credentials</h2>
              <DemoTag>Prototype</DemoTag>
            </div>
            <ul className="mt-4 space-y-3">
              {demoAccounts.map((a) => (
                <li key={a.email} className="rounded-lg border border-border bg-card p-3.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {a.title}
                  </p>
                  <p className="mt-1.5 font-mono text-sm font-semibold">{a.email}</p>
                  <p className="font-mono text-sm text-muted-foreground">{a.password}</p>
                  <div className="mt-2.5 flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEmail(a.email);
                        setPassword(a.password);
                        toast.success(`Filled credentials for ${a.name}`);
                      }}
                    >
                      <Copy className="size-3.5" aria-hidden />
                      Use this account
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            New here?{" "}
            <Link to="/how-it-works" className="font-semibold text-accent">
              See how AIRBRIDGE works
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
