"use client";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SettingsNav } from "@/components/settings/SettingsNav";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { AccountSection } from "@/components/settings/AccountSection";
import { PreferencesSection } from "@/components/settings/PreferencesSection";
import { AppearanceSection } from "@/components/settings/AppearanceSection";
import { DangerZone } from "@/components/settings/DangerZone";
import { Toast, type ToastState } from "@/components/settings/Toast";
import { SettingsFooter } from "@/components/settings/SettingsFooter";
import type { ProfileStats } from "@/lib/profileStats";

export type Theme = "dark" | "light" | "system";
export type SettingsSection = "profile" | "account" | "preferences" | "appearance" | "danger";

const SECTION_LABELS: Record<SettingsSection, string> = {
  profile: "Profile",
  account: "Account",
  preferences: "Preferences",
  appearance: "Appearance",
  danger: "Danger zone",
};

function isSettingsSection(value: string | null): value is SettingsSection {
  return value !== null && value in SECTION_LABELS;
}

export function SettingsSections({
  email,
  displayName,
  avatarUrl,
  bio,
  timezone,
  memberSince,
  stats,
  isGoogleConnected,
}: {
  email: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string;
  timezone: string;
  memberSince: string;
  stats: ProfileStats;
  isGoogleConnected: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSection = isSettingsSection(searchParams.get("section"))
    ? (searchParams.get("section") as SettingsSection)
    : "profile";

  const [activeSection, setActiveSection] = useState<SettingsSection>(initialSection);
  const [mobileShowContent, setMobileShowContent] = useState(searchParams.get("section") !== null);

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

  function selectSection(section: SettingsSection) {
    setActiveSection(section);
    setMobileShowContent(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set("section", section);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col md:flex-row">
      <div className={`${mobileShowContent ? "hidden md:flex" : "flex"} md:flex`}>
        <SettingsNav active={activeSection} onSelect={selectSection} />
      </div>

      <div
        className={`${
          mobileShowContent ? "flex" : "hidden md:flex"
        } min-h-0 flex-1 flex-col overflow-y-auto`}
      >
        <div className="flex items-center gap-2 border-b border-settings-border px-4 py-3 md:hidden">
          <button
            type="button"
            onClick={() => setMobileShowContent(false)}
            aria-label="Back to settings menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-settings-text-secondary hover:bg-white/5"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-medium text-settings-text-primary">
            {SECTION_LABELS[activeSection]}
          </span>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-4 py-6 md:px-10 md:py-10">
          <div className="m-auto w-full max-w-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {activeSection === "profile" && (
                  <ProfileSection
                    email={email}
                    initialDisplayName={displayName}
                    initialAvatarUrl={avatarUrl}
                    initialBio={bio}
                    initialTimezone={timezone}
                    memberSince={memberSince}
                    stats={stats}
                    onToast={showToast}
                  />
                )}

                {activeSection === "account" && (
                  <AccountSection
                    email={email}
                    isGoogleConnected={isGoogleConnected}
                    onToast={showToast}
                  />
                )}

                {activeSection === "preferences" && (
                  <PreferencesSection
                    emailNotifications={emailNotifications}
                    onEmailNotificationsChange={setEmailNotifications}
                    pushNotifications={pushNotifications}
                    onPushNotificationsChange={setPushNotifications}
                    messageSounds={messageSounds}
                    onMessageSoundsChange={setMessageSounds}
                    readReceipts={readReceipts}
                    onReadReceiptsChange={setReadReceipts}
                  />
                )}

                {activeSection === "appearance" && (
                  <AppearanceSection
                    theme={theme}
                    onThemeChange={setTheme}
                    language={language}
                    onLanguageChange={setLanguage}
                  />
                )}

                {activeSection === "danger" && <DangerZone onToast={showToast} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <SettingsFooter />
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
