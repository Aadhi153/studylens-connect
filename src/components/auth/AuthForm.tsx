"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/groups");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-app-card p-8 shadow-xl"
      >
        <h1 className="mb-1 text-xl font-semibold text-app-text-primary">
          {mode === "login" ? "Log in" : "Create an account"}
        </h1>
        <p className="mb-6 text-sm text-app-text-secondary">
          {mode === "login"
            ? "Welcome back to StudyLens Connect."
            : "Start studying together in minutes."}
        </p>

        <label className="mb-1 block text-xs font-medium text-app-text-secondary">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-white/10 bg-app-bg px-3 py-2 text-sm text-app-text-primary outline-none focus:border-app-accent"
          placeholder="you@school.edu"
        />

        <label className="mb-1 block text-xs font-medium text-app-text-secondary">
          Password
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-white/10 bg-app-bg px-3 py-2 text-sm text-app-text-primary outline-none focus:border-app-accent"
          placeholder="••••••••"
        />

        {error && (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mb-4 w-full rounded-lg bg-app-accent px-4 py-2 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>

        <p className="text-center text-sm text-app-text-secondary">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-app-accent hover:underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-app-accent hover:underline">
                Log in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
