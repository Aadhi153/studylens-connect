"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SettingsSections({ email }: { email: string }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(true);
  const supabase = createClient();

  async function handlePasswordReset() {
    setSending(true);
    setError(null);
    setSent(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setSending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="auth-card w-full" style={{ maxWidth: "none" }}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/50">
          Account
        </h2>

        <label className="mb-1 block text-xs font-medium text-white/50">Email</label>
        <p className="mb-5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70">
          {email}
        </p>

        <button
          type="button"
          onClick={handlePasswordReset}
          disabled={sending}
          className="groups-btn-secondary w-full disabled:opacity-60"
        >
          {sending ? "Sending..." : "Change password"}
        </button>

        {sent && (
          <p className="mt-3 text-sm text-[#6baed6]">
            Check your inbox for a password reset link.
          </p>
        )}
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      </section>

      <section className="auth-card w-full" style={{ maxWidth: "none" }}>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/50">
          Preferences
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white">Email notifications</p>
            <p className="text-xs text-white/50">Get notified about new messages</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={notifications}
            onClick={() => setNotifications((v) => !v)}
            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
              notifications ? "bg-[#2171b5]" : "bg-white/15"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                notifications ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </section>
    </div>
  );
}
