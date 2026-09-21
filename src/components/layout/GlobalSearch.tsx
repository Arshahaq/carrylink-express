import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/services/store";
import { STATUS_LABELS } from "@/services/shipmentService";

interface Result {
  id: string;
  type: "Shipment" | "Flight" | "User" | "Message" | "Page";
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
        type: "Shipment",
        title: `${s.code} · ${s.item.name}`,
        meta: `${s.route.fromCity.split(",")[0]} → ${s.route.toCity.split(",")[0]} · ${STATUS_LABELS[s.status]}`,
        to: `/shipments/${s.id}`,
      }));

    const flights = state.flights
      .filter((f) => [f.flightNumber, f.travelerName, f.fromCity, f.toCity].join(" ").toLowerCase().includes(q))
      .slice(0, 3)
      .map<Result>((f) => ({
        id: f.id,
        type: "Flight",
        title: `${f.flightNumber} · ${f.travelerName}`,
        meta: `${f.fromAirport} → ${f.toAirport} · ${f.date}`,
        to: "/traveler/flights",
      }));

    const users = state.users
      .filter((user) => [user.name, user.email, user.role].join(" ").toLowerCase().includes(q))
      .slice(0, 4)
      .map<Result>((user) => ({
        id: user.id,
        type: "User",
        title: user.name,
        meta: `${user.email} · ${user.role}`,
        to: "/profile",
      }));

    const messages = state.messages
      .filter((message) => message.body.toLowerCase().includes(q))
      .slice(0, 4)
      .map<Result>((message) => ({
        id: message.id,
        type: "Message",
        title: message.body.slice(0, 60),
        meta: `${message.authorName} · Messages`,
        to: "/messages",
      }));

    const pages: Result[] = [
      { id: "page-sender", type: "Page", title: "Sender Dashboard", meta: "Workspace page", to: "/sender/dashboard" },
      { id: "page-traveler", type: "Page", title: "Traveler Dashboard", meta: "Travel & Carry page", to: "/traveler/dashboard" },
      { id: "page-admin", type: "Page", title: "Operations Center", meta: "Admin page", to: "/admin" },
      { id: "page-notifications", type: "Page", title: "Notifications", meta: "Shared updates", to: "/notifications" },
    ].filter((page) => `${page.title} ${page.meta}`.toLowerCase().includes(q));

    return [...shipments, ...flights, ...users, ...messages, ...pages];
  }, [query, state.flights, state.messages, state.shipments, state.users]);

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
                  <span className="flex items-center gap-2 text-sm font-semibold"><span className="rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">{r.type}</span>{r.title}</span>
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
