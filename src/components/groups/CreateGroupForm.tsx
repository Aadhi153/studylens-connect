"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function CreateGroupForm() {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { data: group, error: insertError } = await supabase
      .from("groups")
      .insert({ name, created_by: user.id })
      .select("id")
      .single();

    if (insertError || !group) {
      setError(insertError?.message ?? "Could not create group.");
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase
      .from("group_members")
      .insert({ group_id: group.id, user_id: user.id });

    setLoading(false);

    if (memberError) {
      setError(memberError.message);
      return;
    }

    router.push(`/groups/${group.id}`);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl bg-app-card p-8 shadow-xl"
    >
      <h1 className="mb-1 text-xl font-semibold text-app-text-primary">
        Create a study group
      </h1>
      <p className="mb-6 text-sm text-app-text-secondary">
        Give your group a name — you can invite others once it&apos;s created.
      </p>

      <label className="mb-1 block text-xs font-medium text-app-text-secondary">
        Group name
      </label>
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-6 w-full rounded-lg border border-white/10 bg-app-bg px-3 py-2 text-sm text-app-text-primary outline-none focus:border-app-accent"
        placeholder="Org Chem Study Group"
      />

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create group"}
      </button>
    </form>
  );
}
