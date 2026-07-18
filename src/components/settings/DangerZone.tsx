"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function DangerZone({
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
        <h2 className="mb-1 text-sm font-semibold text-danger">Danger zone</h2>
        <p className="mb-4 text-xs text-settings-text-secondary">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        <motion.button
          type="button"
          onClick={() => setConfirmOpen(true)}
          whileTap={{ scale: 0.98 }}
          className="settings-btn-danger-outline"
        >
          Delete Account
        </motion.button>
      </section>

      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="settings-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={() => !deleting && setConfirmOpen(false)}
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="delete-account-title"
              className="settings-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/15 text-danger">
                  <AlertTriangle size={20} />
                </div>
                <h3 id="delete-account-title" className="text-base font-semibold text-settings-text-primary">
                  Delete your account?
                </h3>
              </div>
              <p className="mb-6 text-sm text-settings-text-secondary">
                This will permanently delete your account, groups you own, and all messages. This
                action cannot be undone.
              </p>
              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  disabled={deleting}
                  whileTap={deleting ? undefined : { scale: 0.98 }}
                  className="settings-btn-secondary flex-1"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  whileTap={deleting ? undefined : { scale: 0.98 }}
                  className="settings-btn-danger-solid flex-1"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
