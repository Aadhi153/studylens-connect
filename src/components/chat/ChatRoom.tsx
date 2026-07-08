"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageBubble, type ChatMessage } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { PresenceAvatar } from "@/components/chat/PresenceAvatar";
import { MessageInput } from "@/components/chat/MessageInput";
import { PinnedNoteBanner } from "@/components/chat/PinnedNoteBanner";

type MemberProfile = { id: string; displayName: string };

const TYPING_TIMEOUT_MS = 2500;

export function ChatRoom({
  groupId,
  groupName,
  inviteCode,
  currentUser,
  initialMessages,
  memberProfiles,
  pinnedNoteId,
}: {
  groupId: string;
  groupName: string;
  inviteCode: string;
  currentUser: MemberProfile;
  initialMessages: ChatMessage[];
  memberProfiles: MemberProfile[];
  pinnedNoteId: string | null;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [typingIds, setTypingIds] = useState<Set<string>>(new Set());
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const markedReadRef = useRef<Set<string>>(new Set());
  const typingBroadcastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remoteTypingTimeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const presenceChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const profileById = useMemo(() => {
    const map = new Map<string, string>();
    memberProfiles.forEach((p) => map.set(p.id, p.displayName));
    map.set(currentUser.id, currentUser.displayName);
    return map;
  }, [memberProfiles, currentUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // New messages + read receipts
  useEffect(() => {
    const channel = supabase
      .channel(`group:${groupId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `group_id=eq.${groupId}` },
        (payload) => {
          const row = payload.new as {
            id: string;
            sender_id: string;
            content: string | null;
            image_url: string | null;
            created_at: string;
          };
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev;
            return [
              ...prev,
              {
                id: row.id,
                senderId: row.sender_id,
                senderName: profileById.get(row.sender_id) ?? "Member",
                content: row.content,
                imageUrl: row.image_url,
                createdAt: row.created_at,
                readByOthers: false,
              },
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_reads" },
        (payload) => {
          const row = payload.new as { message_id: string; user_id: string };
          if (row.user_id === currentUser.id) return;
          setMessages((prev) =>
            prev.map((m) => (m.id === row.message_id ? { ...m, readByOthers: true } : m))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, groupId, currentUser.id, profileById]);

  // Presence + typing
  useEffect(() => {
    const presenceChannel = supabase.channel(`presence:${groupId}`, {
      config: { presence: { key: currentUser.id } },
    });

    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        setOnlineIds(new Set(Object.keys(state)));
      })
      .on("broadcast", { event: "typing" }, (payload) => {
        const { userId, isTyping } = payload.payload as { userId: string; isTyping: boolean };
        if (userId === currentUser.id) return;

        setTypingIds((prev) => {
          const next = new Set(prev);
          if (isTyping) next.add(userId);
          else next.delete(userId);
          return next;
        });

        const timeouts = remoteTypingTimeouts.current;
        const existing = timeouts.get(userId);
        if (existing) clearTimeout(existing);
        if (isTyping) {
          timeouts.set(
            userId,
            setTimeout(() => {
              setTypingIds((prev) => {
                const next = new Set(prev);
                next.delete(userId);
                return next;
              });
            }, TYPING_TIMEOUT_MS)
          );
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({ online_at: new Date().toISOString() });
        }
      });

    presenceChannelRef.current = presenceChannel;

    return () => {
      supabase.removeChannel(presenceChannel);
      remoteTypingTimeouts.current.forEach((t) => clearTimeout(t));
      remoteTypingTimeouts.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, groupId, currentUser.id]);

  // Mark unread messages from others as read
  useEffect(() => {
    const toMark = messages.filter(
      (m) => m.senderId !== currentUser.id && !markedReadRef.current.has(m.id)
    );
    if (toMark.length === 0) return;

    toMark.forEach((m) => markedReadRef.current.add(m.id));

    supabase
      .from("message_reads")
      .upsert(
        toMark.map((m) => ({ message_id: m.id, user_id: currentUser.id })),
        { onConflict: "message_id,user_id", ignoreDuplicates: true }
      )
      .then(({ error }) => {
        if (error) toMark.forEach((m) => markedReadRef.current.delete(m.id));
      });
  }, [messages, currentUser.id, supabase]);

  // Resolve signed URLs for private image attachments
  useEffect(() => {
    const paths = messages
      .map((m) => m.imageUrl)
      .filter((path): path is string => !!path && !signedUrls[path]);

    if (paths.length === 0) return;

    (async () => {
      for (const path of paths) {
        const { data } = await supabase.storage
          .from("chat-images")
          .createSignedUrl(path, 3600);
        if (data?.signedUrl) {
          setSignedUrls((prev) => ({ ...prev, [path]: data.signedUrl }));
        }
      }
    })();
  }, [messages, signedUrls, supabase]);

  const broadcastTyping = useCallback(
    (isTyping: boolean) => {
      presenceChannelRef.current?.send({
        type: "broadcast",
        event: "typing",
        payload: { userId: currentUser.id, isTyping },
      });
    },
    [currentUser.id]
  );

  const handleTyping = useCallback(() => {
    broadcastTyping(true);
    if (typingBroadcastTimeout.current) clearTimeout(typingBroadcastTimeout.current);
    typingBroadcastTimeout.current = setTimeout(() => broadcastTyping(false), TYPING_TIMEOUT_MS);
  }, [broadcastTyping]);

  const handleSend = useCallback(
    async (content: string, image?: File) => {
      let imagePath: string | null = null;

      if (image) {
        setUploading(true);
        const path = `${groupId}/${crypto.randomUUID()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(path, image);
        setUploading(false);
        if (uploadError) {
          console.error(uploadError);
          return;
        }
        imagePath = path;
      }

      broadcastTyping(false);
      if (typingBroadcastTimeout.current) clearTimeout(typingBroadcastTimeout.current);

      const { data, error } = await supabase
        .from("messages")
        .insert({
          group_id: groupId,
          sender_id: currentUser.id,
          content: content || null,
          image_url: imagePath,
        })
        .select("id, created_at")
        .single();

      if (error || !data) {
        console.error(error);
        return;
      }

      setMessages((prev) => {
        if (prev.some((m) => m.id === data.id)) return prev;
        return [
          ...prev,
          {
            id: data.id,
            senderId: currentUser.id,
            senderName: currentUser.displayName,
            content: content || null,
            imageUrl: imagePath,
            createdAt: data.created_at,
            readByOthers: false,
          },
        ];
      });
    },
    [supabase, groupId, currentUser, broadcastTyping]
  );

  const typingNames = Array.from(typingIds).map((id) => profileById.get(id) ?? "Someone");

  return (
    <div className="flex h-[calc(100vh-65px)] flex-col">
      <div className="flex items-center gap-3 border-b border-white/10 bg-app-card px-4 py-3">
        <div>
          <p className="text-sm font-medium text-app-text-primary">{groupName}</p>
          <p className="text-xs text-app-text-secondary">Invite code: {inviteCode}</p>
        </div>
        <div className="ml-auto flex -space-x-2">
          {memberProfiles.map((p, i) => (
            <PresenceAvatar key={p.id} name={p.displayName} index={i} online={onlineIds.has(p.id)} />
          ))}
        </div>
      </div>

      {pinnedNoteId && <PinnedNoteBanner noteId={pinnedNoteId} />}

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m.imageUrl ? { ...m, imageUrl: signedUrls[m.imageUrl] ?? null } : m}
            isSelf={m.senderId === currentUser.id}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <TypingIndicator names={typingNames} />
      <MessageInput onSend={handleSend} onTyping={handleTyping} uploading={uploading} />
    </div>
  );
}
