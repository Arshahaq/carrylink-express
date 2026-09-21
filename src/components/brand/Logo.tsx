import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWord = true,
  subtitle,
}: {
  className?: string;
  showWord?: boolean;
  subtitle?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17h4l3-5" />
          <path d="M21 7h-4l-3 5" />
          <path d="M10 12h4" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
          <path d="M5 7h3.5" />
          <path d="M15.5 17H19" />
        </svg>
      </span>
      {showWord ? (
        <span className="flex flex-col leading-none">
          <span className="text-[1.05rem] font-extrabold tracking-[0.14em] text-foreground">
            AIRBRIDGE
          </span>
          {subtitle ? (
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {subtitle}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
