"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Auth error:", authError);
        setError(authError.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Login succeeded but no session was created. Please try again.");
        setLoading(false);
        return;
      }

      // Force a full page reload to ensure cookies are set and the layout picks up the session
      window.location.href = "/admin";
    } catch (err: any) {
      console.error("Login exception:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-surface-50 dark:bg-surface-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl text-surface-900 dark:text-white">
            <span className="text-brand-600">Save</span>Pin
          </h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-surface-400">
            Sign in to the admin dashboard
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</p>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-surface-400 dark:text-surface-500">
          <a href="/" className="hover:text-surface-600 dark:hover:text-surface-300">
            ← Back to SavePin
          </a>
        </p>
      </div>
    </div>
  );
}
