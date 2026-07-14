import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

export type ProfileStats = {
  groupsJoined: number;
  totalNotes: number;
  streak: number;
};

const STREAK_LOOKBACK_DAYS = 90;

function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const days = new Set(dates.map((iso) => new Date(iso).toDateString()));
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!days.has(cursor.toDateString())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (days.has(cursor.toDateString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export async function getProfileStats(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<ProfileStats> {
  const since = new Date();
  since.setDate(since.getDate() - STREAK_LOOKBACK_DAYS);

  const [groupsResult, notesResult, recentMessagesResult] = await Promise.all([
    supabase
      .from("group_members")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("sender_id", userId)
      .not("pinned_note_id", "is", null),
    supabase
      .from("messages")
      .select("created_at")
      .eq("sender_id", userId)
      .gte("created_at", since.toISOString()),
  ]);

  return {
    groupsJoined: groupsResult.count ?? 0,
    totalNotes: notesResult.count ?? 0,
    streak: computeStreak((recentMessagesResult.data ?? []).map((m) => m.created_at)),
  };
}
