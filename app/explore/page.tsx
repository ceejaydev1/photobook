"use client";

// app/explore/page.tsx
// UI ONLY. Everything in CREATIVES is placeholder data (studio names are made up).
// The filters work on that array so you can see how the page behaves; later,
// move the filtering to a Supabase query and read availability from the real calendar.
//
// Photos: each frame is a small drawn scene (<Scene />) standing in for a portfolio photo.
// When you have real images, replace <Scene /> in <CreativeCard> with <Image fill ... />.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { AppHeader } from "@/components/app-header";

/* ------------------------------- placeholder ------------------------------ */

type Service = "Photographer" | "Videographer" | "Editor";

type Creative = {
  id: string;
  name: string;
  service: Service;
  specialty: string;
  styles: string[];
  city: string;
  rating: number;
  reviews: number;
  from: number;
  busy: string[]; // ISO dates already booked. Real data comes from the creative's calendar.
  frames: number[]; // which scene (0 to 5) each of the 3 sample frames uses
};

const CREATIVES: Creative[] = [
  { id: "lumen-studio", name: "Lumen Studio", service: "Photographer", specialty: "Weddings and engagements", styles: ["Wedding", "Portrait"], city: "Angeles City", rating: 4.9, reviews: 128, from: 4500, busy: ["2026-11-22", "2026-11-29"], frames: [1, 0, 3] },
  { id: "harbor-frames", name: "Harbor Frames", service: "Videographer", specialty: "Event films", styles: ["Event", "Wedding"], city: "San Fernando", rating: 4.8, reviews: 94, from: 6000, busy: ["2026-11-22"], frames: [4, 2, 0] },
  { id: "quiet-hour", name: "Quiet Hour Photo", service: "Photographer", specialty: "Portraits and family sessions", styles: ["Portrait"], city: "Tarlac City", rating: 4.7, reviews: 61, from: 3000, busy: ["2026-11-15"], frames: [3, 5, 1] },
  { id: "cutroom", name: "Cutroom", service: "Editor", specialty: "Photo and video retouching", styles: ["Product", "Commercial"], city: "Remote", rating: 4.9, reviews: 203, from: 1500, busy: [], frames: [5, 2, 4] },
  { id: "northlight", name: "Northlight Visuals", service: "Videographer", specialty: "Product and brand films", styles: ["Commercial", "Product"], city: "Angeles City", rating: 4.6, reviews: 47, from: 8500, busy: ["2026-11-29"], frames: [2, 4, 5] },
  { id: "fieldnote", name: "Fieldnote Studio", service: "Photographer", specialty: "Corporate and live events", styles: ["Event", "Commercial"], city: "Mabalacat", rating: 4.8, reviews: 77, from: 3500, busy: [], frames: [0, 5, 2] },
  { id: "slow-roll", name: "Slow Roll Films", service: "Videographer", specialty: "Wedding highlight films", styles: ["Wedding"], city: "Clark", rating: 4.9, reviews: 112, from: 9500, busy: ["2026-11-22", "2026-12-06"], frames: [1, 3, 4] },
  { id: "grain-grid", name: "Grain & Grid", service: "Editor", specialty: "Album design and color grading", styles: ["Wedding", "Portrait"], city: "Remote", rating: 4.7, reviews: 58, from: 2000, busy: [], frames: [3, 1, 0] },
];

const CATEGORIES: { label: string; value: "All" | Service }[] = [
  { label: "All", value: "All" },
  { label: "Photographers", value: "Photographer" },
  { label: "Videographers", value: "Videographer" },
  { label: "Editors", value: "Editor" },
];

const STYLES = ["Wedding", "Portrait", "Event", "Product", "Commercial"];
const CITIES = ["All cities", ...Array.from(new Set(CREATIVES.map((c) => c.city))).sort()];
const MAX_BUDGET = 10000;

type Sort = "recommended" | "rating" | "price-asc" | "price-desc";

/* --------------------------------- helpers -------------------------------- */

const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;
const toDate = (iso: string) => new Date(`${iso}T00:00:00`);
const shortDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
const longDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-PH", { weekday: "long", month: "long", day: "numeric" });
const chipDate = (iso: string) =>
  toDate(iso).toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" });

const initialsOf = (name: string) =>
  name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// Local-time ISO (toISOString would shift the day for users ahead of UTC).
const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Saturdays and Sundays for the next 8 weekends. Most events are booked on these days.
function upcomingWeekends(weeks = 8) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + ((6 - start.getDay() + 7) % 7));
  const out: string[] = [];
  for (let w = 0; w < weeks; w++) {
    const sat = new Date(start);
    sat.setDate(start.getDate() + w * 7);
    const sun = new Date(sat);
    sun.setDate(sat.getDate() + 1);
    out.push(toISO(sat), toISO(sun));
  }
  return out;
}

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d8bf8]";

const field =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus-visible:border-[#1d8bf8] focus-visible:ring-2 focus-visible:ring-[#1d8bf8]/30";

/* ------------------------- drawn stand-in for a photo ------------------------- */

const PALETTES = [
  { sky: "#f4d9b8", sun: "#e8764b", far: "#b9806a", near: "#5b3a3a" }, // warm dusk
  { sky: "#cfe3f4", sun: "#fff4d6", far: "#7fa6c9", near: "#2e4a6b" }, // blue morning
  { sky: "#e5e0d3", sun: "#c9a24d", far: "#a9b394", near: "#4f6a4a" }, // sage
  { sky: "#f2d4d7", sun: "#fbf1e8", far: "#c98a9b", near: "#6b3a52" }, // rose
  { sky: "#1f2a44", sun: "#f3e3b0", far: "#34476e", near: "#101827" }, // night
  { sky: "#efe7da", sun: "#d9805f", far: "#c9b79a", near: "#3d3a35" }, // sand
];

function Scene({ tone }: { tone: number }) {
  const p = PALETTES[tone % PALETTES.length];
  return (
    <svg
      viewBox="0 0 400 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
    >
      <rect width="400" height="500" fill={p.sky} />
      {tone === 0 && (
        <>
          <circle cx="200" cy="300" r="70" fill={p.sun} />
          <path d="M0 360Q120 300 240 350T400 330V500H0Z" fill={p.far} />
          <path d="M0 420Q150 380 300 430T400 410V500H0Z" fill={p.near} />
        </>
      )}
      {tone === 1 && (
        <>
          <circle cx="200" cy="230" r="42" fill={p.sun} />
          <rect y="400" width="400" height="100" fill={p.far} />
          <path
            fillRule="evenodd"
            fill={p.near}
            d="M0 0H400V500H0Z M120 500V250a80 80 0 0 1 160 0V500Z"
          />
        </>
      )}
      {tone === 2 && (
        <>
          <circle cx="290" cy="150" r="90" fill={p.sun} />
          <rect y="330" width="400" height="170" fill={p.far} />
          <path d="M0 500V400L400 450V500Z" fill={p.near} />
        </>
      )}
      {tone === 3 && (
        <>
          <circle cx="120" cy="140" r="50" fill={p.sun} />
          <path d="M-20 300L420 180V230L-20 350Z" fill={p.far} />
          <path d="M-20 380L420 260V310L-20 430Z" fill={p.far} />
          <rect y="450" width="400" height="50" fill={p.near} />
        </>
      )}
      {tone === 4 && (
        <>
          <circle cx="260" cy="140" r="44" fill={p.sun} />
          <rect y="300" width="400" height="200" fill={p.far} />
          <rect x="120" y="340" width="160" height="6" fill={p.sun} opacity=".5" />
          <rect x="150" y="370" width="100" height="6" fill={p.sun} opacity=".5" />
          <rect x="170" y="400" width="60" height="6" fill={p.sun} opacity=".5" />
          <rect y="450" width="400" height="50" fill={p.near} />
        </>
      )}
      {tone === 5 && (
        <>
          <circle cx="90" cy="170" r="38" fill={p.sun} />
          <rect x="40" y="300" width="60" height="200" fill={p.far} />
          <rect x="120" y="260" width="50" height="240" fill={p.far} />
          <rect x="200" y="330" width="70" height="170" fill={p.far} />
          <rect x="290" y="280" width="60" height="220" fill={p.far} />
          <rect y="390" width="90" height="110" fill={p.near} />
          <rect x="100" y="420" width="80" height="80" fill={p.near} />
          <rect x="190" y="380" width="70" height="120" fill={p.near} />
          <rect x="270" y="430" width="130" height="70" fill={p.near} />
        </>
      )}
    </svg>
  );
}

/* ---------------------------------- card ---------------------------------- */

function CreativeCard({
  creative: c,
  date,
  saved,
  onToggleSave,
}: {
  creative: Creative;
  date: string;
  saved: boolean;
  onToggleSave: () => void;
}) {
  const free = date ? !c.busy.includes(date) : null;
  const palette = PALETTES[c.frames[0] % PALETTES.length];

  return (
    <li
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lg motion-reduce:transition-none ${
        free === false ? "opacity-80" : ""
      }`}
    >
      {/* Work first: one large frame and two smaller ones, all visible at once */}
      <div className="relative">
        <div className="grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-0.5 overflow-hidden bg-card">
          <div className="relative col-span-2 row-span-2 overflow-hidden">
            <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
              <Scene tone={c.frames[0]} />
            </div>
          </div>
          <div className="relative overflow-hidden">
            <Scene tone={c.frames[1]} />
          </div>
          <div className="relative overflow-hidden">
            <Scene tone={c.frames[2]} />
          </div>
        </div>

        <span className="absolute left-3 top-3 z-10 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-slate-800">
          {c.service}
        </span>

        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${c.name} from saved` : `Save ${c.name}`}
          className={`absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 transition-colors hover:text-[#1d8bf8] ${FOCUS}`}
        >
          <Heart
            size={16}
            aria-hidden="true"
            className={saved ? "fill-[#1d8bf8] text-[#1d8bf8]" : ""}
          />
        </button>

        {free !== null && (
          <span
            className={`absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white ${
              free ? "bg-emerald-600" : "bg-slate-900/85"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${free ? "bg-white" : "bg-slate-400"}`}
            />
            {free ? `Free ${shortDate(date)}` : `Booked ${shortDate(date)}`}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold"
            style={{ background: palette.sky, color: palette.near }}
          >
            {initialsOf(c.name)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold leading-tight tracking-tight">
              {/* The link covers the whole card; the save button above it sits on top with z-10 */}
              <Link
                href={`/creatives/${c.id}`}
                className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[#1d8bf8]"
              >
                {c.name}
              </Link>
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin size={13} aria-hidden="true" />
              {c.city}
            </p>
          </div>
          <p className="flex shrink-0 items-center gap-1 text-sm">
            <Star size={14} aria-hidden="true" className="fill-amber-400 text-amber-400" />
            <span className="font-medium tabular-nums">{c.rating.toFixed(1)}</span>
            <span className="text-muted-foreground tabular-nums">({c.reviews})</span>
          </p>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">{c.specialty}</p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Styles">
          {c.styles.map((s) => (
            <li
              key={s}
              className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3 [margin-top:1.25rem]">
          <p className="text-sm">
            <span className="text-muted-foreground">From </span>
            <span className="font-semibold tabular-nums">{peso(c.from)}</span>
          </p>
          <span className="text-sm font-medium text-[#1d8bf8]">View profile</span>
        </div>
      </div>
    </li>
  );
}

/* ---------------------------------- page ---------------------------------- */

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | Service>("All");
  const [date, setDate] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [city, setCity] = useState("All cities");
  const [maxPrice, setMaxPrice] = useState(MAX_BUDGET);
  const [styles, setStyles] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>("recommended");
  const [saved, setSaved] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [weekends, setWeekends] = useState<string[]>([]);

useEffect(() => {
  setWeekends(upcomingWeekends());
}, []);

  // How many creatives in the chosen category are free on each weekend day.
  const freeByDate = useMemo(() => {
    const pool = CREATIVES.filter((c) => category === "All" || c.service === category);
    return Object.fromEntries(
      weekends.map((d) => [d, pool.filter((c) => !c.busy.includes(d)).length])
    ) as Record<string, number>;
  }, [weekends, category]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const isFree = (c: Creative) => (date ? !c.busy.includes(date) : true);

    const list = CREATIVES.filter((c) => {
      if (category !== "All" && c.service !== category) return false;
      if (city !== "All cities" && c.city !== city) return false;
      if (c.from > maxPrice) return false;
      if (styles.length && !styles.some((s) => c.styles.includes(s))) return false;
      if (date && onlyAvailable && c.busy.includes(date)) return false;
      if (q && ![c.name, c.specialty, c.city, c.service, ...c.styles].join(" ").toLowerCase().includes(q))
        return false;
      return true;
    });

    // Recommended: free on the chosen date first, then best rated.
    if (sort === "recommended")
      list.sort((a, b) => Number(isFree(b)) - Number(isFree(a)) || b.rating - a.rating);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "price-asc") list.sort((a, b) => a.from - b.from);
    if (sort === "price-desc") list.sort((a, b) => b.from - a.from);
    return list;
  }, [query, category, city, maxPrice, styles, date, onlyAvailable, sort]);

  const freeCount = date ? results.filter((c) => !c.busy.includes(date)).length : 0;

  const pickDate = (value: string) => {
    setDate(value);
    if (!value) setOnlyAvailable(false);
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("All");
    pickDate("");
    setCity("All cities");
    setMaxPrice(MAX_BUDGET);
    setStyles([]);
  };

  const toggleStyle = (s: string) =>
    setStyles((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  // Filters that are switched on, shown as removable chips under the toolbar.
  const chips: { key: string; label: string; clear: () => void }[] = [
    ...(city !== "All cities" ? [{ key: "city", label: city, clear: () => setCity("All cities") }] : []),
    ...(maxPrice < MAX_BUDGET
      ? [{ key: "price", label: `Up to ${peso(maxPrice)}`, clear: () => setMaxPrice(MAX_BUDGET) }]
      : []),
    ...styles.map((s) => ({ key: `style-${s}`, label: s, clear: () => toggleStyle(s) })),
  ];

  return (
    <div className="min-h-screen bg-[#f1f4f9] text-foreground dark:bg-background">
      <AppHeader active="Explore" />

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
        {/* Hero: search and date drive everything else on this page */}
        <section
          aria-labelledby="explore-title"
          className="rounded-3xl bg-slate-900 px-6 py-8 text-white ring-1 ring-white/10 sm:px-10 sm:py-10"
        >
          <h1 id="explore-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore creatives
          </h1>
          <p className="mt-2 max-w-xl text-slate-300">
            Browse by their work. Pick your event date to see who is free.
          </p>

          <div className="mt-6 flex flex-col gap-1 rounded-2xl bg-white p-2 text-slate-900 focus-within:ring-2 focus-within:ring-[#1d8bf8]/70 sm:flex-row sm:items-center">
            <label className="flex flex-1 items-center gap-2.5 px-3">
              <Search size={18} aria-hidden="true" className="shrink-0 text-slate-400" />
              <span className="sr-only">Search creatives</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, style or city"
                className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-slate-400"
              />
            </label>
            <div aria-hidden="true" className="hidden h-6 w-px bg-slate-200 sm:block" />
            <label className="flex items-center gap-2.5 border-t border-slate-100 px-3 sm:border-t-0">
              <CalendarDays size={18} aria-hidden="true" className="shrink-0 text-slate-400" />
              <span className="sr-only">Event date</span>
              <input
                type="date"
                value={date}
                onChange={(e) => pickDate(e.target.value)}
                className="bg-transparent py-2.5 text-sm outline-none"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <p id="date-label" className="text-sm text-slate-300" aria-live="polite">
              {date ? longDate(date) : "Or tap a weekend to check who is free."}
              {date && (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={() => pickDate("")}
                    className={`rounded text-white underline underline-offset-2 ${FOCUS}`}
                  >
                    Clear
                  </button>
                </>
              )}
            </p>

            <div className="flex items-center gap-3">
              <span id="only-available" className="text-sm text-slate-200">
                Only show available
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={onlyAvailable}
                aria-labelledby="only-available"
                disabled={!date}
                onClick={() => setOnlyAvailable((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none ${FOCUS} ${
                  onlyAvailable ? "bg-[#1d8bf8]" : "bg-white/25"
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none ${
                    onlyAvailable ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Weekend chips with live availability counts */}
          <div
            role="group"
            aria-labelledby="date-label"
            className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1"
          >
            {weekends.map((d) => {
              const selected = date === d;
              const free = freeByDate[d];
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => pickDate(selected ? "" : d)}
                  className={`flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm transition-colors motion-reduce:transition-none ${FOCUS} ${
                    selected
                      ? "bg-[#1d8bf8] text-white"
                      : "bg-white/5 text-slate-200 ring-1 ring-inset ring-white/10 hover:bg-white/10"
                  }`}
                >
                  <span className="font-medium">{chipDate(d)}</span>
                  <span
                    className={`text-xs tabular-nums ${
                      selected ? "text-white" : free === 0 ? "text-slate-500" : "text-emerald-300"
                    }`}
                  >
                    {free === 0 ? "Full" : `${free} free`}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Toolbar: stays in view while scrolling the results */}
        <div className="sticky top-3 z-20 mt-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card/95 p-2 shadow-sm backdrop-blur">
          <div
            className="flex max-w-full gap-1 overflow-x-auto"
            role="group"
            aria-label="Type of creative"
          >
            {CATEGORIES.map((cat) => {
              const active = category === cat.value;
              const count =
                cat.value === "All"
                  ? CREATIVES.length
                  : CREATIVES.filter((c) => c.service === cat.value).length;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  aria-pressed={active}
                  className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${FOCUS} ${
                    active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.label}{" "}
                  <span className="font-normal tabular-nums opacity-70">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              aria-controls="filter-panel"
              className={`inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-medium hover:bg-muted ${FOCUS}`}
            >
              <SlidersHorizontal size={16} aria-hidden="true" />
              Filters
              {chips.length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#1d8bf8] px-1.5 text-xs font-semibold text-white tabular-nums">
                  {chips.length}
                </span>
              )}
            </button>
            <label className="flex items-center gap-2 text-sm">
              <span className="sr-only sm:not-sr-only text-muted-foreground">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className={`${field} w-auto`}
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Top rated</option>
                <option value="price-asc">Price, low to high</option>
                <option value="price-desc">Price, high to low</option>
              </select>
            </label>
          </div>
        </div>

        {showFilters && (
          <div
            id="filter-panel"
            className="mt-3 grid gap-6 rounded-2xl border border-border bg-card p-5 sm:grid-cols-3"
          >
            <div>
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <select
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${field} mt-2.5`}
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="text-sm font-medium">
                Starting price
              </label>
              <input
                id="budget"
                type="range"
                min={1000}
                max={MAX_BUDGET}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-[#1d8bf8]"
              />
              <p className="mt-1 text-sm text-muted-foreground">
                Up to{" "}
                <span className="font-medium tabular-nums text-foreground">{peso(maxPrice)}</span>
              </p>
            </div>

            <fieldset>
              <legend className="text-sm font-medium">Style</legend>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {STYLES.map((s) => {
                  const on = styles.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleStyle(s)}
                      className={`rounded-full px-3 py-1.5 text-sm transition-colors motion-reduce:transition-none ${FOCUS} ${
                        on
                          ? "bg-[#1d8bf8] font-medium text-white"
                          : "border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex justify-end border-t border-border pt-4 sm:col-span-3">
              <button
                type="button"
                onClick={resetFilters}
                className={`rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted ${FOCUS}`}
              >
                Reset filters
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <section aria-label="Results" className="mt-6">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm text-muted-foreground" aria-live="polite">
              {results.length} {results.length === 1 ? "creative" : "creatives"}
              {date && `. ${freeCount} free on ${shortDate(date)}.`}
            </p>
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                aria-label={`Remove filter: ${chip.label}`}
                className={`inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-sm ring-1 ring-inset ring-border hover:bg-muted ${FOCUS}`}
              >
                {chip.label}
                <X size={13} aria-hidden="true" />
              </button>
            ))}
          </div>

          {results.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((c) => (
                <CreativeCard
                  key={c.id}
                  creative={c}
                  date={date}
                  saved={saved.includes(c.id)}
                  onToggleSave={() => toggleSaved(c.id)}
                />
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
              <p className="font-semibold">No creatives match these filters</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Try another date, raise the price limit, or clear a style.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className={`mt-5 rounded-lg bg-[#1d8bf8] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1479d6] ${FOCUS}`}
              >
                Reset filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}