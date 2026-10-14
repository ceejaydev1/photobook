"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";

/* -------------------------------------------------------------------------- */
/*  AuthShell – split layout with the blob-shaped photo panel                  */
/* -------------------------------------------------------------------------- */

type AuthShellProps = {
  /** No longer shown. Kept optional so existing pages don't break. */
  eyebrow?: string;
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <main className="relative flex min-h-screen items-stretch justify-center overflow-hidden bg-white sm:items-center sm:bg-[#e9edf3] sm:p-8 dark:bg-[#0c121e] sm:dark:bg-[#05080f]">
      {/* Dark mode toggle, top right on every auth page */}
      <div className="fixed right-4 top-4 z-50 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      {/* Soft background glows (same blue/teal as the buttons and photo) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden sm:block -left-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(closest-side,rgba(29,139,248,0.25),transparent)] dark:bg-[radial-gradient(closest-side,rgba(29,139,248,0.18),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden sm:block -bottom-48 -right-40 h-[38rem] w-[38rem] rounded-full bg-[radial-gradient(closest-side,rgba(61,159,181,0.3),transparent)] dark:bg-[radial-gradient(closest-side,rgba(61,159,181,0.2),transparent)]"
      />

      {/* Clip path used to cut the photo into the organic blob shape */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="auth-blob" clipPathUnits="objectBoundingBox">
            <path d="M0.714,0 L1,0 L1,1 L0.065,1 C0.15,0.85 0.14,0.72 0.3,0.66 C0.5,0.6 0.5,0.45 0.46,0.4 C0.4,0.32 0.25,0.3 0.314,0.19 C0.35,0.1 0.6,0.08 0.714,0 Z" />
          </clipPath>
          <clipPath id="auth-wave" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L1,0 L1,0.88 C0.85,1 0.7,1 0.55,0.9 C0.4,0.8 0.2,0.8 0,0.95 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative z-10 flex w-full max-w-[1280px] flex-col items-center sm:gap-6">
        <div className="relative w-full flex-1 overflow-hidden bg-white sm:flex-none sm:rounded-3xl sm:shadow-[0_30px_80px_-30px_rgba(30,50,90,0.35)] dark:bg-[#0c121e] sm:dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]">
          {/* Photo panel (desktop only) */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[58%] xl:block"
            aria-hidden="true"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                clipPath: "url(#auth-blob)",
                backgroundImage:
                  "url(/auth-hero.jpg), linear-gradient(160deg, #9cc7d3 0%, #3d7f95 52%, #15343f 100%)",
              }}
            />
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full overflow-visible"
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
            <span className="absolute bottom-8 right-10 text-2xl font-black tracking-tight text-white drop-shadow">
              PhotoBook<span className="text-[#6cb6ff]">.</span>
            </span>
          </div>

          <div className="relative flex flex-col sm:min-h-[640px] xl:min-h-[760px]">
            {/* Photo banner at the top of the card (phones and tablets only) */}
            <div
              aria-hidden="true"
              className="h-36 w-full bg-cover sm:h-48 xl:hidden"
              style={{
                backgroundImage:
                  "url(/auth-hero.jpg), linear-gradient(160deg, #9cc7d3 0%, #3d7f95 52%, #15343f 100%)",
                backgroundPosition: "72% 40%",
                clipPath: "url(#auth-wave)",
              }}
            />

            {/* Top bar with logo (desktop only) */}
            <header className="hidden items-center px-12 py-8 xl:flex">
              <Link href="/" className="flex items-center gap-3">
                <Image
                  src="/icon.png"
                  alt="PhotoBook logo"
                  width={32}
                  height={32}
                  priority
                  className="h-8 w-8 rounded-lg object-contain"
                />
                <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  PhotoBook<span className="text-[#1d8bf8]">.</span>
                </span>
              </Link>
            </header>

            {/* Form column */}
            <section className="flex flex-1 items-center px-5 pb-8 pt-3 sm:px-12 sm:pb-12 sm:pt-6 xl:pl-24 xl:pt-4">
              <div key={title} className="auth-enter mx-auto w-full max-w-[440px] xl:mx-0">
                <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-slate-950 sm:text-[40px] xl:text-[52px] xl:leading-[1.1] dark:text-white">
                  {title}
                  <span className="text-[#1d8bf8]">.</span>
                </h1>
                <p className="mt-4 text-sm text-slate-400 sm:mt-5 sm:text-[15px]">{subtitle}</p>

                <div className="mt-6 sm:mt-8">{children}</div>
              </div>
            </section>
          </div>
        </div>

        <p className="py-4 text-center text-xs text-slate-400 sm:py-0 dark:text-slate-500">
          © {year} PhotoBook. Made for creative people.
        </p>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  AuthField – tinted input with small label, icon and blue focus ring        */
/* -------------------------------------------------------------------------- */

type AuthFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  icon?: ReactNode;
};

export function AuthField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
  minLength,
  icon,
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="group flex items-center gap-2 rounded-2xl border border-transparent bg-[#f3f6fb] px-4 py-2.5 transition focus-within:border-[#1d8bf8] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(29,139,248,0.12)] dark:bg-white/5 dark:focus-within:bg-[#0c121e]">
      <div className="min-w-0 flex-1">
        <label
          htmlFor={id}
          className="block text-[10px] font-medium text-slate-400 transition group-focus-within:text-[#1d8bf8]"
        >
          {label}
        </label>
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          required={required}
          minLength={minLength}
          autoComplete={autoComplete}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="mt-0.5 w-full bg-transparent text-base font-semibold leading-5 xl:text-sm text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-400 dark:text-white"
        />
      </div>

      {isPassword ? (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      ) : (
        icon && <span className="text-slate-400">{icon}</span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Button styles shared by both pages                                         */
/* -------------------------------------------------------------------------- */

export const secondaryButtonClass =
  "flex h-12 flex-1 items-center justify-center rounded-full bg-[#f1f4f9] text-sm font-semibold text-slate-400 transition hover:bg-[#e6ebf3] dark:bg-white/5 dark:hover:bg-white/10";

export const primaryButtonClass =
  "h-[52px] flex-1 rounded-full bg-[#1d8bf8] sm:h-12 text-sm font-semibold text-white shadow-[0_12px_24px_-8px_rgba(29,139,248,0.6)] transition hover:bg-[#1479e0] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";