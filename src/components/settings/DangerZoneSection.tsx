"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DangerZoneSection({
  onToast,
}: {
  onToast: (message: string, type: "success" | "error") => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    setDeleting(true);

    const res = await fetch("/api/account/delete", { method: "POST" });

    if (!res.ok) {
      setDeleting(false);
      const body = await res.json().catch(() => ({}));
      onToast(body.error ?? "Could not delete account", "error");
      return;
    }

    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <section className="settings-danger-card">
        <h2 className="mb-1 text-sm font-semibold text-red-400">Danger zone</h2>
        <p className="mb-4 text-xs text-white/50">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="settings-btn-danger-outline"
        >
          Delete Account
        </button>
      </section>

      {confirmOpen && (
        <div className="settings-modal-backdrop" onClick={() => !deleting && setConfirmOpen(false)}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            className="settings-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <AlertTriangle size={20} />
              </div>
              <h3 id="delete-account-title" className="text-base font-semibold text-white">
                Delete your account?
              </h3>
            </div>
            <p className="mb-6 text-sm text-white/60">
              This will permanently delete your account, groups you own, and all messages. This
              action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                disabled={deleting}
                className="settings-btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="settings-btn-danger-solid flex-1"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
