"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatRelativeTime } from "@/lib/format";
import type { GroupPreview } from "@/components/groups/types";

const tints = ["bg-tint-1", "bg-tint-2", "bg-tint-3", "bg-tint-4", "bg-tint-5", "bg-tint-6"];

export function GroupRow({
  group,
  index,
  active,
}: {
  group: GroupPreview;
  index: number;
  active: boolean;
}) {
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`presence:${group.id}`);

    channel
      .on("presence", { event: "sync" }, () => {
        setOnlineCount(Object.keys(channel.presenceState()).length);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [group.id]);

  return (
    <Link
      href={`/groups/${group.id}`}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
        active ? "bg-app-accent/15" : "hover:bg-white/5"
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${tints[index % tints.length]}`}
      >
        {group.name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium text-app-text-primary">{group.name}</p>
          {group.lastMessageAt && (
            <span className="shrink-0 text-[11px] text-app-text-secondary">
              {formatRelativeTime(group.lastMessageAt)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-xs text-app-text-secondary">
            {group.lastMessage ??
              `${group.memberCount} ${group.memberCount === 1 ? "member" : "members"}`}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {onlineCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] text-app-text-secondary">
                <span className="h-1.5 w-1.5 rounded-full bg-online" />
                {onlineCount}
              </span>
            )}
            {group.unreadCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-app-accent px-1 text-[10px] font-semibold text-white">
                {group.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
