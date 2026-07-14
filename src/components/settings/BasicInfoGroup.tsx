"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Camera } from "lucide-react";

const BIO_MAX_LENGTH = 80;

export function BasicInfoGroup({
  displayName,
  onDisplayNameChange,
  bio,
  onBioChange,
  avatarPreview,
  onAvatarChange,
  initials,
}: {
  displayName: string;
  onDisplayNameChange: (value: string) => void;
  bio: string;
  onBioChange: (value: string) => void;
  avatarPreview: string | null;
  onAvatarChange: (dataUrl: string) => void;
  initials: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAvatarChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-4">
        <div className="settings-avatar">
          {avatarPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarPreview} alt="" />
          ) : (
            initials
          )}
          <motion.button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="settings-avatar-upload"
            aria-label="Upload profile photo"
          >
            <Camera size={13} />
          </motion.button>
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
          <p className="text-xs text-white/50">{bio || "No status set"}</p>
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
          onChange={(e) => onDisplayNameChange(e.target.value)}
          placeholder="Your name"
          className="settings-input"
        />
      </div>

      <div>
        <div className="settings-label-row">
          <label htmlFor="bio" className="settings-label">
            Bio
          </label>
          <span className="text-[11px] text-white/35">
            {bio.length}/{BIO_MAX_LENGTH}
          </span>
        </div>
        <input
          id="bio"
          type="text"
          value={bio}
          maxLength={BIO_MAX_LENGTH}
          onChange={(e) => onBioChange(e.target.value.slice(0, BIO_MAX_LENGTH))}
          placeholder="What are you studying?"
          className="settings-input"
        />
      </div>
    </div>
  );
}
