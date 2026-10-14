"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  AuthShell,
  AuthField,
  primaryButtonClass,
} from "@/components/auth-shell";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      router.replace("/home");
      router.refresh();
    } catch {
      setMessage("Unable to log in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to PhotoBook"
      subtitle={
        <>
          New to PhotoBook?{" "}
          <Link href="/signup" className="font-medium text-[#1d8bf8] hover:underline">
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-3">
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
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
        />

        <div className="flex justify-end px-1">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#1d8bf8] hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {message && (
          <p role="alert" className="px-1 text-sm text-red-500">
            {message}
          </p>
        )}

        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`${primaryButtonClass} w-full`}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </div>
      </form>
    </AuthShell>
  );
}