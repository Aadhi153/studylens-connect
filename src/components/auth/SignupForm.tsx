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

export function SignupForm() {
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
  const strength = password.length > 0 ? getPasswordStrength(password) : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setEmailTouched(true);
    setPasswordTouched(true);

    if (!EMAIL_RE.test(email) || password.length < 6) return;

    setLoading(true);
    setError(null);
    setInfo(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    if (!data.session) {
      setInfo("Check your inbox to confirm your email before logging in.");
      return;
    }

    router.push("/groups");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form-card relative z-10 w-full">
      <h1 className="mb-2 text-2xl font-semibold text-app-text-primary">Create an account</h1>
      <p className="mb-8 text-sm text-app-text-secondary">Start studying together in minutes.</p>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
          autoComplete="email"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
          className={`auth-input w-full ${emailError ? "error" : ""}`}
        />
        {emailError && (
          <p id="email-error" className="error-text">
            {emailError}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="input-group">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            autoComplete="new-password"
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? "password-error" : undefined}
            className={`auth-input has-toggle w-full ${passwordError ? "error" : ""}`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="password-toggle"
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {passwordError && (
          <p id="password-error" className="error-text">
            {passwordError}
          </p>
        )}
        {strength && (
          <div className="mt-2">
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
      </div>

      {error && (
        <p role="alert" className="mb-4 text-sm text-danger">
          {error}
        </p>
      )}
      {info && (
        <p role="status" className="mb-4 text-sm text-accent-light">
          {info}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="auth-submit-btn mb-4 flex w-full items-center justify-center"
      >
        {loading ? <span className="spinner" aria-label="Loading" /> : "Sign up"}
      </button>

      <p className="text-center text-sm text-app-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="auth-link">
          Log in
        </Link>
      </p>
    </form>
  );
}
