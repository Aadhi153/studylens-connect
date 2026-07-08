import Link from "next/link";
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

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-app-text-primary">Your groups</h1>
        <div className="flex gap-3">
          <Link
            href="/groups/join"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm text-app-text-primary hover:bg-white/5"
          >
            Join with code
          </Link>
          <Link
            href="/groups/new"
            className="rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110"
          >
            + Create Group
          </Link>
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-app-text-secondary">
          You&apos;re not in any groups yet. Create one or join with an invite code.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group, i) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              inviteCode={group.invite_code}
              index={i}
            />
          ))}
        </div>
      )}
    </main>
  );
}
