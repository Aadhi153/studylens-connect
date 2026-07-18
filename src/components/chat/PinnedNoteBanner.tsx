export function PinnedNoteBanner({ noteId }: { noteId: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-app-border bg-app-card px-4 py-2 text-xs text-app-text-secondary">
      <span>📌</span>
      <span>A note is pinned to this group.</span>
      <a
        href={`/notes/${noteId}`}
        className="ml-auto text-app-accent hover:underline"
      >
        View note
      </a>
    </div>
  );
}
