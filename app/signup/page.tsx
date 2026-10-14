"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AuthShell,
  AuthField,
  primaryButtonClass,
} from "@/components/auth-shell";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function showMessage(text: string, error: boolean) {
    setMessage(text);
    setIsError(error);
  }

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    showMessage("", false);

    if (password.length < 8) {
      showMessage("Your password must be at least 8 characters.", true);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        },
      },
    });

    setLoading(false);

    if (error) {
      showMessage(error.message, true);
      return;
    }

    if (data.session) {
      router.replace("/home");
      router.refresh();
    } else {
      showMessage(
        "Account created! Check your email to confirm your account, then log in.",
        false
      );
    }
  }

  return (
    <AuthShell
      eyebrow="Start for free"
      title="Create new account"
      subtitle={
        <>
          Already a member?{" "}
          <Link href="/login" className="font-medium text-[#1d8bf8] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignup} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AuthField
            id="first-name"
            label="First name"
            autoComplete="given-name"
            placeholder="First name"
            value={firstName}
            onChange={setFirstName}
            icon={<User size={16} />}
          />
          <AuthField
            id="last-name"
            label="Last name"
            autoComplete="family-name"
            placeholder="Last name"
            value={lastName}
            onChange={setLastName}
            icon={<User size={16} />}
          />
        </div>

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

        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          placeholder="At least 8 characters"
          value={password}
          onChange={setPassword}
        />

        {message && (
          <p
            role={isError ? "alert" : "status"}
            className={`px-1 text-sm ${isError ? "text-red-500" : "text-[#1d8bf8]"}`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`${primaryButtonClass} w-full`}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}