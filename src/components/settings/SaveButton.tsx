"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export type SaveStatus = "idle" | "saving" | "success";

export function SaveButton({
  status,
  onClick,
  children = "Save Changes",
  className = "",
}: {
  status: SaveStatus;
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={status !== "idle"}
      whileTap={status === "idle" ? { scale: 0.98 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`settings-btn-primary flex items-center justify-center gap-2 ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === "saving" ? (
          <motion.span
            key="saving"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="flex items-center gap-2"
          >
            <Loader2 size={15} className="animate-spin" />
            Saving...
          </motion.span>
        ) : status === "success" ? (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-2"
          >
            <Check size={15} />
            Saved
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
