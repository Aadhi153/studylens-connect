"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { SaveButton, type SaveStatus } from "@/components/settings/SaveButton";
import { BasicInfoGroup } from "@/components/settings/BasicInfoGroup";
import { ContactGroup } from "@/components/settings/ContactGroup";
import { AboutGroup } from "@/components/settings/AboutGroup";
import type { ProfileStats } from "@/lib/profileStats";

export function ProfileSection({
  email,
  initialDisplayName,
  initialAvatarUrl,
  initialBio,
  initialTimezone,
  memberSince,
  stats,
  onToast,
}: {
  email: string;
  initialDisplayName: string;
  initialAvatarUrl: string | null;
  initialBio: string;
  initialTimezone: string;
  memberSince: string;
  stats: ProfileStats;
  onToast: (message: string, type: "success" | "error") => void;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [bio, setBio] = useState(initialBio);
  const [timezone, setTimezone] = useState(
    initialTimezone ||
      (typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "UTC")
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const supabase = createClient();

  const initials = (displayName || email || "?").trim().slice(0, 2).toUpperCase();

  async function handleSave() {
    setSaveStatus("saving");
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName, bio, timezone },
    });

    if (error) {
      setSaveStatus("idle");
      onToast(error.message, "error");
      return;
    }

    setSaveStatus("success");
    onToast("Profile updated", "success");
    setTimeout(() => setSaveStatus("idle"), 1500);
  }

  return (
    <section className="settings-card">
      <h2 className="settings-section-title mb-5">Profile</h2>

      <div className="flex flex-col gap-5">
        <BasicInfoGroup
          displayName={displayName}
          onDisplayNameChange={setDisplayName}
          bio={bio}
          onBioChange={setBio}
          avatarPreview={avatarPreview}
          onAvatarChange={setAvatarPreview}
          initials={initials}
        />

        <ContactGroup email={email} timezone={timezone} onTimezoneChange={setTimezone} />

        <AboutGroup
          memberSince={memberSince}
          streak={stats.streak}
          totalNotes={stats.totalNotes}
          groupsJoined={stats.groupsJoined}
        />
      </div>

      <SaveButton status={saveStatus} onClick={handleSave} className="mt-6 w-full" />
    </section>
  );
}
