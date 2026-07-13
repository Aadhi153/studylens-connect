"use client";

import { useRef, useState } from "react";
import { EmojiPopover } from "@/components/chat/EmojiPopover";
import { FlashcardPopover } from "@/components/chat/FlashcardPopover";

export function MessageInput({
  onSend,
  onTyping,
  uploading,
  placeholder = "Message the group...",
}: {
  onSend: (content: string, image?: File) => void;
  onTyping: () => void;
  uploading: boolean;
  placeholder?: string;
}) {
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImage, setPendingImage] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !pendingImage) return;
    onSend(text.trim(), pendingImage ?? undefined);
    setText("");
    setPendingImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-1 border-t border-app-border bg-app-card p-3"
    >
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg p-2 text-app-text-secondary hover:bg-white/5 hover:text-app-text-primary"
        aria-label="Attach image"
      >
        📎
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => setPendingImage(e.target.files?.[0] ?? null)}
      />

      <EmojiPopover onSelect={(emoji) => setText((t) => `${t}${emoji}`)} />
      <FlashcardPopover onSelect={(reference) => setText((t) => (t ? `${t} ${reference}` : reference))} />

      <div className="flex-1">
        {pendingImage && (
          <p className="mb-1 truncate text-xs text-app-text-secondary">
            📷 {pendingImage.name}
          </p>
        )}
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping();
          }}
          placeholder={placeholder}
          className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-sm text-app-text-primary outline-none focus:border-app-accent"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-60"
      >
        {uploading ? "..." : "Send"}
      </button>
    </form>
  );
}
