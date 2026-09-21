import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/services/store";
import { STATUS_LABELS } from "@/services/shipmentService";

interface Result {
  id: string;
  title: string;
  meta: string;
  to: string;
}

export function GlobalSearch({ className }: { className?: string }) {
  const state = useAppState();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo<Result[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const shipments = state.shipments
      .filter((s) =>
        [s.code, s.item.name, s.item.category, s.route.fromCity, s.route.toCity, s.senderName, s.travelerName ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 6)
      .map<Result>((s) => ({
        id: s.id,
        title: `${s.code} · ${s.item.name}`,
        meta: `${s.route.fromCity.split(",")[0]} → ${s.route.toCity.split(",")[0]} · ${STATUS_LABELS[s.status]}`,
        to: `/shipments/${s.id}`,
      }));

    const flights = state.flights
      .filter((f) => [f.flightNumber, f.travelerName, f.fromCity, f.toCity].join(" ").toLowerCase().includes(q))
      .slice(0, 3)
      .map<Result>((f) => ({
        id: f.id,
        title: `${f.flightNumber} · ${f.travelerName}`,
        meta: `${f.fromAirport} → ${f.toAirport} · ${f.date}`,
        to: "/traveler/flights",
      }));

    return [...shipments, ...flights];
  }, [query, state.shipments, state.flights]);

  return (
    <div className={className}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 150)}
          placeholder="Search shipment ID, route, traveler, category"
          aria-label="Search shipments, routes and travelers"
          className="h-10 rounded-xl border-border bg-surface pl-9"
        />
        {open && results.length > 0 ? (
          <ul className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-[var(--shadow-lift)]">
            {results.map((r) => (
              <li key={`${r.to}-${r.id}`}>
                <button
                  type="button"
                  className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-muted"
                  onMouseDown={() => {
                    setQuery("");
                    setOpen(false);
                    navigate({ to: r.to });
                  }}
                >
                  <span className="text-sm font-semibold">{r.title}</span>
                  <span className="text-xs text-muted-foreground">{r.meta}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {open && query.trim().length >= 2 && results.length === 0 ? (
          <div className="absolute z-50 mt-2 w-full rounded-xl border border-border bg-popover px-4 py-3 text-sm text-muted-foreground shadow-[var(--shadow-lift)]">
            No matches for “{query}”.
          </div>
        ) : null}
      </div>
    </div>
  );
}
