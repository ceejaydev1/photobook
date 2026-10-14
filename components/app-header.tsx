
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Camera,
  Home,
  Compass,
  CalendarDays,
  MessageCircle,
  UserRound,
  BriefcaseBusiness,
  LogOut,
  Heart,
  Settings,
  CircleHelp,
  ShieldCheck,
  X,
  CheckCheck,
  ArrowUpRight,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";

const BRAND = "PhotoBook";

const CLIENT_NAV = [
  { label: "Home", href: "/home", icon: Home },
  { label: "Explore", href: "/explore", icon: Compass },
  { label: "Bookings", href: "/bookings", icon: CalendarDays },
  { label: "Messages", href: "/messages", icon: MessageCircle },
];

const CREATIVE_NAV = [
  { label: "Requests", href: "/bookings", icon: BriefcaseBusiness },
  { label: "Messages", href: "/messages", icon: MessageCircle },
  { label: "Profile", href: "/creative/profile", icon: UserRound },
];

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Home;
};

type AppHeaderProps = {
  active?: string;
  hasCreativeProfile?: boolean;
  initials?: string;
  unread?: number;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
};

type NotificationCategory = "Bookings" | "Messages";

type AppNotification = {
  id: number;
  title: string;
  description: string;
  time: string;
  category: NotificationCategory;
  href: string;
  unread: boolean;
  icon: typeof Bell;
};

const ACCOUNT_LINKS = [
  {
    label: "My Profile",
    description: "Manage your personal information",
    href: "/profile",
    icon: UserRound,
  },
  {
    label: "My Bookings",
    description: "View bookings and requests",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Saved Creatives",
    description: "Your favorite creatives",
    href: "/saved",
    icon: Heart,
  },
  {
    label: "Account Settings",
    description: "Manage your account",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Notifications",
    description: "Manage notification preferences",
    href: "/notifications",
    icon: Bell,
  },
  {
    label: "Help & Support",
    description: "Get help with PhotoBook",
    href: "/help",
    icon: CircleHelp,
  },
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 1,
    title: "Booking accepted",
    description: "Your photographer confirmed your wedding shoot.",
    time: "10 minutes ago",
    category: "Bookings",
    href: "/bookings",
    unread: true,
    icon: CalendarDays,
  },
  {
    id: 2,
    title: "New message",
    description: "Creative Name sent you a message.",
    time: "1 hour ago",
    category: "Messages",
    href: "/messages",
    unread: true,
    icon: MessageCircle,
  },
  {
    id: 3,
    title: "Booking request update",
    description: "Your pending request is waiting for a response.",
    time: "3 hours ago",
    category: "Bookings",
    href: "/bookings",
    unread: true,
    icon: Bell,
  },
  {
    id: 4,
    title: "Creative saved",
    description: "Your favorite creatives are available to revisit.",
    time: "Yesterday",
    category: "Messages",
    href: "/saved",
    unread: false,
    icon: Heart,
  },
];

export function AppHeader({
  active,
  hasCreativeProfile = false,
  initials = "JD",
  userName = "Your account",
  userEmail = "",
  avatarUrl = null,
}: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menuRef = useRef<HTMLDivElement>(null);
  const avatarButtonRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<
    "All" | "Bookings" | "Messages"
  >("All");
  const [notifications, setNotifications] =
    useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const mode =
    hasCreativeProfile && pathname.startsWith("/creative")
      ? "creative"
      : "client";

  const nav: NavItem[] =
    mode === "creative" ? CREATIVE_NAV : CLIENT_NAV;

  const unreadNotifications = notifications.filter(
    (item) => item.unread
  ).length;

  const filteredNotifications = notifications.filter(
    (item) =>
      notificationFilter === "All" ||
      item.category === notificationFilter
  );

  function isActive(item: NavItem) {
    if (
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`)
    ) {
      return true;
    }

    if (!active) return false;

    if (active === "Messages" && item.label === "Messages") return true;
    if (active === "Bookings" && item.href === "/bookings") return true;
    if (active === "Explore" && item.href === "/explore") return true;
    if (active === "Home" && item.href === "/home") return true;

    return item.label === active;
  }

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        avatarButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!notificationsOpen) return;

    function handleOutsideClick(event: PointerEvent) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen && !notificationsOpen) return;
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen, notificationsOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setLogoutError("");
  }

  function markAllNotificationsRead() {
    setNotifications((current) =>
      current.map((item) => ({ ...item, unread: false }))
    );
  }

  function markNotificationRead(id: number) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id ? { ...item, unread: false } : item
      )
    );
  }

  function openNotification(id: number, href: string) {
    markNotificationRead(id);
    setNotificationsOpen(false);
    router.push(href);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      closeMenu();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("PhotoBook logout failed:", error);
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const buttonClass =
    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted";

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="relative mx-auto grid h-[60px] w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-3 sm:gap-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">

          {/* LOGO: icon.png at the top-left */}
          <Link
            href="/home"
            aria-label={`${BRAND} home`}
            className={`relative z-20 col-start-1 flex w-fit min-w-0 shrink-0 items-center justify-self-start gap-2 rounded-lg ${FOCUS}`}
          >
            <Image
              src="/icon.png"
              alt={`${BRAND} logo`}
              width={36}
              height={36}
              priority
              className="h-9 w-9 shrink-0 rounded-xl object-contain"
            />

            <span className="whitespace-nowrap text-sm font-bold tracking-tight sm:text-base">
              {BRAND}
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav
            aria-label="Main navigation"
            className="absolute left-1/2 top-0 hidden h-full w-[min(460px,calc(100%-300px))] -translate-x-1/2 items-stretch md:flex"
          >
            {nav.map((item) => {
              const on = isActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={[
                    "relative flex h-full min-w-0 flex-1 items-center justify-center gap-2 px-2",
                    "whitespace-nowrap text-sm font-medium transition-colors",
                    FOCUS,
                    on
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>

                  {on && (
                    <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-blue-600" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE: NOTIFICATIONS + ACCOUNT */}
          <div className="relative z-30 col-start-2 flex min-w-0 shrink-0 items-center justify-self-end gap-1 sm:gap-2 md:col-start-3 md:gap-3">
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                aria-label={`Notifications, ${unreadNotifications} unread`}
                aria-expanded={notificationsOpen}
                aria-haspopup="dialog"
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setMenuOpen(false);
                }}
                className={`relative ${buttonClass} border-transparent bg-transparent hover:bg-muted ${FOCUS}`}
              >
                <Bell className="h-[18px] w-[18px]" />

                {unreadNotifications > 0 && (
                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold text-white ring-2 ring-background">
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  role="dialog"
                  aria-label="Notifications"
                  className="fixed inset-0 z-[110] flex h-dvh w-screen flex-col overflow-hidden bg-background md:absolute md:inset-auto md:right-0 md:top-[calc(100%+10px)] md:h-auto md:w-[380px] md:max-h-[min(80vh,680px)] md:rounded-2xl md:border md:border-border md:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-border p-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold">
                          Notifications
                        </h2>

                        {unreadNotifications > 0 && (
                          <span className="rounded-full bg-blue-600/10 px-2 py-0.5 text-xs font-semibold text-blue-600">
                            {unreadNotifications} new
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Stay updated on your activity.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNotificationsOpen(false)}
                      aria-label="Close notifications"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-3">
                    <div className="flex items-center gap-1">
                      {(["All", "Bookings", "Messages"] as const).map(
                        (filter) => (
                          <button
                            key={filter}
                            type="button"
                            onClick={() => setNotificationFilter(filter)}
                            aria-pressed={notificationFilter === filter}
                            className={[
                              "rounded-full px-3 py-1.5 text-xs font-medium transition",
                              notificationFilter === filter
                                ? "bg-blue-600 text-white"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            ].join(" ")}
                          >
                            {filter}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      disabled={unreadNotifications === 0}
                      className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-40"
                    >
                      <CheckCheck className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Mark all read</span>
                      <span className="sm:hidden">Read all</span>
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain md:flex-none">
                    {filteredNotifications.length > 0 ? (
                      <div className="divide-y divide-border">
                        {filteredNotifications.map((notification) => {
                          const Icon = notification.icon;

                          return (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() =>
                                openNotification(
                                  notification.id,
                                  notification.href
                                )
                              }
                              className={[
                                "flex w-full items-start gap-3 p-4 text-left transition hover:bg-muted/70",
                                notification.unread
                                  ? "bg-blue-500/[0.04]"
                                  : "",
                              ].join(" ")}
                            >
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-blue-600">
                                <Icon className="h-5 w-5" />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="flex items-start justify-between gap-2">
                                  <span className="text-sm font-semibold">
                                    {notification.title}
                                  </span>

                                  {notification.unread && (
                                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                                  )}
                                </span>

                                <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                                  {notification.description}
                                </span>

                                <span className="mt-2 block text-xs text-muted-foreground">
                                  {notification.time}
                                </span>
                              </span>

                              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
                        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                          <Bell className="h-6 w-6 text-muted-foreground" />
                        </span>

                        <h3 className="mt-4 text-sm font-semibold">
                          You&apos;re all caught up
                        </h3>

                        <p className="mt-1 max-w-60 text-sm text-muted-foreground">
                          No notifications in this category right now.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border p-3">
                    <button
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        router.push("/notifications");
                      }}
                      className="flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-muted text-sm font-semibold transition hover:bg-muted/70"
                    >
                      View all notifications
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ACCOUNT MENU */}
            <div className="relative" ref={menuRef}>
              <button
                ref={avatarButtonRef}
                type="button"
                aria-label="Open account menu"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => {
                  setMenuOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
                className={[
                  "flex h-10 shrink-0 items-center gap-2 rounded-full text-left transition hover:bg-muted/70",
                  FOCUS,
                ].join(" ")}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>

                <span className="hidden max-w-[150px] truncate text-sm font-medium lg:block">
                  {userName}
                </span>
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  aria-label="Account menu"
                  className="fixed inset-0 z-[100] h-dvh w-screen overflow-x-hidden overflow-y-auto overscroll-contain bg-background px-5 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 md:absolute md:inset-auto md:right-0 md:top-[calc(100%+10px)] md:h-auto md:w-[360px] md:max-h-[min(80vh,720px)] md:overflow-y-auto md:rounded-2xl md:border md:border-border md:p-2 md:shadow-xl"
                >
                  <div className="mb-6 flex items-center justify-between md:hidden">
                    <span className="text-lg font-semibold">Account</span>

                    <button
                      type="button"
                      onClick={closeMenu}
                      aria-label="Close account menu"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white dark:bg-slate-100 dark:text-slate-900">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {userName}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {userEmail || "Signed-in account"}
                      </p>

                      <div className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                        PhotoBook account
                      </div>
                    </div>
                  </div>

                  <div className="my-1 border-t border-border" />

                  <div className="p-3 md:p-2">
                    <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Account mode
                    </p>

                    {hasCreativeProfile ? (
                      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1">
                        <Link
                          role="menuitem"
                          href="/home"
                          onClick={closeMenu}
                          aria-current={mode === "client" ? "page" : undefined}
                          className={[
                            "flex min-h-12 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium transition",
                            FOCUS,
                            mode === "client"
                              ? "bg-background text-blue-600 shadow-sm dark:text-blue-400"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          <UserRound className="h-4 w-4" />
                          Client
                        </Link>

                        <Link
                          role="menuitem"
                          href="/creative/profile"
                          onClick={closeMenu}
                          aria-current={mode === "creative" ? "page" : undefined}
                          className={[
                            "flex min-h-12 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium transition",
                            FOCUS,
                            mode === "creative"
                              ? "bg-background text-blue-600 shadow-sm dark:text-blue-400"
                              : "text-muted-foreground hover:text-foreground",
                          ].join(" ")}
                        >
                          <BriefcaseBusiness className="h-4 w-4" />
                          Creative
                        </Link>
                      </div>
                    ) : (
                      <Link
                        role="menuitem"
                        href="/creative/profile"
                        onClick={closeMenu}
                        className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium hover:bg-muted"
                      >
                        <Camera className="h-4 w-4 text-blue-600" />
                        Become a Creative
                      </Link>
                    )}
                  </div>

                  <div className="my-1 border-t border-border" />

                  <div className="p-3 md:p-2">
                    <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Appearance
                    </p>

                    <div className="flex items-center gap-3 px-1">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Theme</p>
                        <p className="text-xs text-muted-foreground">
                          Change your appearance
                        </p>
                      </div>

                      <ThemeToggle />
                    </div>
                  </div>

                  <div className="my-1 border-t border-border" />

                  <div className="py-1">
                    {ACCOUNT_LINKS.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.label}
                          role="menuitem"
                          href={item.href}
                          onClick={closeMenu}
                          className="flex min-h-[60px] items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                        >
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {logoutError && (
                    <p
                      role="alert"
                      className="mx-2 rounded-lg bg-red-500/10 p-2 text-xs text-red-600"
                    >
                      {logoutError}
                    </p>
                  )}

                  <div className="my-1 border-t border-border" />

                  <button
                    type="button"
                    role="menuitem"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-60"
                  >
                    <LogOut className="h-4 w-4" />
                    {loggingOut ? "Logging out..." : "Log out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-xl md:hidden"
      >
        <div className="mx-auto grid w-full max-w-lg grid-flow-col auto-cols-fr items-stretch px-1 pt-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const on = isActive(item);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={on ? "page" : undefined}
                className={[
                  "flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2",
                  "text-[10px] font-medium transition-colors",
                  FOCUS,
                  on
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Icon
                  className="h-5 w-5 shrink-0"
                  strokeWidth={on ? 2.5 : 1.8}
                />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default AppHeader;
