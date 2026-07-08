export function TypingIndicator({ names }: { names: string[] }) {
  if (names.length === 0) return <div className="h-5" />;

  const label =
    names.length === 1
      ? `${names[0]} is typing...`
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]} are typing...`;

  return (
    <div className="flex h-5 items-center gap-2 px-1 text-xs italic text-app-text-secondary">
      <span className="flex gap-0.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-secondary [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-secondary [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-secondary" />
      </span>
      {label}
    </div>
  );
}
