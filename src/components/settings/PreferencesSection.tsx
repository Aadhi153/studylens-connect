"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Mail, MessageSquare, Eye, MoonStar, Info } from "lucide-react";
import { Toggle } from "@/components/settings/Toggle";

export function PreferencesSection({
  emailNotifications,
  onEmailNotificationsChange,
  pushNotifications,
  onPushNotificationsChange,
  messageSounds,
  onMessageSoundsChange,
  readReceipts,
  onReadReceiptsChange,
}: {
  emailNotifications: boolean;
  onEmailNotificationsChange: (value: boolean) => void;
  pushNotifications: boolean;
  onPushNotificationsChange: (value: boolean) => void;
  messageSounds: boolean;
  onMessageSoundsChange: (value: boolean) => void;
  readReceipts: boolean;
  onReadReceiptsChange: (value: boolean) => void;
}) {
  const [quietHours, setQuietHours] = useState(false);
  const [quietStart, setQuietStart] = useState("22:00");
  const [quietEnd, setQuietEnd] = useState("07:00");

  return (
    <section className="settings-card">
      <h2 className="settings-section-title mb-2">Preferences</h2>

      <div>
        <Toggle
          icon={<Mail size={16} />}
          label="Email notifications"
          description="Get notified about new messages"
          checked={emailNotifications}
          onChange={onEmailNotificationsChange}
        />
        <Toggle
          icon={<Bell size={16} />}
          label="Push notifications"
          description="Get alerted on this device"
          checked={pushNotifications}
          onChange={onPushNotificationsChange}
        />
        <Toggle
          icon={<MessageSquare size={16} />}
          label="Message sounds"
          description="Play a sound for new messages"
          checked={messageSounds}
          onChange={onMessageSoundsChange}
        />
        <Toggle
          icon={<Eye size={16} />}
          label="Read receipts"
          description="Let others see when you've read their messages"
          checked={readReceipts}
          onChange={onReadReceiptsChange}
        />
        <Toggle
          icon={<MoonStar size={16} />}
          label="Quiet hours"
          description="Pause notifications during a set time range"
          checked={quietHours}
          onChange={setQuietHours}
        />

        <AnimatePresence initial={false}>
          {quietHours && (
            <motion.div
              key="quiet-hours-range"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 pb-3 pl-[30px] pt-1">
                <input
                  type="time"
                  aria-label="Quiet hours start"
                  value={quietStart}
                  onChange={(e) => setQuietStart(e.target.value)}
                  className="settings-input"
                />
                <span className="text-sm text-white/40">to</span>
                <input
                  type="time"
                  aria-label="Quiet hours end"
                  value={quietEnd}
                  onChange={(e) => setQuietEnd(e.target.value)}
                  className="settings-input"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-start gap-2 border-t border-white/[0.08] pt-4 text-xs text-white/40">
        <Info size={14} className="mt-0.5 shrink-0" />
        <p>Manage per-group notifications from each group&apos;s settings.</p>
      </div>
    </section>
  );
}
