"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Header buttons for the landing page.
 * Visitors see "Log in" + "Get started". Signed-in users see "Open PhotoBook".
 */
export function NavCta() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;

    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (active) setSignedIn(Boolean(data.session));
      });

    return () => {
      active = false;
    };
  }, []);

  const pill =
    "rounded-full bg-[#1d8bf8] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_20px_-8px_rgba(29,139,248,0.6)] transition hover:bg-[#1479e0] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d8bf8]";

  if (signedIn) {
    return (
      <Link href="/home" className={pill}>
        Open PhotoBook
      </Link>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden px-3 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-950 sm:block dark:text-slate-300 dark:hover:text-white"
      >
        Log in
      </Link>
      <Link href="/signup" className={pill}>
        Get started
      </Link>
    </>
  );
}