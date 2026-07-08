export function ChatMockup() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-app-bg/90 p-4 shadow-2xl backdrop-blur">
      <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
        <div className="flex -space-x-2">
          <div className="h-7 w-7 rounded-full border-2 border-app-bg bg-tint-3" />
          <div className="h-7 w-7 rounded-full border-2 border-app-bg bg-tint-2" />
        </div>
        <div>
          <p className="text-sm font-medium text-app-text-primary">Org Chem Study Group</p>
          <p className="flex items-center gap-1 text-xs text-app-text-secondary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-online" />
            3 online
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="max-w-[75%] self-start rounded-2xl rounded-bl-sm bg-app-bubble-other px-3 py-2 text-sm text-app-text-primary">
          Did anyone finish the reaction mechanism problem set?
        </div>
        <div className="max-w-[75%] self-end rounded-2xl rounded-br-sm bg-app-bubble-self px-3 py-2 text-sm text-white">
          Yeah, I pinned my notes above ⬆️
          <div className="mt-1 text-right text-[10px] text-white/70">✓✓ Seen</div>
        </div>
        <div className="max-w-[75%] self-start rounded-2xl rounded-bl-sm bg-app-bubble-other px-3 py-2 text-sm text-app-text-primary">
          Perfect, looking now
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1 text-xs italic text-app-text-secondary">
        <span className="flex gap-0.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-secondary [animation-delay:-0.3s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-secondary [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-app-text-secondary" />
        </span>
        Aadhi is typing...
      </div>
    </div>
  );
}
