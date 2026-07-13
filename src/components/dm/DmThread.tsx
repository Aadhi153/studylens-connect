"use client";

import { useEffect, useRef, useState } from "react";
import { MOCK_DM_THREADS, MOCK_DM_MESSAGES, type DmMessage } from "@/components/dm/mockDmData";
import { MessageBubble, type ChatMessage } from "@/components/chat/MessageBubble";
import { MessageInput } from "@/components/chat/MessageInput";

function toChatMessage(m: DmMessage): ChatMessage {
  return {
    id: m.id,
    senderId: m.senderId,
    senderName: m.senderName,
    content: m.content,
    imageUrl: null,
    createdAt: m.createdAt,
    readByOthers: true,
  };
}

export function DmThread({ threadId }: { threadId: string }) {
  const thread = MOCK_DM_THREADS.find((t) => t.id === threadId);
  const [messages, setMessages] = useState<DmMessage[]>(() => MOCK_DM_MESSAGES[threadId] ?? []);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!thread) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-app-text-secondary">
        Conversation not found.
      </div>
    );
  }

  function handleSend(content: string) {
    if (!content.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        senderId: "me",
        senderName: "You",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-app-border bg-app-card px-4 py-3">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-tint-3 text-xs font-semibold text-white">
          {thread.name.slice(0, 2).toUpperCase()}
          {thread.online && (
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-app-card bg-online" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-app-text-primary">{thread.name}</p>
          <p className="text-xs text-app-text-secondary">{thread.online ? "Online" : "Offline"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showHeader = i === 0 || prev.senderId !== m.senderId;
          return (
            <MessageBubble
              key={m.id}
              message={toChatMessage(m)}
              isSelf={m.senderId === "me"}
              showHeader={showHeader}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput
        onSend={handleSend}
        onTyping={() => {}}
        uploading={false}
        placeholder={`Message ${thread.name.split(" ")[0]}...`}
      />
    </div>
  );
}
