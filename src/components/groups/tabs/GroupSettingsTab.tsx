"use client";

import { useState } from "react";
import { Check, Copy, Bell } from "lucide-react";
import { LeaveGroupButton } from "@/components/groups/LeaveGroupButton";

export function GroupSettingsTab({
  groupId,
  groupName,
  inviteCode,
  currentUserId,
}: {
  groupId: string;
  groupName: string;
  inviteCode: string;
  currentUserId: string;
}) {
  const [copied, setCopied] = useState(false);
  const [notifyOn, setNotifyOn] = useState(true);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-app-border bg-app-card px-4 py-3">
        <p className="text-sm font-medium text-app-text-primary">{groupName}</p>
        <p className="text-xs text-app-text-secondary">Group settings</p>
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 overflow-y-auto px-4 py-6">
        <div className="rounded-xl border border-app-border bg-app-card p-4">
          <p className="settings-label">Group name</p>
          <p className="text-sm text-app-text-primary">{groupName}</p>
        </div>

        <div className="rounded-xl border border-app-border bg-app-card p-4">
          <p className="settings-label">Invite code</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg border border-app-border bg-app-bg px-3 py-2 text-sm text-app-text-primary">
              {inviteCode}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-app-border text-app-text-secondary transition hover:bg-white/5 hover:text-app-text-primary"
              aria-label="Copy invite code"
            >
              {copied ? <Check size={16} className="text-online" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-app-border bg-app-card p-4">
          <div className="settings-toggle-row">
            <div className="flex items-center gap-2.5">
              <Bell size={16} className="text-app-text-secondary" />
              <span className="text-sm text-app-text-primary">Notify me about this group</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={notifyOn}
              onClick={() => setNotifyOn((v) => !v)}
              className={`settings-toggle ${notifyOn ? "is-on" : ""}`}
            >
              <span className="settings-toggle-knob" />
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-danger/35 bg-danger/5 p-4">
          <p className="mb-2 text-sm font-medium text-app-text-primary">Leave group</p>
          <p className="mb-3 text-xs text-app-text-secondary">
            You&apos;ll lose access to this group&apos;s messages and shared notes.
          </p>
          <LeaveGroupButton
            groupId={groupId}
            currentUserId={currentUserId}
            className="settings-btn-danger-outline"
          />
        </div>
      </div>
    </div>
  );
}
