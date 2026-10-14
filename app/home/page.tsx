// app/home/page.tsx
// UI ONLY: all data below is placeholder. Replace the arrays with real Supabase data later.
// Uses: Tailwind v3 + shadcn tokens (bg-background, bg-card, border-border, ...), lucide-react,
// and your existing components/theme-toggle.tsx.

import Link from "next/link";
import {
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  Clapperboard,
  Clock,
  Heart,
  LogOut,
  MapPin,
  MessageSquare,
  Scissors,
  Search,
  Star,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppHeader } from "@/components/app-header";

/* ---------------------------- placeholder data ---------------------------- */

const NAV = [
  { label: "Home", href: "/home", active: true },
  { label: "Explore", href: "/explore" },
  { label: "Bookings", href: "#" },
  { label: "Messages", href: "#" },
  { label: "Saved", href: "#" },
];

const CATEGORIES = [
  { label: "Photographers", icon: Camera },
  { label: "Videographers", icon: Clapperboard },
  { label: "Editors", icon: Scissors },
];

const CREATIVES = [
  { name: "Creative Name", specialty: "Wedding photographer", city: "Angeles City", rating: 4.9, price: 4500, available: true, tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { name: "Creative Name", specialty: "Event videographer", city: "San Fernando", rating: 4.8, price: 6000, available: true, tone: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300" },
  { name: "Creative Name", specialty: "Portrait photographer", city: "Tarlac City", rating: 4.7, price: 3000, available: false, tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { name: "Creative Name", specialty: "Photo and video editor", city: "Remote", rating: 4.9, price: 1500, available: true, tone: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300" },
];

const ACTIVITY = [
  { text: "Your request was accepted by Creative Name", time: "2 hours ago" },
  { text: "New message from Creative Name", time: "Yesterday" },
  { text: "You saved Creative Name", time: "2 days ago" },
];

const SAVED = ["Creative Name", "Creative Name", "Creative Name"];

/* --------------------------------- helpers -------------------------------- */

const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action && (
          <Link
            href="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#1d8bf8] hover:underline"
          >
            {action}
            <ChevronRight size={16} aria-hidden="true" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f1f4f9] text-foreground dark:bg-background">
      {/* ------------------------------ top bar ------------------------------ */}
      <AppHeader />

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8 sm:px-6">
        {/* ----------------------------- search hero ---------------------------- */}
        <section className="rounded-3xl bg-slate-900 p-6 text-white sm:p-10 dark:bg-card dark:ring-1 dark:ring-border">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
            Good morning, Juan. Who do you want to book?
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-300 sm:text-base">
            Search by service, city and event date. Only creatives free on that date will show as
            available.
          </p>

          <form
            role="search"
            className="mt-6 grid gap-2 rounded-2xl bg-white p-2 text-slate-900 sm:grid-cols-[1.4fr_1fr_1fr_auto]"
          >
            <label className="flex items-center gap-2 rounded-xl px-3 py-2 focus-within:bg-slate-100">
              <Search size={18} className="text-slate-400" aria-hidden="true" />
              <span className="sr-only">What do you need</span>
              <input
                placeholder="Wedding photographer"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <label className="relative flex items-center gap-2 rounded-xl px-3 py-2 focus-within:bg-slate-100 sm:before:absolute sm:before:-left-1 sm:before:top-1/2 sm:before:h-6 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-slate-200">
              <MapPin size={18} className="text-slate-400" aria-hidden="true" />
              <span className="sr-only">City</span>
              <input
                placeholder="City"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <label className="relative flex items-center gap-2 rounded-xl px-3 py-2 focus-within:bg-slate-100 sm:before:absolute sm:before:-left-1 sm:before:top-1/2 sm:before:h-6 sm:before:w-px sm:before:-translate-y-1/2 sm:before:bg-slate-200">
              <Calendar size={18} className="text-slate-400" aria-hidden="true" />
              <span className="sr-only">Event date</span>
              <input
                type="date"
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <button
              type="submit"
              className="rounded-xl bg-[#1d8bf8] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1479d6] active:scale-95"
            >
              Search
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
              >
                <Icon size={16} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ---------------------------- status cards ---------------------------- */}
        <section className="mt-6 grid gap-4 md:grid-cols-3" aria-label="Your bookings and messages">
          {/* Next booking */}
          <article className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">Next booking</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                Accepted
              </span>
            </div>
            <p className="mt-3 text-lg font-semibold">Wedding shoot</p>
            <p className="text-sm text-muted-foreground">with Creative Name</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={16} aria-hidden="true" /> Sat, Nov 22
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={16} aria-hidden="true" /> 9:00 AM
              </span>
            </div>
          </article>

          {/* Pending requests */}
          <article className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">Pending requests</h2>
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                Awaiting reply
              </span>
            </div>
            <p className="mt-3 text-lg font-semibold">2 requests sent</p>
            <p className="text-sm text-muted-foreground">
              Creatives usually reply within a day.
            </p>
            <Link
              href="#"
              className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#1d8bf8] hover:underline"
            >
              View requests
              <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </article>

          {/* Messages */}
          <article className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground">Messages</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1d8bf8]/10 px-2.5 py-1 text-xs font-medium text-[#1d8bf8]">
                <MessageSquare size={12} aria-hidden="true" /> 3 unread
              </span>
            </div>
            <ul className="mt-3 space-y-3">
              {[1, 2].map((i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold"
                  >
                    CN
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">Creative Name</p>
                    <p className="truncate text-sm text-muted-foreground">
                      Latest message preview goes here
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* -------------------------- creatives to explore ---------------------- */}
        <Section title="Creatives to explore" action="See all">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREATIVES.map((c, i) => (
              <li
                key={i}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-[#1d8bf8]/50"
              >
                <div className={`relative flex h-36 items-center justify-center text-4xl font-semibold ${c.tone}`}>
                  {initials(c.name)}
                  <button
                    type="button"
                    aria-label={`Save ${c.name}`}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-600 transition hover:text-rose-500 dark:bg-black/30 dark:text-slate-200"
                  >
                    <Heart size={16} aria-hidden="true" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{c.name}</h3>
                      <p className="truncate text-sm text-muted-foreground">{c.specialty}</p>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium">
                      <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                      {c.rating}
                    </span>
                  </div>
                  <p className="mt-2 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} aria-hidden="true" /> {c.city}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm">
                      <span className="text-muted-foreground">From </span>
                      <span className="font-semibold">{peso(c.price)}</span>
                    </p>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        c.available
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.available ? "Available" : "Booked"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* ----------------------- recent activity + saved ---------------------- */}
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
            <ul className="mt-4 divide-y divide-border">
              {ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-3">
                  <p className="text-sm">{a.text}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.time}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">Saved creatives</h2>
              <Link href="#" className="text-sm font-medium text-[#1d8bf8] hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-4 space-y-3">
              {SAVED.map((name, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xs font-semibold"
                  >
                    {initials(name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">Specialty · City</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
}