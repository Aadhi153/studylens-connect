"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { MessagesSquare, Users, Mail, Plus, UserPlus2 } from "lucide-react";
import { NotificationsBell } from "@/components/groups/NotificationsBell";
import { UserMenu } from "@/components/groups/UserMenu";

function CreateButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
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
        aria-label="Create"
        className="flex h-10 w-10 items-center justify-center rounded-xl text-app-text-secondary transition hover:bg-hover-overlay hover:text-app-text-primary"
      >
        <Plus size={20} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-0 left-full z-50 ml-2 w-56 rounded-xl border border-app-border bg-app-card p-1.5 shadow-2xl"
        >
          <Link
            href="/groups/new"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-app-text-primary transition hover:bg-hover-overlay"
          >
            <Users size={16} className="text-app-text-secondary" />
            Create group
          </Link>
          <Link
            href="/groups?view=dms"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-app-text-primary transition hover:bg-hover-overlay"
          >
            <UserPlus2 size={16} className="text-app-text-secondary" />
            New message
          </Link>
        </div>
      )}
    </div>
  );
}

export function IconRail({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDms = searchParams.get("view") === "dms";
  const isGroups = pathname.startsWith("/groups") && !isDms;

  const iconBtn = (active: boolean) =>
    `flex h-10 w-10 items-center justify-center rounded-xl transition ${
      active
        ? "bg-app-accent text-white"
        : "text-app-text-secondary hover:bg-hover-overlay hover:text-app-text-primary"
    }`;

  return (
    <aside className="panel-divider-right flex h-full w-16 shrink-0 flex-col items-center gap-1.5 bg-app-rail-bg py-4">
      <Link
        href="/groups"
        title="StudyLens Connect"
        className="mb-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-app-accent text-white"
      >
        <MessagesSquare size={20} />
      </Link>

      <Link href="/groups" title="Groups" className={iconBtn(isGroups)}>
        <Users size={20} />
      </Link>
      <Link href="/groups?view=dms" title="Direct messages" className={iconBtn(isDms)}>
        <Mail size={20} />
      </Link>

      <div className="my-1 h-px w-8 bg-app-border" />

      <NotificationsBell />
      <CreateButton />

      <div className="mt-auto">
        <UserMenu email={userEmail} placement="top" />
      </div>
    </aside>
  );
}
