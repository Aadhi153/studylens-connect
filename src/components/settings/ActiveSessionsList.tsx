"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Laptop, Smartphone, Monitor } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SessionIcon = "laptop" | "phone" | "desktop";

type Session = {
  id: string;
  device: string;
  icon: SessionIcon;
  location: string;
  lastActive: string;
  isCurrent?: boolean;
};

const ICONS: Record<SessionIcon, typeof Laptop> = {
  laptop: Laptop,
  phone: Smartphone,
  desktop: Monitor,
};

const INITIAL_SESSIONS: Session[] = [
  {
    id: "current",
    device: "Chrome on Windows",
    icon: "laptop",
    location: "Bengaluru, IN",
    lastActive: "Active now",
    isCurrent: true,
  },
  {
    id: "s2",
    device: "Safari on iPhone",
    icon: "phone",
    location: "Bengaluru, IN",
    lastActive: "2 hours ago",
  },
  {
    id: "s3",
    device: "Chrome on macOS",
    icon: "desktop",
    location: "Mumbai, IN",
    lastActive: "3 days ago",
  },
];

export function ActiveSessionsList({
  onToast,
}: {
  onToast: (message: string, type: "success" | "error") => void;
}) {
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout(session: Session) {
    if (session.isCurrent) {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
      return;
    }
    setSessions((prev) => prev.filter((s) => s.id !== session.id));
    onToast("Session logged out", "success");
  }

  return (
    <div className="mt-6">
      <p className="settings-label">Active sessions</p>
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {sessions.map((session) => {
            const Icon = ICONS[session.icon];
            return (
              <motion.div
                key={session.id}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="settings-connected-row"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white/50">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="flex flex-wrap items-center gap-2 text-sm text-white">
                      {session.device}
                      {session.isCurrent && (
                        <span className="settings-status-pill connected">This device</span>
                      )}
                    </p>
                    <p className="text-xs text-white/50">
                      {session.location} · {session.lastActive}
                    </p>
                  </div>
                </div>
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLogout(session)}
                  className="settings-btn-secondary shrink-0"
                >
                  Log out
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
