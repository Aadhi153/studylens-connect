"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export type ToastState = { message: string; type: "success" | "error" } | null;

export function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div role="status" className={`settings-toast ${toast.type === "error" ? "error" : ""}`}>
      {toast.type === "success" ? (
        <CheckCircle2 size={16} className="text-online" />
      ) : (
        <XCircle size={16} className="text-danger" />
      )}
      {toast.message}
    </div>
  );
}
