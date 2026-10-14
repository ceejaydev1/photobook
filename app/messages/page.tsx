"use client";

// app/messages/page.tsx
// UI ONLY. Conversations and messages are placeholder data held in state.
// Sending a message just appends it locally; wire it to Supabase later.

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Search, SendHorizontal } from "lucide-react";
import { AppHeader } from "@/components/app-header";

const CURRENCY = "₱";

type Tone = "blue" | "violet" | "green" | "amber";
type Msg = { id: string; from: "me" | "them"; text: string; time: string };
type Convo = {
  id: string;
  person: string;
  initials: string;
  tone: Tone;
  unread: number;
  online: boolean;
  // The booking this chat is about, if any
  booking?: { service: string; date: string; price: number; status: "Pending" | "Accepted" | "Completed" };
  messages: Msg[];
};

const INITIAL: Convo[] = [
  {
    id: "c1", person: "Creative Name", initials: "CN", tone: "blue", unread: 2, online: true,
    booking: { service: "Wedding shoot", date: "Sat, Nov 22", price: 18000, status: "Accepted" },
    messages: [
      { id: "m1", from: "me", text: "Hi! Is the 9:00 AM start still okay for the ceremony?", time: "10:12 AM" },
      { id: "m2", from: "them", text: "Yes, I'll arrive by 8:30 to scout the venue.", time: "10:20 AM" },
      { id: "m3", from: "them", text: "Can you send me the reception address and the shot list when you have it?", time: "10:21 AM" },
    ],
  },
  {
    id: "c2", person: "Maria Santos", initials: "MS", tone: "amber", unread: 1, online: false,
    booking: { service: "Birthday coverage", date: "Sat, Nov 29", price: 7500, status: "Pending" },
    messages: [
      { id: "m1", from: "them", text: "Hello! Do you offer same-week photo previews? It's for a debut.", time: "Yesterday" },
    ],
  },
  {
    id: "c3", person: "Paolo Reyes", initials: "PR", tone: "violet", unread: 0, online: true,
    booking: { service: "Wedding photo edit", date: "Wed, Nov 12", price: 6000, status: "Accepted" },
    messages: [
      { id: "m1", from: "them", text: "I've uploaded the 400 RAW files to the shared folder.", time: "Mon" },
      { id: "m2", from: "me", text: "Got them. First batch will be back in 3 days.", time: "Mon" },
    ],
  },
  {
    id: "c4", person: "Ana Dizon", initials: "AD", tone: "green", unread: 0, online: false,
    messages: [
      { id: "m1", from: "me", text: "Thanks for your interest. I'm booked that week, sorry!", time: "Oct 12" },
    ],
  },
];

const QUICK_REPLIES = ["Sounds good", "Can you share more details?", "What time works for you?"];

const TONE: Record<Tone, string> = {
  blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
  green: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
};

function Avatar({ c, size = "md" }: { c: Convo; size?: "sm" | "md" }) {
  return (
    <div className="relative shrink-0">
      <div className={`grid place-items-center rounded-full font-semibold ${TONE[c.tone]} ${size === "sm" ? "h-9 w-9 text-xs" : "h-11 w-11 text-sm"}`} aria-hidden>
        {c.initials}
      </div>
      {c.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" title="Online" />}
    </div>
  );
}

export default function MessagesPage() {
  const [convos, setConvos] = useState(INITIAL);
  const [activeId, setActiveId] = useState<string | null>("c1");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () =>
      convos
        .filter((c) => (filter === "unread" ? c.unread > 0 : true))
        .filter((c) => c.person.toLowerCase().includes(query.trim().toLowerCase())),
    [convos, filter, query]
  );
  const active = convos.find((c) => c.id === activeId) ?? null;
  const totalUnread = convos.reduce((n, c) => n + c.unread, 0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [activeId, active?.messages.length]);

  const open = (id: string) => {
    setActiveId(id);
    setConvos((prev) => prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)));
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t || !active) return;
    setConvos((prev) =>
      prev.map((c) =>
        c.id === active.id
          ? { ...c, messages: [...c.messages, { id: `m${c.messages.length + 1}`, from: "me", text: t, time: "Now" }] }
          : c
      )
    );
    setDraft("");
  };

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
      <AppHeader active="Messages" hasCreativeProfile unread={totalUnread} />

      <main className="mx-auto grid min-h-0 w-full max-w-6xl flex-1 grid-cols-1 pb-20 md:grid-cols-[340px_minmax(0,1fr)] md:px-6 md:py-6 md:pb-0">
        {/* Conversation list */}
        <section
          aria-label="Conversations"
          className={`min-h-0 flex-col border-r bg-card md:flex md:rounded-l-2xl md:border md:border-r-0 ${active ? "hidden" : "flex"}`}
        >
          <div className="space-y-3 border-b p-4">
            <h1 className="text-lg font-semibold">Messages</h1>
            <label className="relative block">
              <span className="sr-only">Search conversations</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name"
                className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
            </label>
            <div className="inline-flex rounded-lg bg-muted/60 p-1 text-sm">
              {(["all", "unread"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-md px-3 py-1 font-medium capitalize ${filter === f ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                >
                  {f}{f === "unread" && totalUnread > 0 ? ` (${totalUnread})` : ""}
                </button>
              ))}
            </div>
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto">
            {list.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">No conversations found.</li>}
            {list.map((c) => {
              const last = c.messages[c.messages.length - 1];
              return (
                <li key={c.id}>
                  <button
                    onClick={() => open(c.id)}
                    className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left hover:bg-muted/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600 ${
                      c.id === activeId ? "bg-muted/60" : ""
                    }`}
                  >
                    <Avatar c={c} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className={`truncate text-sm ${c.unread ? "font-semibold" : "font-medium"}`}>{c.person}</p>
                        <span className="shrink-0 text-xs text-muted-foreground">{last.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${c.unread ? "text-foreground" : "text-muted-foreground"}`}>
                          {last.from === "me" ? "You: " : ""}{last.text}
                        </p>
                        {c.unread > 0 && (
                          <span className="grid h-5 min-w-5 shrink-0 place-items-center rounded-full bg-blue-600 px-1.5 text-xs font-medium text-white">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Thread */}
        <section
          aria-label="Conversation"
          className={`min-h-0 flex-col bg-background md:flex md:rounded-r-2xl md:border ${active ? "flex" : "hidden"}`}
        >
          {active ? (
            <>
              <header className="flex items-center gap-3 border-b px-4 py-3">
                <button onClick={() => setActiveId(null)} className="rounded-lg p-2 hover:bg-muted md:hidden" aria-label="Back to conversations">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <Avatar c={active} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{active.person}</p>
                  <p className="text-xs text-muted-foreground">{active.online ? "Online now" : "Offline"}</p>
                </div>
              </header>

              {active.booking && (
                <Link
                  href="/bookings"
                  className="mx-4 mt-3 flex items-center gap-3 rounded-xl border bg-card px-4 py-3 hover:border-blue-400"
                >
                  <CalendarDays className="h-4 w-4 shrink-0 text-blue-600" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{active.booking.service}</p>
                    <p className="text-xs text-muted-foreground">
                      {active.booking.date} · {CURRENCY}{active.booking.price.toLocaleString("en-PH")}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">{active.booking.status}</span>
                </Link>
              )}

              <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-4" aria-live="polite">
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[80%]">
                      <p
                        className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                          m.from === "me" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md bg-muted"
                        }`}
                      >
                        {m.text}
                      </p>
                      <p className={`mt-1 text-xs text-muted-foreground ${m.from === "me" ? "text-right" : ""}`}>{m.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="border-t p-3">
                <div className="mb-2 flex gap-2 overflow-x-auto">
                  {QUICK_REPLIES.map((q) => (
                    <button key={q} onClick={() => send(q)} className="whitespace-nowrap rounded-full border px-3 py-1 text-xs hover:bg-muted">
                      {q}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => { e.preventDefault(); send(draft); }}
                  className="flex items-center gap-2"
                >
                  <label className="flex-1">
                    <span className="sr-only">Message</span>
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Message ${active.person}`}
                      className="w-full rounded-full border bg-background px-4 py-2.5 text-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="grid h-10 w-10 place-items-center rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="m-auto p-8 text-center">
              <p className="font-medium">Select a conversation</p>
              <p className="mt-1 text-sm text-muted-foreground">Your chats with clients and creatives show up here.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}