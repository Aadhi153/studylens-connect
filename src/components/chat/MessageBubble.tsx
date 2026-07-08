export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string | null;
  imageUrl: string | null;
  createdAt: string;
  readByOthers: boolean;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function MessageBubble({
  message,
  isSelf,
}: {
  message: ChatMessage;
  isSelf: boolean;
}) {
  return (
    <div className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
      {!isSelf && (
        <span className="mb-1 px-1 text-xs text-app-text-secondary">
          {message.senderName}
        </span>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
          isSelf
            ? "rounded-br-sm bg-app-bubble-self text-white"
            : "rounded-bl-sm bg-app-bubble-other text-app-text-primary"
        }`}
      >
        {message.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={message.imageUrl}
            alt="Shared attachment"
            className="mb-1 max-h-64 rounded-lg object-cover"
          />
        )}
        {message.content && <p className="whitespace-pre-wrap">{message.content}</p>}
        <div
          className={`mt-1 flex items-center gap-1 text-[10px] ${
            isSelf ? "justify-end text-white/70" : "text-app-text-secondary"
          }`}
        >
          {formatTime(message.createdAt)}
          {isSelf && <span>{message.readByOthers ? "✓✓ Seen" : "✓ Sent"}</span>}
        </div>
      </div>
    </div>
  );
}
