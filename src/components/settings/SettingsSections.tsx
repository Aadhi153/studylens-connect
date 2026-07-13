"use client";

import { useState } from "react";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { AccountSection } from "@/components/settings/AccountSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { DangerZoneSection } from "@/components/settings/DangerZoneSection";
import { Toast, type ToastState } from "@/components/settings/Toast";

export type Theme = "dark" | "light" | "system";

export function SettingsSections({
  email,
  displayName,
  avatarUrl,
  isGoogleConnected,
}: {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  isGoogleConnected: boolean;
}) {
  const [toast, setToast] = useState<ToastState>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [messageSounds, setMessageSounds] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");
  const [language, setLanguage] = useState("en");

  function showToast(message: string, type: "success" | "error") {
    setToast({ message, type });
  }

  return (
    <div className="flex flex-col gap-6">
      <ProfileSection
        email={email}
        initialDisplayName={displayName}
        initialAvatarUrl={avatarUrl}
        onToast={showToast}
      />

      <AccountSection email={email} isGoogleConnected={isGoogleConnected} onToast={showToast} />

      <PreferencesSection
        emailNotifications={emailNotifications}
        onEmailNotificationsChange={setEmailNotifications}
        pushNotifications={pushNotifications}
        onPushNotificationsChange={setPushNotifications}
        messageSounds={messageSounds}
        onMessageSoundsChange={setMessageSounds}
        readReceipts={readReceipts}
        onReadReceiptsChange={setReadReceipts}
        theme={theme}
        onThemeChange={setTheme}
      />

      <AppearanceSection
        theme={theme}
        onThemeChange={setTheme}
        language={language}
        onLanguageChange={setLanguage}
      />

      <DangerZoneSection onToast={showToast} />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
