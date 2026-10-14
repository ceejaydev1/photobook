"use client";

// app/bookings/page.tsx
// UI ONLY. Everything in INITIAL is placeholder data.
// One account can be both sides of a booking, so this page has two views:
//   "I booked"  -> role "client"   (bookings you made with other creatives)
//   "Requests"  -> role "creative" (people who asked to book you)

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Camera,
  Check,
  Clock,
  Film,
  MapPin,
  MessageSquare,
  Scissors,
  Star,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";

const CURRENCY = "₱";

type Role = "client" | "creative";
type Status = "pending" | "accepted" | "declined" | "completed" | "cancelled";
type Kind = "photo" | "video" | "edit";
type Tone = "blue" | "violet" | "green" | "amber";

type Booking = {
  id: string;
  role: Role;
  person: string;
  initials: string;
  tone: Tone;
  kind: Kind;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  deposit: number;
  status: Status;
  note: string;
};

const INITIAL: Booking[] = [
  { id: "b1", role: "client", person: "Creative Name", initials: "CN", tone: "blue", kind: "photo", service: "Wedding shoot", date: "Sat, Nov 22", time: "9:00 AM", location: "Angeles City", price: 18000, deposit: 5000, status: "accepted", note: "Ceremony at 10 AM, reception at 4 PM. Two shooters if possible." },
  { id: "b2", role: "client", person: "Creative Name", initials: "CN", tone: "violet", kind: "video", service: "Event videography", date: "Fri, Dec 5", time: "6:00 PM", location: "San Fernando", price: 12000, deposit: 3000, status: "pending", note: "Company year-end party, about 80 guests. Highlight reel of 2 to 3 minutes." },
  { id: "b3", role: "client", person: "Creative Name", initials: "CN", tone: "green", kind: "photo", service: "Portrait session", date: "Sun, Oct 5", time: "8:00 AM", location: "Tarlac City", price: 4500, deposit: 0, status: "completed", note: "Outdoor portraits, golden hour." },
  { id: "b4", role: "creative", person: "Maria Santos", initials: "MS", tone: "amber", kind: "photo", service: "Birthday coverage", date: "Sat, Nov 29", time: "2:00 PM", location: "Mabalacat", price: 7500, deposit: 2000, status: "pending", note: "Debut party, 120 guests. Need same-week preview photos." },
  { id: "b5", role: "creative", person: "Paolo Reyes", initials: "PR", tone: "blue", kind: "edit", service: "Wedding photo edit", date: "Wed, Nov 12", time: "Remote", location: "Online", price: 6000, deposit: 1500, status: "accepted", note: "400 RAW files, natural color grade. Delivery in 10 days." },
  { id: "b6", role: "creative", person: "Ana Dizon", initials: "AD", tone: "violet", kind: "video", service: "Product video", date: "Mon, Oct 20", time: "10:00 AM", location: "Clark", price: 9000, deposit: 0, status: "declined", note: "Short clips for an online shop." },
];

const TONE: Record<Tone, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

const STATUS: Record<Status, { label: string; cls: string }> = {
  pending: { label: "Awaiting reply", cls: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300" },
  accepted: { label: "Accepted", cls: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" },
  declined: { label: "Declined", cls: "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300" },
  completed: { label: "Completed", cls: "bg-slate-200 text-slate-700 dark:bg-slate-500/25 dark:text-slate-300" },
  cancelled: { label: "Cancelled", cls: "bg-slate-200 text-slate-700 dark:bg-slate-500/25 dark:text-slate-300" },
};

const KIND_ICON = { photo: Camera, video: Film, edit: Scissors };

type Tab = "upcoming" | "pending" | "past";
const TAB_STATUSES: Record<Tab, Status[]> = {
  upcoming: ["accepted"],
  pending: ["pending"],
  past: ["completed", "declined", "cancelled"],
};

const money = (n: number) => `${CURRENCY}${n.toLocaleString("en-PH")}`;

function Avatar({ b, size = "md" }: { b: Booking; size?: "md" | "lg" }) {
  return (
    <div
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${TONE[b.tone]} ${
        size === "lg" ? "h-14 w-14 text-base" : "h-10 w-10 text-sm"
      }`}
      aria-hidden
    >
      {b.initials}
    </div>
  );
}

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS[status].cls}`}>
      {STATUS[status].label}
    </span>
  );
}

const STEPS = ["Requested", "Confirmed", "Shoot day", "Delivered"];
const stepIndex = (s: Status) => (s === "pending" ? 0 : s === "accepted" ? 1 : s === "completed" ? 3 : -1);

function Progress({ status }: { status: Status }) {
  const current = stepIndex(status);
  if (current === -1) {
    return (
      <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
        {status === "declined" ? "This request was declined. The date is still free." : "This booking was cancelled."}
      </p>
    );
  }
  return (
    <ol className="grid grid-cols-4 gap-2">
      {STEPS.map((label, i) => (
        <li key={label} className="min-w-0">
          <div className={`h-1.5 rounded-full ${i <= current ? "bg-blue-600" : "bg-muted"}`} />
          <p className={`mt-2 truncate text-xs ${i <= current ? "font-medium text-foreground" : "text-muted-foreground"}`}>
            {label}
          </p>
        </li>
      ))}
    </ol>
  );
}

function Detail({ b, onStatus }: { b: Booking; onStatus: (id: string, s: Status) => void }) {
  const isCreative = b.role === "creative";
  const balance = b.price - b.deposit;
  const Icon = KIND_ICON[b.kind];
  return (
    <aside className="rounded-2xl border bg-card p-5 lg:sticky lg:top-24">
      <div className="flex items-start gap-3">
        <Avatar b={b} size="lg" />
        <div className="min-w-0 flex-1">
          <p className="text-sm text-muted-foreground">{isCreative ? "Requested by" : "Booked with"}</p>
          <h2 className="truncate text-lg font-semibold">{b.person}</h2>
          <div className="mt-1"><StatusBadge status={b.status} /></div>
        </div>
      </div>

      <div className="mt-5"><Progress status={b.status} /></div>

      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex items-center gap-3"><Icon className="h-4 w-4 text-muted-foreground" /><dt className="sr-only">Service</dt><dd className="font-medium">{b.service}</dd></div>
        <div className="flex items-center gap-3"><CalendarDays className="h-4 w-4 text-muted-foreground" /><dt className="sr-only">Date</dt><dd>{b.date}</dd></div>
        <div className="flex items-center gap-3"><Clock className="h-4 w-4 text-muted-foreground" /><dt className="sr-only">Time</dt><dd>{b.time}</dd></div>
        <div className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" /><dt className="sr-only">Location</dt><dd>{b.location}</dd></div>
      </dl>

      <div className="mt-5 rounded-xl bg-muted/60 p-3 text-sm">
        <p className="font-medium">Details from {isCreative ? "the client" : "you"}</p>
        <p className="mt-1 text-muted-foreground">{b.note}</p>
      </div>

      <div className="mt-5 space-y-2 border-t pt-4 text-sm">
        <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span>{money(b.price)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Deposit</span><span>{b.deposit ? money(b.deposit) : "None"}</span></div>
        <div className="flex justify-between font-semibold"><span>Balance on the day</span><span>{money(balance)}</span></div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {isCreative && b.status === "pending" && (
          <>
            <button onClick={() => onStatus(b.id, "accepted")} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              <Check className="h-4 w-4" /> Accept
            </button>
            <button onClick={() => onStatus(b.id, "declined")} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">
              <X className="h-4 w-4" /> Decline
            </button>
          </>
        )}
        {!isCreative && b.status === "pending" && (
          <button onClick={() => onStatus(b.id, "cancelled")} className="inline-flex flex-1 items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">
            Cancel request
          </button>
        )}
        {b.status === "accepted" && (
          <button onClick={() => onStatus(b.id, "cancelled")} className="inline-flex items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">
            Cancel booking
          </button>
        )}
        {!isCreative && b.status === "completed" && (
          <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
            <Star className="h-4 w-4" /> Leave a review
          </button>
        )}
        <Link href="/messages" className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-muted">
          <MessageSquare className="h-4 w-4" /> Message
        </Link>
      </div>
    </aside>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState(INITIAL);
  const [role, setRole] = useState<Role>("client");
  const [tab, setTab] = useState<Tab>("upcoming");
  const [selectedId, setSelectedId] = useState<string | null>("b1");

  const ofRole = useMemo(() => bookings.filter((b) => b.role === role), [bookings, role]);
  const counts = useMemo(
    () => ({
      upcoming: ofRole.filter((b) => TAB_STATUSES.upcoming.includes(b.status)).length,
      pending: ofRole.filter((b) => TAB_STATUSES.pending.includes(b.status)).length,
      past: ofRole.filter((b) => TAB_STATUSES.past.includes(b.status)).length,
    }),
    [ofRole]
  );
  const visible = ofRole.filter((b) => TAB_STATUSES[tab].includes(b.status));
  const selected = visible.find((b) => b.id === selectedId) ?? visible[0] ?? null;

  const setStatus = (id: string, status: Status) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  const switchRole = (r: Role) => {
    setRole(r);
    setTab(r === "creative" ? "pending" : "upcoming");
    setSelectedId(null);
  };

  const TABS: { id: Tab; label: string }[] = [
    { id: "upcoming", label: "Upcoming" },
    { id: "pending", label: role === "creative" ? "New requests" : "Awaiting reply" },
    { id: "past", label: "Past" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader active="Bookings" hasCreativeProfile />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Bookings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {role === "client" ? "Shoots you booked with other creatives." : "People who asked to book you."}
            </p>
          </div>

          <div role="tablist" aria-label="Booking view" className="inline-flex rounded-xl border bg-muted/50 p-1 text-sm">
            {([["client", "I booked"], ["creative", "Requests to me"]] as const).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                aria-selected={role === id}
                onClick={() => switchRole(id)}
                className={`rounded-lg px-4 py-1.5 font-medium transition-colors ${
                  role === id ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-1 overflow-x-auto border-b" role="tablist" aria-label="Booking status">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => { setTab(t.id); setSelectedId(null); }}
              className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                tab === t.id ? "border-blue-600 text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{counts[t.id]}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <section aria-label="Bookings list" className="space-y-3">
            {visible.length === 0 && (
              <div className="rounded-2xl border border-dashed p-10 text-center">
                <p className="font-medium">Nothing here yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {role === "client" ? "Find a creative on Explore and send your first booking request." : "New booking requests will show up here."}
                </p>
                {role === "client" && (
                  <Link href="/explore" className="mt-4 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Explore creatives
                  </Link>
                )}
              </div>
            )}

            {visible.map((b) => {
              const Icon = KIND_ICON[b.kind];
              const active = selected?.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedId(b.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left transition-colors hover:border-blue-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    active ? "border-blue-600 ring-1 ring-blue-600" : ""
                  }`}
                >
                  <Avatar b={b} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{b.service}</p>
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{b.person}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{b.date}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.time}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <StatusBadge status={b.status} />
                    <span className="text-sm font-semibold">{money(b.price)}</span>
                  </div>
                </button>
              );
            })}
          </section>

          {selected && <Detail b={selected} onStatus={setStatus} />}
        </div>
      </main>
    </div>
  );
}