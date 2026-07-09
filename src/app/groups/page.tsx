import Link from "next/link";
import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { GroupCard } from "@/components/groups/GroupCard";

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("group_members")
    .select("groups(id, name, invite_code)")
    .eq("user_id", user!.id);

  const groups = (memberships ?? [])
    .map((m) => m.groups)
    .filter((g): g is { id: string; name: string; invite_code: string } => g !== null);

  const groupIds = groups.map((g) => g.id);

  const [{ data: memberRows }, { data: recentMessages }] =
    groupIds.length > 0
      ? await Promise.all([
          supabase.from("group_members").select("group_id").in("group_id", groupIds),
          supabase
            .from("messages")
            .select("group_id, content, image_url, created_at")
            .in("group_id", groupIds)
            .order("created_at", { ascending: false })
            .limit(200),
        ])
      : [{ data: [] }, { data: [] }];

  const memberCountByGroup = new Map<string, number>();
  (memberRows ?? []).forEach((row) => {
    memberCountByGroup.set(row.group_id, (memberCountByGroup.get(row.group_id) ?? 0) + 1);
  });

  const lastMessageByGroup = new Map<string, string>();
  (recentMessages ?? []).forEach((row) => {
    if (lastMessageByGroup.has(row.group_id)) return;
    const preview = row.content?.trim() || (row.image_url ? "📷 Photo" : "");
    if (preview) lastMessageByGroup.set(row.group_id, preview);
  });

  return (
    <div className="groups-page-bg min-h-screen">
      <main className="groups-container mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-app-text-primary">Your groups</h1>
          <div className="flex gap-3">
            <Link href="/groups/join" className="groups-btn-secondary">
              Join with code
            </Link>
            <Link href="/groups/new" className="groups-btn-primary">
              + Create Group
            </Link>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Users size={24} />
            </div>
            <p className="empty-state-title">No groups yet</p>
            <p className="empty-state-subtitle">
              Create a study group or join one with an invite code to get started.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((group, i) => (
              <GroupCard
                key={group.id}
                id={group.id}
                name={group.name}
                memberCount={memberCountByGroup.get(group.id) ?? 1}
                lastMessage={lastMessageByGroup.get(group.id) ?? null}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
