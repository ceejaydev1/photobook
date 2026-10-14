"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

type Item = { href: string; label: string };

/** Menu for phones and tablets. Desktop uses the normal links in the header. */
export function MobileMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);

  // Close with the Escape key
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-slate-700 transition hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d8bf8] dark:text-slate-200 dark:hover:bg-white/10"
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="auth-enter absolute inset-x-4 top-full mt-1 rounded-3xl bg-white p-3 shadow-[0_30px_80px_-30px_rgba(30,50,90,0.4)] sm:inset-x-8 dark:bg-[#0c121e] dark:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
        >
          <ul>
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3.5 text-base font-medium text-slate-700 transition hover:bg-[#f3f6fb] dark:text-slate-200 dark:hover:bg-white/5"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}