"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, Plus, KeyRound, ArrowLeft, MessageSquare, FileText, Users, Settings } from "lucide-react";
import { GroupRow } from "@/components/groups/GroupRow";
import { formatRelativeTime } from "@/lib/format";
import { MOCK_DM_THREADS } from "@/components/dm/mockDmData";
import type { GroupPreview } from "@/components/groups/types";

const SUB_TABS = [
  { value: "chat", label: "Chat", icon: MessageSquare },
  { value: "notes", label: "Shared notes", icon: FileText },
  { value: "members", label: "Members", icon: Users },
  { value: "settings", label: "Group settings", icon: Settings },
];

function GroupSubNav({ group, activeTab }: { group: GroupPreview; activeTab: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-app-border px-3 py-3">
        <Link
          href="/groups"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-app-text-secondary transition hover:bg-white/5 hover:text-app-text-primary"
          aria-label="Back to groups"
        >
          <ArrowLeft size={16} />
        </Link>
        <p className="truncate text-sm font-semibold text-app-text-primary">{group.name}</p>
      </div>

      <nav className="flex flex-col gap-0.5 p-2">
        {SUB_TABS.map(({ value, label, icon: Icon }) => {
          const active = activeTab === value;
          return (
            <Link
              key={value}
              href={`/groups/${group.id}?tab=${value}`}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-app-accent/15 text-app-text-primary"
                  : "text-app-text-secondary hover:bg-white/5 hover:text-app-text-primary"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 border-t border-app-border p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-app-text-secondary">
          Materials
        </p>
        <p className="rounded-lg border border-dashed border-app-border px-3 py-4 text-center text-xs text-app-text-secondary">
          No materials pinned yet. Pin a shared note to see it here.
        </p>
      </div>
    </div>
  );
}

function DmList({ filter }: { filter: string }) {
  const filtered = MOCK_DM_THREADS.filter((t) =>
    t.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1 px-2">
      {filtered.map((thread) => (
        <Link
          key={thread.id}
          href={`/groups?view=dms&dm=${thread.id}`}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/5"
        >
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint-3 text-sm font-semibold text-white">
            {thread.name.slice(0, 2).toUpperCase()}
            {thread.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-app-bg-elevated bg-online" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-sm font-medium text-app-text-primary">{thread.name}</p>
              <span className="shrink-0 text-[11px] text-app-text-secondary">
                {formatRelativeTime(thread.lastMessageAt)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs text-app-text-secondary">{thread.lastMessage}</p>
              {thread.unreadCount > 0 && (
                <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-app-accent px-1 text-[10px] font-semibold text-white">
                  {thread.unreadCount}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function GroupList({ groups }: { groups: GroupPreview[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState("");

  const isDms = searchParams.get("view") === "dms";
  const groupIdMatch = pathname.match(/^\/groups\/([^/]+)$/);
  const activeGroupId = groupIdMatch && groupIdMatch[1] !== "new" && groupIdMatch[1] !== "join"
    ? groupIdMatch[1]
    : null;
  const activeGroup = activeGroupId ? groups.find((g) => g.id === activeGroupId) : null;
  const activeTab = searchParams.get("tab") ?? "chat";

  const filteredGroups = useMemo(
    () => groups.filter((g) => g.name.toLowerCase().includes(filter.toLowerCase())),
    [groups, filter]
  );

  if (activeGroup) {
    return (
      <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-app-border bg-app-bg-elevated">
        <GroupSubNav group={activeGroup} activeTab={activeTab} />
      </div>
    );
  }

  return (
    <div className="flex h-full w-[280px] shrink-0 flex-col border-r border-app-border bg-app-bg-elevated">
      <div className="flex flex-col gap-3 p-3">
        <div className="relative">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-text-secondary"
          />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder={isDms ? "Search direct messages" : "Search groups"}
            className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 pl-9 text-sm text-app-text-primary outline-none focus:border-app-accent"
          />
        </div>

        {!isDms && (
          <div className="flex gap-2">
            <Link
              href="/groups/new"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-app-accent px-2 py-2 text-xs font-medium text-white transition hover:brightness-110"
            >
              <Plus size={14} />
              Create
            </Link>
            <Link
              href="/groups/join"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-app-border px-2 py-2 text-xs font-medium text-app-text-primary transition hover:bg-white/5"
            >
              <KeyRound size={14} />
              Join with code
            </Link>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {isDms ? (
          <DmList filter={filter} />
        ) : filteredGroups.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-app-text-secondary">
            {groups.length === 0 ? "No groups yet." : "No groups match your search."}
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {filteredGroups.map((group, i) => (
              <GroupRow key={group.id} group={group} index={i} active={group.id === activeGroupId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
