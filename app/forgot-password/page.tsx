"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AuthShell,
  AuthField,
  primaryButtonClass,
} from "@/components/auth-shell";

/** Must match "Email OTP Length" in Supabase → Authentication settings (default: 6). */
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

type Step = "email" | "code" | "password";

/* -------------------------------------------------------------------------- */
/*  OTP input – one real input (paste + autofill work) drawn as separate boxes */
/* -------------------------------------------------------------------------- */

function OtpInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative" onClick={() => inputRef.current?.focus()}>
      <input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) =>
          onChange(e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH))
        }
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={OTP_LENGTH}
        aria-label={`${OTP_LENGTH}-digit verification code`}
        className="absolute inset-0 z-10 h-full w-full cursor-text text-base opacity-0"
      />

      <div className="flex gap-2 sm:gap-3">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => {
          const active =
            focused &&
            (i === value.length ||
              (value.length === OTP_LENGTH && i === OTP_LENGTH - 1));

          return (
            <div
              key={i}
              className={`flex h-14 min-w-0 flex-1 items-center justify-center rounded-2xl border text-xl font-semibold text-slate-900 transition dark:text-white ${
                active
                  ? "border-[#1d8bf8] bg-white shadow-[0_0_0_4px_rgba(29,139,248,0.12)] dark:bg-[#0c121e]"
                  : "border-transparent bg-[#f3f6fb] dark:bg-white/5"
              }`}
            >
              {value[i] ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function ForgotPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Countdown for the "Resend code" link
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function showMessage(text: string, error = false) {
    setMessage(text);
    setIsError(error);
  }

  /* Step 1 – send the code ------------------------------------------------- */
  async function sendCode(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    showMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

    setLoading(false);

    if (error) {
      showMessage(error.message, true);
      return;
    }

    setCode("");
    setCooldown(RESEND_SECONDS);
    setStep("code");
  }

  async function resendCode() {
    if (cooldown > 0 || loading) return;
    showMessage("");
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim());

    setLoading(false);

    if (error) {
      showMessage(error.message, true);
      return;
    }

    setCooldown(RESEND_SECONDS);
    showMessage("A new code is on its way.");
  }

  /* Step 2 – check the code ------------------------------------------------ */
  async function verifyCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage("");

    if (code.length !== OTP_LENGTH) {
      showMessage(`Enter the ${OTP_LENGTH}-digit code from your email.`, true);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code,
      type: "recovery",
    });

    setLoading(false);

    if (error) {
      showMessage("That code is invalid or has expired. Please try again.", true);
      return;
    }

    setStep("password");
  }

  /* Step 3 – save the new password ----------------------------------------- */
  async function savePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage("");

    if (password.length < 8) {
      showMessage("Your password must be at least 8 characters.", true);
      return;
    }

    if (password !== confirm) {
      showMessage("Passwords do not match.", true);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      showMessage(error.message, true);
      return;
    }

    // verifyOtp already signed the user in, so send them straight to home.
    router.replace("/home");
    router.refresh();
  }

  /* Messages --------------------------------------------------------------- */
  const feedback = message && (
    <p
      role={isError ? "alert" : "status"}
      className={`px-1 text-sm ${isError ? "text-red-500" : "text-[#1d8bf8]"}`}
    >
      {message}
    </p>
  );

  const linkButton =
    "text-sm font-medium text-[#1d8bf8] hover:underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline";

  /* Step 1 – email --------------------------------------------------------- */
  if (step === "email") {
    return (
      <AuthShell
        title="Forgot password"
        subtitle={
          <>
            Remembered it?{" "}
            <Link href="/login" className="font-medium text-[#1d8bf8] hover:underline">
              Log in
            </Link>
          </>
        }
      >
        <form onSubmit={sendCode} className="space-y-3">
          <p className="px-1 pb-1 text-sm text-slate-400">
            Enter your email and we&apos;ll send you a {OTP_LENGTH}-digit code.
          </p>

          <AuthField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            icon={<Mail size={16} />}
          />

          {feedback}

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className={`${primaryButtonClass} w-full`}
            >
              {loading ? "Sending code..." : "Send code"}
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  /* Step 2 – code ---------------------------------------------------------- */
  if (step === "code") {
    return (
      <AuthShell
        title="Enter your code"
        subtitle={
          <>
            We sent a {OTP_LENGTH}-digit code to{" "}
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {email}
            </span>
          </>
        }
      >
        <form onSubmit={verifyCode} className="space-y-4">
          <OtpInput value={code} onChange={setCode} />

          {feedback}

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading || code.length !== OTP_LENGTH}
              className={`${primaryButtonClass} w-full`}
            >
              {loading ? "Checking..." : "Verify code"}
            </button>
          </div>

          <div className="flex items-center justify-between px-1">
            <button
              type="button"
              onClick={resendCode}
              disabled={cooldown > 0 || loading}
              className={linkButton}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>

            <button
              type="button"
              onClick={() => {
                showMessage("");
                setStep("email");
              }}
              className={linkButton}
            >
              Use a different email
            </button>
          </div>
        </form>
      </AuthShell>
    );
  }

  /* Step 3 – new password -------------------------------------------------- */
  return (
    <AuthShell
      title="New password"
      subtitle="Choose a password you haven't used before."
    >
      <form onSubmit={savePassword} className="space-y-3">
        <AuthField
          id="new-password"
          label="New password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={setPassword}
        />

        <AuthField
          id="confirm-password"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="Type it again"
          value={confirm}
          onChange={setConfirm}
        />

        {feedback}

        <div className="pt-3">
          <button
            type="submit"
            disabled={loading}
            className={`${primaryButtonClass} w-full`}
          >
            {loading ? "Saving..." : "Save password"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}