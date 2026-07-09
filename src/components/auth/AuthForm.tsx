"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STRENGTH_LEVELS = [
  { width: "25%", color: "#EF4444", label: "Weak" },
  { width: "25%", color: "#EF4444", label: "Weak" },
  { width: "50%", color: "#F59E0B", label: "Fair" },
  { width: "75%", color: "#6BAED6", label: "Good" },
  { width: "100%", color: "#22C55E", label: "Strong" },
];

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return STRENGTH_LEVELS[score];
}

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const emailError =
    emailTouched && email.length > 0 && !EMAIL_RE.test(email)
      ? "Enter a valid email address"
      : null;
  const passwordError =
    passwordTouched && password.length > 0 && password.length < 6
      ? "Password must be at least 6 characters"
      : null;
  const strength = mode === "signup" && password.length > 0 ? getPasswordStrength(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setEmailTouched(true);
    setPasswordTouched(true);

    if (!EMAIL_RE.test(email) || password.length < 6) return;

    setLoading(true);
    setError(null);
    setInfo(null);

    const { data, error } =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (mode === "signup" && !data.session) {
      setInfo("Check your inbox to confirm your email before logging in.");
      return;
    }

    router.push("/groups");
    router.refresh();
  }

  return (
    <div className="auth-page-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6">
      <div className="bg-glow" aria-hidden="true" />

      <Link href="/" className="back-link absolute left-6 top-6 z-10">
        ← Back to home
      </Link>

      <form onSubmit={handleSubmit} className="auth-card relative z-10 w-full">
        <h1 className="mb-1 text-xl font-semibold text-white">
          {mode === "login" ? "Log in" : "Create an account"}
        </h1>
        <p className="mb-6 text-sm text-white/60">
          {mode === "login"
            ? "Welcome back to StudyLens Connect."
            : "Start studying together in minutes."}
        </p>

        <div className="input-group mb-4">
          <input
            id="email"
            type="email"
            required
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
            className={`auth-input w-full ${emailError ? "error" : ""}`}
          />
          <label htmlFor="email" className="floating-label">
            Email
          </label>
          {emailError && (
            <p id="email-error" className="error-text">
              {emailError}
            </p>
          )}
        </div>

        <div className="input-group mb-1">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
            className={`auth-input has-toggle w-full ${passwordError ? "error" : ""}`}
          />
          <label htmlFor="password" className="floating-label">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {passwordError && (
            <p id="password-error" className="error-text">
              {passwordError}
            </p>
          )}
        </div>

        {strength && (
          <div className="mb-6">
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{ width: strength.width, backgroundColor: strength.color }}
              />
            </div>
            <p className="mt-1 text-xs" style={{ color: strength.color }}>
              {strength.label}
            </p>
          </div>
        )}
        {!strength && <div className="mb-6" />}

        {error && (
          <p role="alert" className="mb-4 text-sm text-red-400">
            {error}
          </p>
        )}
        {info && (
          <p role="status" className="mb-4 text-sm text-[#6baed6]">
            {info}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-submit-btn mb-4 flex w-full items-center justify-center"
        >
          {loading ? (
            <span className="spinner" aria-label="Loading" />
          ) : mode === "login" ? (
            "Log in"
          ) : (
            "Sign up"
          )}
        </button>

        <p className="text-center text-sm text-white/60">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="auth-link">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="auth-link">
                Log in
              </Link>
            </>
          )}
        </p>
      </form>
    </div>
  );
}
