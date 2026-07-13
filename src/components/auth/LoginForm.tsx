"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resetSending, setResetSending] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const controls = useAnimationControls();

  const emailError =
    emailTouched && email.length > 0 && !EMAIL_RE.test(email) ? "Enter a valid email address" : null;
  const passwordError =
    passwordTouched && password.length > 0 && password.length < 6
      ? "Password must be at least 6 characters"
      : null;

  function triggerShake() {
    controls.start({ x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.4 } });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || success) return;

    setEmailTouched(true);
    setPasswordTouched(true);

    if (!EMAIL_RE.test(email) || password.length < 6) {
      triggerShake();
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message);
      triggerShake();
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/groups");
      router.refresh();
    }, 650);
  }

  async function handleForgotPassword() {
    if (!EMAIL_RE.test(email)) {
      setResetMessage("Enter your email above first, then click Forgot password.");
      return;
    }
    setResetSending(true);
    setResetMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    setResetSending(false);
    setResetMessage(
      error ? error.message : "If an account exists for that email, we've sent a reset link."
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={controls}
      className="auth-form-card relative z-10 w-full"
    >
      <h1 className="mb-2 text-2xl font-semibold text-white">Log in</h1>
      <p className="mb-8 text-sm text-white/60">Welcome back to StudyLens Connect.</p>

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
        <div className="form-label-row">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            disabled={resetSending}
            className="text-xs font-medium text-[#93c5fd] transition hover:underline disabled:opacity-60"
          >
            {resetSending ? "Sending..." : "Forgot password?"}
          </button>
        </div>
        <div className="input-group">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setPasswordTouched(true)}
            autoComplete="current-password"
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
      </div>

      {resetMessage && (
        <p role="status" className="mb-4 text-sm text-[#93c5fd]">
          {resetMessage}
        </p>
      )}

      {error && (
        <p role="alert" className="mb-4 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || success}
        className="auth-submit-btn mb-4 flex w-full items-center justify-center"
      >
        <AnimatePresence mode="wait" initial={false}>
          {success ? (
            <motion.span
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center"
            >
              <CheckCircle2 size={18} />
            </motion.span>
          ) : loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="spinner"
              aria-label="Loading"
            />
          ) : (
            <motion.span key="label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              Log in
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <p className="text-center text-sm text-white/60">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="auth-link">
          Sign up
        </Link>
      </p>
    </motion.form>
  );
}
