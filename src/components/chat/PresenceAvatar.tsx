const tints = ["bg-tint-1", "bg-tint-2", "bg-tint-3", "bg-tint-4"];

export function PresenceAvatar({
  name,
  index,
  online,
}: {
  name: string;
  index: number;
  online: boolean;
}) {
  return (
    <div className="relative" title={name}>
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${tints[index % tints.length]}`}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-app-card bg-online" />
      )}
    </div>
  );
}
