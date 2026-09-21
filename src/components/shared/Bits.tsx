import { ArrowRight, Plane } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  eyebrow?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? <div className="mb-2 flex flex-wrap items-center gap-2">{eyebrow}</div> : null}
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
  hint?: string;
  tone?: "default" | "success" | "warning" | "accent";
}) {
  const toneRing = {
    default: "bg-muted text-muted-foreground",
    success: "bg-success-soft text-success",
    warning: "bg-warning-soft text-warning",
    accent: "bg-accent-soft text-accent",
  }[tone];

  return (
    <div className="card-soft p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Icon ? (
          <span className={cn("grid size-9 place-items-center rounded-lg", toneRing)}>
            <Icon className="size-4.5" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-3xl font-bold tabular-nums tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function RouteLine({
  from,
  to,
  flight,
  className,
}: {
  from: string;
  to: string;
  flight?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2 text-sm font-medium", className)}>
      <span>{from.split(",")[0]}</span>
      <span className="relative flex items-center gap-1 text-muted-foreground">
        <span className="h-px w-6 bg-border-strong" />
        <Plane className="size-3.5 rotate-45" aria-hidden />
        <span className="h-px w-6 bg-border-strong" />
      </span>
      <span>{to.split(",")[0]}</span>
      {flight ? (
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {flight}
        </span>
      ) : null}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="card-soft flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden />
      </span>
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}

export function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className={cn("mt-1 text-sm font-semibold", mono && "font-mono")}>{value}</dd>
    </div>
  );
}

export function SectionTitle({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-lg font-bold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}

export function LinkArrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent">
      {children}
      <ArrowRight className="size-4" aria-hidden />
    </span>
  );
}

export function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-border bg-surface px-3 py-2 text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
