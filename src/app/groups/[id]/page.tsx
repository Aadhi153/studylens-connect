import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { MembersTab } from "@/components/groups/tabs/MembersTab";
import { SharedNotesTab } from "@/components/groups/tabs/SharedNotesTab";
import { GroupSettingsTab } from "@/components/groups/tabs/GroupSettingsTab";
import type { ChatMessage } from "@/components/chat/MessageBubble";

export default async function GroupChatPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id: groupId } = await params;
  const { tab } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, invite_code")
    .eq("id", groupId)
    .maybeSingle();

  if (!group) notFound();

  const { data: memberRows } = await supabase
    .from("group_members")
    .select("user_id")
    .eq("group_id", groupId);

  const memberIds = (memberRows ?? []).map((m) => m.user_id);

  const { data: profileRows } = await supabase
    .from("profiles")
    .select("id, email, display_name")
    .in("id", memberIds.length > 0 ? memberIds : [user.id]);

  const displayNameFor = (id: string) => {
    const profile = profileRows?.find((p) => p.id === id);
    return profile?.display_name ?? profile?.email?.split("@")[0] ?? "Member";
  };

  const memberProfiles = memberIds
    .filter((id) => id !== user.id)
    .map((id) => ({ id, displayName: displayNameFor(id) }));

  if (tab === "members") {
    return <MembersTab groupName={group.name} members={memberProfiles} currentUserId={user.id} />;
  }

  if (tab === "notes") {
    return <SharedNotesTab groupName={group.name} />;
  }

  if (tab === "settings") {
    return (
      <GroupSettingsTab
        groupId={group.id}
        groupName={group.name}
        inviteCode={group.invite_code}
        currentUserId={user.id}
      />
    );
  }

  const { data: messageRows } = await supabase
    .from("messages")
    .select("id, sender_id, content, image_url, created_at, pinned_note_id")
    .eq("group_id", groupId)
    .order("created_at", { ascending: true })
    .limit(200);

  const ownMessageIds = (messageRows ?? [])
    .filter((m) => m.sender_id === user.id)
    .map((m) => m.id);

  const { data: readRows } =
    ownMessageIds.length > 0
      ? await supabase
          .from("message_reads")
          .select("message_id, user_id")
          .in("message_id", ownMessageIds)
      : { data: [] as { message_id: string; user_id: string }[] };

  const readByOthersSet = new Set(
    (readRows ?? []).filter((r) => r.user_id !== user.id).map((r) => r.message_id)
  );

  const initialMessages: ChatMessage[] = (messageRows ?? []).map((m) => ({
    id: m.id,
    senderId: m.sender_id,
    senderName: displayNameFor(m.sender_id),
    content: m.content,
    imageUrl: m.image_url,
    createdAt: m.created_at,
    readByOthers: readByOthersSet.has(m.id),
  }));

  const pinnedNoteId =
    (messageRows ?? [])
      .slice()
      .reverse()
      .find((m) => m.pinned_note_id)?.pinned_note_id ?? null;

  return (
    <ChatRoom
      groupId={group.id}
      groupName={group.name}
      currentUser={{ id: user.id, displayName: displayNameFor(user.id) }}
      initialMessages={initialMessages}
      memberProfiles={memberProfiles}
      pinnedNoteId={pinnedNoteId}
    />
  );
}
