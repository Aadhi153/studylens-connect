"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LeaveGroupButton({
  groupId,
  currentUserId,
  className,
}: {
  groupId: string;
  currentUserId: string;
  className?: string;
}) {
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLeave() {
    if (!confirm("Leave this group? You'll need an invite code to rejoin.")) return;

    setLeaving(true);
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", currentUserId);
    setLeaving(false);

    if (error) {
      console.error(error);
      return;
    }

    router.push("/groups");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLeave}
      disabled={leaving}
      className={
        className ??
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger transition hover:bg-danger/10 disabled:opacity-60"
      }
    >
      <LogOut size={16} />
      {leaving ? "Leaving..." : "Leave group"}
    </button>
  );
}
