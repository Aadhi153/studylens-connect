"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";

const MOCK_NOTIFICATIONS = [
  {
    id: "n1",
    title: "CS 101 Study Group",
    body: "Alex: Can someone share the slides from today?",
    time: "2m",
  },
  {
    id: "n2",
    title: "Reminder",
    body: "Midterm review session tomorrow at 6:00 PM.",
    time: "1h",
  },
  {
    id: "n3",
    title: "Biology Lab Partners",
    body: "Priya mentioned you in a message.",
    time: "3h",
  },
];

export function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-app-text-secondary transition hover:bg-white/5 hover:text-app-text-primary"
      >
        <Bell size={20} />
        {MOCK_NOTIFICATIONS.length > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-app-unread px-1 text-[10px] font-semibold text-app-rail-bg">
            {MOCK_NOTIFICATIONS.length}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-0 left-full z-50 ml-2 w-72 rounded-xl border border-app-border bg-app-card p-2 shadow-2xl"
        >
          <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-app-text-secondary">
            Notifications
          </p>
          <div className="flex flex-col gap-0.5">
            {MOCK_NOTIFICATIONS.map((n) => (
              <div
                key={n.id}
                role="menuitem"
                className="cursor-pointer rounded-lg px-2 py-2 transition hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-app-text-primary">{n.title}</p>
                  <span className="shrink-0 text-[11px] text-app-text-secondary">{n.time}</span>
                </div>
                <p className="mt-0.5 truncate text-xs text-app-text-secondary">{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
