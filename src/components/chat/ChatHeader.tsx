"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X, MoreVertical, Bell, BellOff, Info } from "lucide-react";
import { PresenceAvatar } from "@/components/chat/PresenceAvatar";
import { LeaveGroupButton } from "@/components/groups/LeaveGroupButton";

type MemberProfile = { id: string; displayName: string };

export function ChatHeader({
  groupId,
  groupName,
  currentUserId,
  memberProfiles,
  onlineIds,
  searchOpen,
  searchQuery,
  onToggleSearch,
  onSearchQueryChange,
}: {
  groupId: string;
  groupName: string;
  currentUserId: string;
  memberProfiles: MemberProfile[];
  onlineIds: Set<string>;
  searchOpen: boolean;
  searchQuery: string;
  onToggleSearch: () => void;
  onSearchQueryChange: (value: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onlineCount = memberProfiles.filter((p) => onlineIds.has(p.id)).length;
  const memberCount = memberProfiles.length + 1;

  return (
    <div className="border-b border-app-border bg-app-card">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-app-text-primary">{groupName}</p>
          <p className="truncate text-xs text-app-text-secondary">
            {onlineCount > 0 ? `${onlineCount} online · ` : ""}
            {memberCount} {memberCount === 1 ? "member" : "members"}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <div className="mr-1 hidden -space-x-2 sm:flex">
            {memberProfiles.slice(0, 4).map((p) => (
              <PresenceAvatar
                key={p.id}
                name={p.displayName}
                id={p.id}
                online={onlineIds.has(p.id)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Search in conversation"
            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
              searchOpen
                ? "bg-app-active-bg text-app-accent-hover"
                : "text-app-text-secondary hover:bg-hover-overlay hover:text-app-text-primary"
            }`}
          >
            <Search size={17} />
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="More options"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-app-text-secondary transition hover:bg-hover-overlay hover:text-app-text-primary"
            >
              <MoreVertical size={17} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-app-border bg-app-card p-1.5 shadow-2xl"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setMuted((v) => !v)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-app-text-primary transition hover:bg-hover-overlay"
                >
                  {muted ? <Bell size={16} /> : <BellOff size={16} />}
                  {muted ? "Unmute group" : "Mute group"}
                </button>
                <Link
                  href={`/groups/${groupId}?tab=settings`}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-app-text-primary transition hover:bg-hover-overlay"
                >
                  <Info size={16} />
                  Group info
                </Link>
                <LeaveGroupButton
                  groupId={groupId}
                  currentUserId={currentUserId}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-danger transition hover:bg-danger/10"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="flex items-center gap-2 border-t border-app-border px-4 py-2">
          <Search size={14} className="shrink-0 text-app-text-secondary" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Search in this conversation..."
            className="flex-1 bg-transparent text-sm text-app-text-primary outline-none placeholder:text-app-text-secondary"
          />
          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Close search"
            className="shrink-0 text-app-text-secondary hover:text-app-text-primary"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
