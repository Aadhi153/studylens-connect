"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, FileText } from "lucide-react";

const MOCK_SHAREABLE_NOTES = [
  "Chapter 4 Summary — Cellular Respiration",
  "Midterm Review Sheet",
  "Flashcards: Key Vocabulary",
];

export function FlashcardPopover({ onSelect }: { onSelect: (reference: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Share a flashcard or note"
        className="rounded-lg p-2 text-app-text-secondary transition hover:bg-hover-overlay hover:text-app-text-primary"
      >
        <BookOpen size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-64 rounded-xl border border-app-border bg-app-card p-1.5 shadow-2xl"
        >
          <p className="px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-app-text-secondary">
            Share from your notes
          </p>
          {MOCK_SHAREABLE_NOTES.map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => {
                onSelect(`📎 Shared note: ${title}`);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm text-app-text-primary transition hover:bg-hover-overlay"
            >
              <FileText size={15} className="shrink-0 text-app-text-secondary" />
              <span className="truncate">{title}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
