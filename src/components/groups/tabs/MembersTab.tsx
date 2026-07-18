import { avatarColorFor, getInitials } from "@/lib/avatarColor";

type Member = { id: string; displayName: string };

export function MembersTab({
  groupName,
  members,
  currentUserId,
}: {
  groupName: string;
  members: Member[];
  currentUserId: string;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-app-border bg-app-card px-4 py-3">
        <p className="text-sm font-medium text-app-text-primary">{groupName}</p>
        <p className="text-xs text-app-text-secondary">
          {members.length} {members.length === 1 ? "member" : "members"}
        </p>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-hover-overlay"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white ${avatarColorFor(member.id)}`}
              >
                {getInitials(member.displayName)}
              </div>
              <p className="text-sm text-app-text-primary">
                {member.displayName}
                {member.id === currentUserId && (
                  <span className="ml-2 text-xs text-app-text-secondary">(you)</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
