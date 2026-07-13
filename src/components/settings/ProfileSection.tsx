"use client";

import { useRef, useState } from "react";
import { Camera, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ProfileSection({
  email,
  initialDisplayName,
  initialAvatarUrl,
  onToast,
}: {
  email: string;
  initialDisplayName: string;
  initialAvatarUrl: string | null;
  onToast: (message: string, type: "success" | "error") => void;
}) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const initials = (displayName || email || "?").trim().slice(0, 2).toUpperCase();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    setSaving(false);

    if (error) {
      onToast(error.message, "error");
      return;
    }
    onToast("Profile updated", "success");
  }

  return (
    <section className="settings-card">
      <h2 className="settings-section-title mb-5">Profile</h2>

      <div className="mb-6 flex items-center gap-4">
        <div className="settings-avatar">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="" />
          ) : (
            initials
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="settings-avatar-upload"
            aria-label="Upload profile photo"
          >
            <Camera size={13} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{displayName || "Add your name"}</p>
          <p className="text-xs text-white/50">{email}</p>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="display-name" className="settings-label">
          Display name
        </label>
        <input
          id="display-name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Your name"
          className="settings-input"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="email" className="settings-label">
          Email
        </label>
        <div className="settings-input-icon-wrap">
          <Lock size={14} className="settings-input-icon" />
          <input id="email" type="email" value={email} readOnly className="settings-input" />
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="settings-btn-primary w-full"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </section>
  );
}
