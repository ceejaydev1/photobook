import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Plus } from "lucide-react";
import { NavCta } from "@/components/landing-nav-cta";
import { MobileMenu } from "@/components/landing-mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";

/* -------------------------------------------------------------------------- */
/*  SEO                                                                        */
/* -------------------------------------------------------------------------- */

const TITLE = "PhotoBook – Every great story deserves to be seen";
const DESCRIPTION =
  "Discover photographers, videographers and editors. Explore their work and find the right creative for your next project.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    siteName: "PhotoBook",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/* -------------------------------------------------------------------------- */
/*  Content – edit the text and photos here                                    */
/*  All images live in /public                                                 */
/* -------------------------------------------------------------------------- */

/** Hero image (16:10). Used in the top section. */
const HERO = "/hero.png";

/** Portrait crop of the hero (4:5). Used in the closing section. */
const HERO_PORTRAIT = "/auth-hero.jpg";

const NAV = [
  { href: "#how", label: "How it works" },
  { href: "#disciplines", label: "Disciplines" },
  { href: "#why", label: "Why PhotoBook" },
  { href: "#faq", label: "FAQ" },
];

/** The three disciplines. Each one has its own 4:5 photo. */
const DISCIPLINES = [
  {
    title: "Photographers",
    text: "Weddings, portraits, products, places. Find the eye that matches your story.",
    tags: "Weddings · Portraits · Events · Products",
    src: "/photographer.png",
    pos: "50% 50%",
    alt: "A wedding photographer crouched low, photographing a couple in soft golden-hour backlight",
  },
  {
    title: "Videographers",
    text: "Brand films, events, short-form, documentary. Motion that holds attention.",
    tags: "Events · Brand films · Social · Documentary",
    src: "/videographer.png",
    pos: "50% 50%",
    alt: "A videographer walking through a city street at blue hour with a camera on a gimbal",
  },
  {
    title: "Editors",
    text: "Retouching, colour, cutting. The finishing work that makes a project land.",
    tags: "Retouching · Colour · Video edits",
    src: "/editor.png",
    pos: "50% 50%",
    alt: "An editor at a dark desk grading colour on a large monitor with a video timeline",
  },
];

/** Five different pieces of work, laid out like a strip of film. */
const FRAMES = [
  { n: "21", label: "Wedding moment", src: "/frame-21.png" },
  { n: "22", label: "Portrait by a window", src: "/frame-22.png" },
  { n: "23", label: "Product still life", src: "/frame-23.png" },
  { n: "24", label: "Live event crowd", src: "/frame-24.png" },
  { n: "25", label: "Hiker above the clouds", src: "/frame-25.png" },
];

const FEATURES = [
  {
    title: "Profiles built around the work",
    text: "Every creative has a profile with their story, location and photo, so you know who you're talking to before you reach out.",
  },
  {
    title: "Two sides, one place",
    text: "Clients looking for talent and creatives looking to be found share the same space.",
  },
  {
    title: "See where they're based",
    text: "Local or travelling, each profile shows where a creative works, so you can plan around real distance.",
  },
  {
    title: "Made to stay out of the way",
    text: "A calm, image-first design that keeps the attention on the work, not on the interface.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Create your account",
    text: "Sign up in a minute and tell us whether you're here to hire or to be hired.",
  },
  {
    n: "02",
    title: "Explore profiles",
    text: "Browse photographers, videographers and editors. Look at their work, read their story, see where they're based.",
  },
  {
    n: "03",
    title: "Make contact",
    text: "Found someone whose style fits? Reach out and start planning your project.",
  },
];

const FAQ = [
  {
    q: "Who is PhotoBook for?",
    a: "Two groups. Clients who are looking for a photographer, videographer or editor, and creatives who want their work to be seen by the people looking for them.",
  },
  {
    q: "What kinds of creatives can I find?",
    a: "Photographers, videographers and editors. Each one has a profile with their story, location and photo.",
  },
  {
    q: "Do I need an account?",
    a: "Yes. Create an account with your name, email and a password, and you can start exploring the community.",
  },
  {
    q: "I forgot my password. What do I do?",
    a: "Choose “Forgot password?” on the log in page. We'll email you a 6-digit code, and you can set a new password right away.",
  },
  {
    q: "How do I get my work seen?",
    a: "Create an account and build your profile with your name, story, location and photo, so the right people can find you.",
  },
];

/* -------------------------------------------------------------------------- */
/*  Shared styles                                                              */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d8bf8]";

const primaryBtn = `inline-flex h-12 items-center justify-center rounded-full bg-[#1d8bf8] px-7 text-sm font-semibold text-white shadow-[0_12px_24px_-8px_rgba(29,139,248,0.6)] transition hover:bg-[#1479e0] active:scale-[0.98] ${focusRing}`;

const secondaryBtn = `inline-flex h-12 items-center justify-center rounded-full bg-[#f1f4f9] px-7 text-sm font-semibold text-slate-600 transition hover:bg-[#e6ebf3] dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 ${focusRing}`;

const darkSecondaryBtn = `inline-flex h-12 items-center justify-center rounded-full bg-white/10 px-7 text-sm font-semibold text-white transition hover:bg-white/15 ${focusRing}`;

const sheet =
  "rounded-[2rem] bg-white shadow-[0_30px_80px_-30px_rgba(30,50,90,0.3)] dark:bg-[#0c121e] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]";

const heading2 =
  "text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl";

const muted = "text-slate-500 dark:text-slate-400";

const dot = <span className="text-[#1d8bf8]">.</span>;

const blobGradient =
  "linear-gradient(160deg, #9cc7d3 0%, #3d7f95 52%, #15343f 100%)";

/* -------------------------------------------------------------------------- */
/*  Structured data for search engines                                         */
/* -------------------------------------------------------------------------- */

const jsonLd = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PhotoBook",
    description: DESCRIPTION,
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  },
]).replace(/</g, "\\u003c");

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  return (
    <div
      id="top"
      className="min-h-screen bg-[#e9edf3] text-slate-950 dark:bg-[#05080f] dark:text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      {/* Clip paths: the same organic edge as the login and sign-up pages */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="landing-blob" clipPathUnits="objectBoundingBox">
            <path d="M0.714,0 L1,0 L1,1 L0.065,1 C0.15,0.85 0.14,0.72 0.3,0.66 C0.5,0.6 0.5,0.45 0.46,0.4 C0.4,0.32 0.25,0.3 0.314,0.19 C0.35,0.1 0.6,0.08 0.714,0 Z" />
          </clipPath>
          <clipPath id="landing-wave" clipPathUnits="objectBoundingBox">
            <path d="M0,0.1 C0.2,0 0.35,0.14 0.55,0.07 C0.75,0 0.9,0.04 1,0 L1,1 L0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-slate-950 focus:shadow-lg"
      >
        Skip to content
      </a>

      {/* -------------------------------- Header ------------------------------ */}
      <header className="sticky top-0 z-50 bg-[#e9edf3]/85 backdrop-blur-md dark:bg-[#05080f]/85">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-4 sm:px-8">
          <Link href="/" className={`flex items-center gap-3 rounded-lg ${focusRing}`}>
            <Image
              src="/icon.png"
              alt=""
              width={32}
              height={32}
              priority
              className="h-8 w-8 rounded-lg object-contain"
            />
            <span className="text-[15px] font-semibold">
              PhotoBook<span className="text-[#1d8bf8]">.</span>
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className={`hidden items-center gap-9 text-sm font-medium lg:flex ${muted}`}
          >
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded transition hover:text-slate-950 dark:hover:text-white ${focusRing}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <NavCta />
            <MobileMenu
              items={[...NAV, { href: "/login", label: "Log in" }]}
            />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[1280px] px-4 sm:px-8">
        {/* --------------------------------- Hero ----------------------------- */}
        <section className={`relative overflow-hidden ${sheet}`}>
          <div className="relative flex lg:min-h-[640px] lg:w-[50%] lg:items-center">
            <div className="auth-enter max-w-[560px] px-6 pb-10 pt-12 sm:px-12 sm:pt-16 lg:py-24 lg:pl-16 lg:pr-0">
              <h1 className="text-[2.75rem] font-bold leading-[1.02] tracking-tight sm:text-6xl xl:text-[4.25rem]">
                Every great story deserves to be seen{dot}
              </h1>

              <p className={`mt-6 max-w-[470px] text-base leading-7 sm:text-lg ${muted}`}>
                PhotoBook brings clients and creatives together. Discover
                photographers, videographers and editors, explore their work,
                and find the right person for your next project.
              </p>

              <div className="mt-9">
                <div className="flex flex-wrap gap-3">
                  <Link href="/signup" className={primaryBtn}>
                    Create account
                  </Link>
                  <Link href="/login" className={secondaryBtn}>
                    Log in
                  </Link>
                </div>
                <p className="mt-6 text-sm text-slate-400">
                  Photographers · Videographers · Editors
                </p>
              </div>
            </div>
          </div>

          {/* One photo: a wave under the text on phones, a blob beside it on desktop */}
          <div className="relative h-72 w-full sm:h-96 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[56%]">
            <div
              className="absolute inset-0 overflow-hidden [clip-path:url(#landing-wave)] lg:rounded-[2rem] lg:[clip-path:url(#landing-blob)]"
              style={{ backgroundImage: blobGradient }}
            >
              <Image
                src={HERO}
                alt="A photographer at the edge of a mountain lake at sunrise"
                fill
                priority
                sizes="(min-width: 1024px) 56vw, 100vw"
                className="object-cover"
                style={{ objectPosition: "70% 50%" }}
              />
            </div>

            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 hidden h-full w-full overflow-visible lg:block"
            >
              <path
                d="M 64 0 C 50 4, 28 8, 24 19 C 21 30, 40 33, 39 42 C 38 52, 28 58, 22 66 C 14 74, 2 86, -1 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="5 6"
                vectorEffect="non-scaling-stroke"
                className="text-slate-300 dark:text-slate-600"
              />
            </svg>
            <span
              aria-hidden="true"
              className="absolute bottom-8 right-10 hidden text-[11px] font-medium uppercase tracking-[0.2em] text-white/80 lg:block"
            >
              Frame 22
            </span>
          </div>
        </section>

        {/* ------------------------------ Disciplines ------------------------- */}
        <section id="disciplines" className="reveal scroll-mt-24 py-20 sm:py-28">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <h2 className={`${heading2} lg:col-span-7`}>
              Three disciplines, one place{dot}
            </h2>
            <p className={`leading-7 lg:col-span-5 ${muted}`}>
              Whatever the project needs, from the first frame to the final
              cut, you&apos;ll find people who do it well.
            </p>
          </div>

          <ul className="mt-12 grid gap-8 md:grid-cols-3">
            {DISCIPLINES.map((d) => (
              <li key={d.title} className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <div
                    role="img"
                    aria-label={d.alt}
                    className="h-full w-full bg-cover transition duration-700 ease-out group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${d.src})`,
                      backgroundPosition: d.pos,
                    }}
                  />
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{d.title}</h3>
                <p className={`mt-2 leading-7 ${muted}`}>{d.text}</p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                  {d.tags}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------- Contact sheet ------------------------ */}
        <section className="reveal overflow-hidden rounded-[2rem] bg-[#0b1118] py-14 text-white sm:py-20">
          <div className="grid gap-6 px-6 sm:px-12 lg:grid-cols-12 lg:items-end">
            <h2 className={`${heading2} lg:col-span-7`}>
              See the work before you say hello{dot}
            </h2>
            <p className="leading-7 text-slate-400 lg:col-span-5">
              Every creative on PhotoBook has a profile built around their
              work. Get a feel for their style first, then reach out when
              something clicks.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:px-12 [&::-webkit-scrollbar]:hidden">
            <div className="min-w-[860px] rounded-[4px] bg-[#141b25] py-2">
              <Perforations />
              <ul className="grid grid-cols-5 gap-2 px-3 py-2">
                {FRAMES.map((f) => (
                  <li key={f.n} className="group">
                    <div className="aspect-[3/2] overflow-hidden rounded-[3px]">
                      <div
                        role="img"
                        aria-label={f.label}
                        className="h-full w-full bg-cover bg-center transition duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: `url(${f.src})` }}
                      />
                    </div>
                    <div className="mt-1.5 flex justify-between px-0.5 text-[10px] font-medium tracking-[0.18em] text-[#d9a441]/80">
                      <span>{f.n}</span>
                      <span>{f.n}A</span>
                    </div>
                  </li>
                ))}
              </ul>
              <Perforations />
            </div>
          </div>
        </section>

        {/* ------------------------------ Why PhotoBook ----------------------- */}
        <section id="why" className="reveal scroll-mt-24 py-20 sm:py-28">
          <h2 className={heading2}>Why PhotoBook{dot}</h2>

          <div className="mt-12 grid gap-x-16 md:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="border-t border-slate-300/70 py-8 dark:border-white/10"
              >
                <h3 className="text-xl font-semibold">{f.title}</h3>
                <p className={`mt-2 max-w-md leading-7 ${muted}`}>{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------ How it works ------------------------ */}
        <section
          id="how"
          className="reveal grid scroll-mt-24 gap-10 pb-20 sm:pb-28 lg:grid-cols-12"
        >
          <h2 className={`${heading2} lg:col-span-4`}>How it works{dot}</h2>

          <ol className="divide-y divide-slate-300/70 border-y border-slate-300/70 lg:col-span-8 dark:divide-white/10 dark:border-white/10">
            {STEPS.map((s) => (
              <li key={s.n} className="grid gap-2 py-8 sm:grid-cols-[96px_1fr] sm:gap-8">
                <span className="text-sm font-semibold tabular-nums text-[#1d8bf8]">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className={`mt-2 max-w-xl leading-7 ${muted}`}>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------- Audiences ------------------------- */}
        <section className="reveal grid gap-6 md:grid-cols-2">
          <article id="clients" className={`flex scroll-mt-24 flex-col p-8 sm:p-12 ${sheet}`}>
            <p className="text-sm font-semibold text-slate-400">For clients</p>
            <h3 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
              Find the right person for the job{dot}
            </h3>
            <p className={`mt-4 max-w-md leading-7 ${muted}`}>
              From a wedding to a product launch to the edit afterwards, see
              who is out there and what their work looks like.
            </p>
            <Link
              href="/signup"
              className={`mt-auto inline-flex items-center gap-2 self-start rounded pt-10 text-sm font-semibold text-[#1d8bf8] transition-all hover:gap-3 ${focusRing}`}
            >
              Start exploring <ArrowRight size={16} />
            </Link>
          </article>

          <article id="creatives" className={`flex scroll-mt-24 flex-col p-8 sm:p-12 ${sheet}`}>
            <p className="text-sm font-semibold text-slate-400">For creatives</p>
            <h3 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl">
              Put your work in the book{dot}
            </h3>
            <p className={`mt-4 max-w-md leading-7 ${muted}`}>
              Build a profile that shows who you are and what you do, and be
              found by people looking for exactly that.
            </p>
            <div className="mt-auto pt-10">
              <Link href="/signup" className={primaryBtn}>
                Create your profile
              </Link>
            </div>
          </article>
        </section>

        {/* ---------------------------------- FAQ ----------------------------- */}
        <section
          id="faq"
          className="reveal grid scroll-mt-24 gap-10 py-20 sm:py-28 lg:grid-cols-12"
        >
          <h2 className={`${heading2} lg:col-span-4`}>Questions{dot}</h2>

          <div className="border-t border-slate-300/70 lg:col-span-8 dark:border-white/10">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group border-b border-slate-300/70 dark:border-white/10"
              >
                <summary
                  className={`flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-semibold [&::-webkit-details-marker]:hidden ${focusRing}`}
                >
                  {item.q}
                  <Plus
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-[#1d8bf8] transition-transform duration-300 group-open:rotate-45"
                  />
                </summary>
                <p className={`max-w-2xl pb-6 pr-10 leading-7 ${muted}`}>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---------------------------------- Close --------------------------- */}
        <section className="reveal relative overflow-hidden rounded-[2rem] bg-[#0b1118] text-white">
          <div className="relative z-10 flex flex-col items-start gap-6 px-6 py-16 sm:px-12 sm:py-24 lg:max-w-[60%]">
            <h2 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Your next project starts here{dot}
            </h2>
            <p className="max-w-md leading-7 text-slate-400">
              Create an account to explore creatives, or build your own
              profile and let the right people find you.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/signup" className={primaryBtn}>
                Create account
              </Link>
              <Link href="/login" className={darkSecondaryBtn}>
                Log in
              </Link>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-[42%] bg-cover bg-center lg:block"
            style={{
              clipPath: "url(#landing-blob)",
              backgroundImage: `url(${HERO_PORTRAIT}), ${blobGradient}`,
            }}
          />
        </section>
      </main>

      {/* --------------------------------- Footer ----------------------------- */}
      <footer className="mx-auto mt-20 max-w-[1280px] px-4 sm:px-8">
        <div className="grid gap-10 border-t border-slate-300/70 py-12 md:grid-cols-12 dark:border-white/10">
          <div className="md:col-span-5">
            <Link href="/" className={`inline-flex items-center gap-3 rounded-lg ${focusRing}`}>
              <Image
                src="/icon.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
              />
              <span className="text-[15px] font-semibold">
                PhotoBook<span className="text-[#1d8bf8]">.</span>
              </span>
            </Link>
            <p className={`mt-4 max-w-xs text-sm leading-6 ${muted}`}>
              A home for photographers, videographers and editors, and for the
              people looking for them.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 text-sm md:col-span-7 md:pl-12"
          >
            <div>
              <p className="font-semibold">Explore</p>
              <ul className={`mt-4 space-y-3 ${muted}`}>
                {NAV.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`rounded transition hover:text-slate-950 dark:hover:text-white ${focusRing}`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold">Account</p>
              <ul className={`mt-4 space-y-3 ${muted}`}>
                <li>
                  <Link href="/login" className={`rounded transition hover:text-slate-950 dark:hover:text-white ${focusRing}`}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className={`rounded transition hover:text-slate-950 dark:hover:text-white ${focusRing}`}>
                    Create account
                  </Link>
                </li>
                <li>
                  <Link href="/forgot-password" className={`rounded transition hover:text-slate-950 dark:hover:text-white ${focusRing}`}>
                    Forgot password
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className={`flex flex-col gap-3 border-t border-slate-300/70 py-6 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-white/10 ${muted}`}>
          <p>© PhotoBook. Made for creative people.</p>
          <a
            href="#top"
            className={`inline-flex items-center gap-1 rounded transition hover:text-slate-950 dark:hover:text-white ${focusRing}`}
          >
            Back to top
          </a>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Film perforations                                                          */
/* -------------------------------------------------------------------------- */

function Perforations() {
  return (
    <div
      aria-hidden="true"
      className="mx-3 h-2 rounded-[2px]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, rgba(233,237,243,0.16) 0 12px, transparent 12px 26px)",
      }}
    />
  );
}