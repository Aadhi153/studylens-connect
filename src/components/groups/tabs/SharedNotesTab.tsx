import { FileText, StickyNote } from "lucide-react";

const MOCK_NOTES = [
  { id: "note-1", title: "Chapter 4 Summary — Cellular Respiration", author: "Priya Shah" },
  { id: "note-2", title: "Midterm Review Sheet", author: "Marcus Webb" },
];

export function SharedNotesTab({ groupName }: { groupName: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-app-border bg-app-card px-4 py-3">
        <p className="text-sm font-medium text-app-text-primary">{groupName}</p>
        <p className="text-xs text-app-text-secondary">Shared notes</p>
      </div>

      <div className="mx-auto w-full max-w-lg flex-1 overflow-y-auto px-4 py-8">
        <div className="flex flex-col gap-3">
          {MOCK_NOTES.map((note) => (
            <div
              key={note.id}
              className="flex items-center gap-3 rounded-xl border border-app-border bg-app-card px-4 py-3"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-app-accent/15 text-app-accent-hover">
                <FileText size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-app-text-primary">{note.title}</p>
                <p className="text-xs text-app-text-secondary">Shared by {note.author}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-center gap-2 rounded-xl border border-dashed border-app-border px-4 py-8 text-center">
          <StickyNote size={22} className="text-app-text-secondary" />
          <p className="text-xs text-app-text-secondary">
            Notes pinned to messages in this group will also show up here.
          </p>
        </div>
      </div>
    </div>
  );
}
