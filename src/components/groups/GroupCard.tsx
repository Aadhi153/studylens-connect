import Link from "next/link";

const tints = ["bg-tint-1", "bg-tint-2", "bg-tint-3", "bg-tint-4"];

export function GroupCard({
  id,
  name,
  memberCount,
  lastMessage,
  index,
}: {
  id: string;
  name: string;
  memberCount: number;
  lastMessage: string | null;
  index: number;
}) {
  const clusterSize = Math.max(1, Math.min(memberCount, 3));

  return (
    <Link href={`/groups/${id}`} className="group-card flex items-center gap-4">
      <div className="flex -space-x-2">
        {Array.from({ length: clusterSize }).map((_, i) => (
          <div
            key={i}
            className={`h-8 w-8 shrink-0 rounded-full border-2 border-app-bg ${tints[(index + i) % tints.length]}`}
          />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-app-text-primary">{name}</p>
        <p className="truncate text-xs text-app-text-secondary">
          {memberCount} {memberCount === 1 ? "member" : "members"}
          {lastMessage ? ` · ${lastMessage}` : ""}
        </p>
      </div>
    </Link>
  );
}
