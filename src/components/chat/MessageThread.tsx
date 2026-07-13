"use client";

import { useMemo } from "react";
import { MessageBubble, type ChatMessage } from "@/components/chat/MessageBubble";

const GROUP_WINDOW_MS = 5 * 60 * 1000;

export function MessageThread({
  messages,
  currentUserId,
  searchQuery,
  bottomRef,
}: {
  messages: ChatMessage[];
  currentUserId: string;
  searchQuery?: string;
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  const query = searchQuery?.trim().toLowerCase() ?? "";

  const visible = useMemo(() => {
    if (!query) return messages;
    return messages.filter((m) => m.content?.toLowerCase().includes(query));
  }, [messages, query]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4">
      {visible.length === 0 && query && (
        <p className="py-8 text-center text-sm text-app-text-secondary">
          No messages match &quot;{searchQuery}&quot;.
        </p>
      )}
      {visible.map((m, i) => {
        const prev = visible[i - 1];
        const showHeader =
          !!query ||
          i === 0 ||
          prev.senderId !== m.senderId ||
          new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() > GROUP_WINDOW_MS;

        return (
          <MessageBubble
            key={m.id}
            message={m}
            isSelf={m.senderId === currentUserId}
            showHeader={showHeader}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
