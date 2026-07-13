"use client";

import { Bell, Mail, MessageSquare, Eye } from "lucide-react";
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
      </div>
    </section>
  );
}
