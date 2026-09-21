import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "How It Works", to: "/how-it-works" },
  { label: "Safety", to: "/safety" },
  { label: "For Travelers", to: "/for-travelers" },
  { label: "For Senders", to: "/for-senders" },
  { label: "About", to: "/about" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="focus-ring rounded-lg" aria-label="AIRBRIDGE home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="focus-ring rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-foreground bg-muted" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </Button>
        </div>
      </div>

      {open ? (
        <nav aria-label="Mobile" className="animate-fade border-t border-border bg-background lg:hidden">
          <ul className="container-page py-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-2 py-2.5 text-sm font-semibold text-accent"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page flex flex-col gap-6 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A Smart India Hackathon prototype. Identity, flight, payment and eligibility services shown
            here are simulated demo services, not live government, airline or customs integrations.
          </p>
        </div>
        <nav aria-label="Footer" className="grid gap-2 text-sm">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
          <Link to="/login" className="font-semibold text-accent">
            Login
          </Link>
        </nav>
      </div>
      <div className="container-page border-t border-border py-5 text-xs text-muted-foreground">
        Transport of any item remains subject to applicable airline, airport, customs and legal
        requirements. © {new Date().getFullYear()} AIRBRIDGE (prototype).
      </div>
    </footer>
  );
}

export function MarketingPage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className={className ?? "flex-1"}>{children}</main>
      <SiteFooter />
    </div>
  );
}
