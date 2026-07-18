"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function JoinGroupForm() {
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/groups/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode }),
    });

    const body = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(body.error ?? "Could not join group.");
      return;
    }

    router.push(`/groups/${body.groupId}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl bg-app-card p-8 shadow-xl"
    >
      <h1 className="mb-1 text-xl font-semibold text-app-text-primary">
        Join a study group
      </h1>
      <p className="mb-6 text-sm text-app-text-secondary">
        Enter the invite code someone shared with you.
      </p>

      <label className="mb-1 block text-xs font-medium text-app-text-secondary">
        Invite code
      </label>
      <input
        type="text"
        required
        value={inviteCode}
        onChange={(e) => setInviteCode(e.target.value)}
        className="mb-6 w-full rounded-lg border border-app-border bg-app-bg px-3 py-2 text-sm uppercase text-app-text-primary outline-none focus:border-app-accent"
        placeholder="e.g. a1b2c3d4"
      />

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Joining..." : "Join group"}
      </button>
    </form>
  );
}
