import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/groups/AppShell";
import type { GroupPreview } from "@/components/groups/types";

export default async function GroupsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("group_members")
    .select("groups(id, name, invite_code)")
    .eq("user_id", user!.id);

  const groupRows = (memberships ?? [])
    .map((m) => m.groups)
    .filter((g): g is { id: string; name: string; invite_code: string } => g !== null);

  const groupIds = groupRows.map((g) => g.id);

  const [{ data: memberRows }, { data: recentMessages }] =
    groupIds.length > 0
      ? await Promise.all([
          supabase.from("group_members").select("group_id").in("group_id", groupIds),
          supabase
            .from("messages")
            .select("id, group_id, sender_id, content, image_url, created_at")
            .in("group_id", groupIds)
            .order("created_at", { ascending: false })
            .limit(300),
        ])
      : [{ data: [] }, { data: [] }];

  const memberCountByGroup = new Map<string, number>();
  (memberRows ?? []).forEach((row) => {
    memberCountByGroup.set(row.group_id, (memberCountByGroup.get(row.group_id) ?? 0) + 1);
  });

  const lastMessageByGroup = new Map<string, string>();
  const lastMessageAtByGroup = new Map<string, string>();
  (recentMessages ?? []).forEach((row) => {
    if (lastMessageAtByGroup.has(row.group_id)) return;
    lastMessageAtByGroup.set(row.group_id, row.created_at);
    const preview = row.content?.trim() || (row.image_url ? "📷 Photo" : "");
    if (preview) lastMessageByGroup.set(row.group_id, preview);
  });

  const unreadCandidateIds = (recentMessages ?? [])
    .filter((m) => m.sender_id !== user!.id)
    .map((m) => m.id);

  const { data: readRows } =
    unreadCandidateIds.length > 0
      ? await supabase
          .from("message_reads")
          .select("message_id")
          .eq("user_id", user!.id)
          .in("message_id", unreadCandidateIds)
      : { data: [] as { message_id: string }[] };

  const readMessageIds = new Set((readRows ?? []).map((r) => r.message_id));

  const unreadCountByGroup = new Map<string, number>();
  (recentMessages ?? []).forEach((m) => {
    if (m.sender_id === user!.id) return;
    if (readMessageIds.has(m.id)) return;
    unreadCountByGroup.set(m.group_id, (unreadCountByGroup.get(m.group_id) ?? 0) + 1);
  });

  const groups: GroupPreview[] = groupRows.map((g) => ({
    id: g.id,
    name: g.name,
    memberCount: memberCountByGroup.get(g.id) ?? 1,
    lastMessage: lastMessageByGroup.get(g.id) ?? null,
    lastMessageAt: lastMessageAtByGroup.get(g.id) ?? null,
    unreadCount: unreadCountByGroup.get(g.id) ?? 0,
  }));

  return (
    <AppShell userEmail={user?.email ?? ""} groups={groups}>
      {children}
    </AppShell>
  );
}
