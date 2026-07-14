"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, KeyRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { SaveButton, type SaveStatus } from "@/components/settings/SaveButton";
import { TwoFactorToggle } from "@/components/settings/TwoFactorToggle";
import { ActiveSessionsList } from "@/components/settings/ActiveSessionsList";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.7 10.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.2l-6.6-5.6C29.6 34.9 26.9 36 24 36c-5.3 0-9.6-3.3-11.3-8l-6.5 5C9.9 39.6 16.4 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.6C41.7 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

export function AccountSection({
  email,
  isGoogleConnected,
  onToast,
}: {
  email: string;
  isGoogleConnected: boolean;
  onToast: (message: string, type: "success" | "error") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const supabase = createClient();

  function resetForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFormError(null);
  }

  async function handleSavePassword() {
    setFormError(null);

    if (!currentPassword) {
      setFormError("Enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      setFormError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }

    setSaveStatus("saving");

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (verifyError) {
      setSaveStatus("idle");
      setFormError("Current password is incorrect");
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setSaveStatus("idle");
      setFormError(updateError.message);
      return;
    }

    setSaveStatus("success");
    onToast("Password updated", "success");
    resetForm();
    setTimeout(() => {
      setSaveStatus("idle");
      setExpanded(false);
    }, 1500);
  }

  async function handleGoogleToggle() {
    setConnecting(true);

    if (isGoogleConnected) {
      const { data, error } = await supabase.auth.getUserIdentities();
      const identity = data?.identities.find((i) => i.provider === "google");
      if (error || !identity) {
        setConnecting(false);
        onToast(error?.message ?? "Could not find Google identity", "error");
        return;
      }
      const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity);
      setConnecting(false);
      if (unlinkError) {
        onToast(unlinkError.message, "error");
        return;
      }
      onToast("Google account disconnected", "success");
      return;
    }

    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/settings` },
    });
    setConnecting(false);
    if (error) {
      onToast(error.message, "error");
    }
  }

  return (
    <section className="settings-card">
      <h2 className="settings-section-title mb-5">Account</h2>

      <div className="mb-4">
        <TwoFactorToggle onToast={onToast} />
      </div>

      <div className="mb-4">
        <motion.button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          whileTap={{ scale: 0.98 }}
          className="settings-btn-secondary flex w-full items-center justify-between"
        >
          <span className="flex items-center gap-2">
            <KeyRound size={15} />
            Change password
          </span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex"
          >
            <ChevronDown size={16} />
          </motion.span>
        </motion.button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="password-form"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-col gap-3">
                <div>
                  <label htmlFor="current-password" className="settings-label">
                    Current password
                  </label>
                  <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="settings-input"
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label htmlFor="new-password" className="settings-label">
                    New password
                  </label>
                  <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="settings-input"
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="settings-label">
                    Confirm password
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="settings-input"
                    autoComplete="new-password"
                  />
                </div>

                {formError && (
                  <p role="alert" className="text-sm text-red-400">
                    {formError}
                  </p>
                )}

                <SaveButton status={saveStatus} onClick={handleSavePassword} className="w-full">
                  Save
                </SaveButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="settings-connected-row">
        <div className="flex items-center gap-3">
          <GoogleIcon />
          <div>
            <p className="text-sm text-white">Google</p>
            <span
              className={`settings-status-pill ${isGoogleConnected ? "connected" : "disconnected"}`}
            >
              {isGoogleConnected ? "Connected" : "Not connected"}
            </span>
          </div>
        </div>
        <motion.button
          type="button"
          onClick={handleGoogleToggle}
          disabled={connecting}
          whileTap={connecting ? undefined : { scale: 0.98 }}
          className="settings-btn-secondary"
        >
          {connecting ? "..." : isGoogleConnected ? "Disconnect" : "Connect"}
        </motion.button>
      </div>

      <ActiveSessionsList onToast={onToast} />
    </section>
  );
}
