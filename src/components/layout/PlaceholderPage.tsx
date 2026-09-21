import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Pill } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";

export function PlaceholderPage({
  title,
  description,
  eyebrow = "AIRBRIDGE Foundation",
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  eyebrow?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Pill tone="info" icon={ShieldCheck}>
            {eyebrow}
          </Pill>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">{title}</h1>
        </div>
        {actionLabel && actionHref ? (
          <Button asChild size="lg">
            <Link to={actionHref}>
              {actionLabel}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="card-soft p-8 md:p-10">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
          This is the AIRBRIDGE foundation layer for authenticated routing and protected app access. The
          full workflow for this area will be implemented in the next development phase.
        </div>
      </div>
    </div>
  );
}
