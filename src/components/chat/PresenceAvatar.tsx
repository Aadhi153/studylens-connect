import { avatarColorFor, getInitials } from "@/lib/avatarColor";

export function PresenceAvatar({
  name,
  id,
  online,
}: {
  name: string;
  id: string;
  online: boolean;
}) {
  return (
    <div className="relative" title={name}>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${avatarColorFor(id)}`}
      >
        {getInitials(name)}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-app-card bg-online" />
      )}
    </div>
  );
}
