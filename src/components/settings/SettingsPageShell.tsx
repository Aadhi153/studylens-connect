"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export function SettingsPageShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  return (
    <motion.div
      className="settings-page-bg flex h-screen flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: isExiting ? 0 : 1, x: isExiting ? 20 : 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onAnimationComplete={() => {
        if (isExiting) router.push("/groups");
      }}
    >
      <div className="flex shrink-0 items-center gap-3 border-b border-app-border bg-app-card px-4 py-3">
        <button
          type="button"
          onClick={() => setIsExiting(true)}
          className="back-link flex items-center gap-1.5"
        >
          <ArrowLeft size={15} />
          Back to groups
        </button>
      </div>

      {children}
    </motion.div>
  );
}
