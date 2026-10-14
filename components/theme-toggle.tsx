"use client";

import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>;
    finished: Promise<void>;
  };
};

/**
 * CSS that switches off the browser's default cross-fade, so only our circle
 * animates. It is injected while the transition runs, so it does not depend on
 * anything in globals.css.
 */
const TRANSITION_CSS = `
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none !important;
    mix-blend-mode: normal !important;
  }
  ::view-transition-old(root) { z-index: 1 !important; }
  ::view-transition-new(root) { z-index: 2 !important; }
`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggle = useCallback(async () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    const button = buttonRef.current;
    const doc = document as ViewTransitionDocument;
    const root = document.documentElement;

    const supportsTransitions = typeof doc.startViewTransition === "function";

    // Only falls back to an instant switch if the browser has no support
    if (!button || !supportsTransitions) {
      setTheme(next);
      return;
    }

    // Where the circle starts: the centre of the button
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    // How far it must grow to cover the farthest corner of the screen
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    // Turn off the default fade
    const style = document.createElement("style");
    style.textContent = TRANSITION_CSS;
    document.head.appendChild(style);

    const transition = doc.startViewTransition!(() => {
      // Change the page right now, before the browser takes the "after" picture
      root.classList.toggle("dark", next === "dark");
      root.style.colorScheme = next;
      flushSync(() => setTheme(next));
    });

    transition.finished.finally(() => style.remove());

    try {
      await transition.ready;
    } catch {
      return;
    }

    root.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${radius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 800,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  }, [resolvedTheme, setTheme]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f1f4f9] text-slate-600 transition hover:bg-[#e6ebf3] active:scale-95 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d8bf8] ${className}`}
    >
      <Sun
        size={18}
        aria-hidden="true"
        className="absolute rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0"
      />
      <Moon
        size={18}
        aria-hidden="true"
        className="absolute rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100"
      />
    </button>
  );
}