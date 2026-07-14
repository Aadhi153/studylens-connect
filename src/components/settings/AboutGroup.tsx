"use client";

import { Flame, StickyNote, Users } from "lucide-react";

export function AboutGroup({
  memberSince,
  streak,
  totalNotes,
  groupsJoined,
}: {
  memberSince: string;
  streak: number;
  totalNotes: number;
  groupsJoined: number;
}) {
  const joinedLabel = new Date(memberSince).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const stats = [
    { icon: Flame, value: streak, label: streak === 1 ? "day streak" : "day streak" },
    { icon: StickyNote, value: totalNotes, label: totalNotes === 1 ? "note" : "notes" },
    { icon: Users, value: groupsJoined, label: groupsJoined === 1 ? "group" : "groups" },
  ];

  return (
    <div className="border-t border-white/[0.08] pt-5">
      <p className="settings-section-title mb-4">About you</p>

      <p className="mb-4 text-sm text-white/70">Member since {joinedLabel}</p>

      <div className="grid grid-cols-3 gap-2">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-2 py-3 text-center"
          >
            <Icon size={15} className="text-settings-accent" />
            <span className="text-base font-semibold text-white">{value}</span>
            <span className="text-[11px] leading-tight text-white/50">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
