import Link from "next/link";

const tints = ["bg-tint-1", "bg-tint-2", "bg-tint-3", "bg-tint-4"];

export function GroupCard({
  id,
  name,
  inviteCode,
  index,
}: {
  id: string;
  name: string;
  inviteCode: string;
  index: number;
}) {
  return (
    <Link
      href={`/groups/${id}`}
      className="flex items-center gap-4 rounded-xl bg-app-card p-4 transition hover:brightness-110"
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${tints[index % tints.length]}`}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-app-text-primary">{name}</p>
        <p className="text-xs text-app-text-secondary">Invite code: {inviteCode}</p>
      </div>
    </Link>
  );
}
