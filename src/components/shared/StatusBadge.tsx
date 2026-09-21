import { AlertTriangle, Check, CircleDot, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, STATUS_TONES, type StatusTone } from "@/services/shipmentService";
import type { RiskLevel, ShipmentStatus } from "@/types";

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-accent-soft text-accent border-accent/20",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-destructive-soft text-destructive border-destructive/20",
};

const toneIcon: Record<StatusTone, typeof Check> = {
  neutral: Clock,
  info: CircleDot,
  success: Check,
  warning: AlertTriangle,
  danger: X,
};

export function Pill({
  tone = "neutral",
  children,
  className,
  icon: IconOverride,
}: {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
  icon?: typeof Check | null;
}) {
  const Icon = IconOverride === null ? null : (IconOverride ?? toneIcon[tone]);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden /> : null}
      {children}
    </span>
  );
}

export function StatusBadge({ status, className }: { status: ShipmentStatus; className?: string }) {
  return (
    <Pill tone={STATUS_TONES[status]} className={className}>
      {STATUS_LABELS[status]}
    </Pill>
  );
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  const tone: StatusTone = risk === "low" ? "success" : risk === "medium" ? "warning" : "danger";
  return <Pill tone={tone}>{risk === "low" ? "Low" : risk === "medium" ? "Medium" : "High"}</Pill>;
}

export function VerifiedPill({ children = "Demo Verified" }: { children?: React.ReactNode }) {
  return <Pill tone="success">{children}</Pill>;
}

export function DemoTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </span>
  );
}
