"use client";

import { useEffect, useRef, useState } from "react";
import { Smile } from "lucide-react";

const EMOJIS = [
  "😀", "😂", "😊", "😍", "🤔", "😅",
  "👍", "👎", "🙏", "🙌", "👀", "💯",
  "🎉", "🔥", "✨", "❤️", "😢", "😴",
  "📚", "✏️", "💡", "❓", "❗", "🥳",
];

export function EmojiPopover({ onSelect }: { onSelect: (emoji: string) => void }) {
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
        aria-label="Insert emoji"
        className="rounded-lg p-2 text-app-text-secondary transition hover:bg-white/5 hover:text-app-text-primary"
      >
        <Smile size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 grid w-56 grid-cols-6 gap-1 rounded-xl border border-app-border bg-app-card p-2 shadow-2xl"
        >
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onSelect(emoji);
                setOpen(false);
              }}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-base transition hover:bg-white/5"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
