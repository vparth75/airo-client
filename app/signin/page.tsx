"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const GoogleSignInButton = dynamic(
  () => import("../components/GoogleSignInButton"),
  { ssr: false }
);

export default function SignInPage() {
  const router = useRouter();
  const { loginWithCode, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSuccess = async (code: string) => {
    setIsLoading(true);
    setError(null);

    const result = await loginWithCode(code);

    if (result.success) {
      router.push("/");
    } else {
      setError(result.error ?? "Sign in failed");
    }

    setIsLoading(false);
  };

  const handleError = () => {
    setError("Google sign in failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-zinc-400">
              Sign in to your AIRO 2026 account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <div className="flex flex-col items-center gap-6">
            <GoogleSignInButton
              onSuccess={handleSuccess}
              onError={handleError}
              isLoading={isLoading}
              text="Sign in with Google"
              loadingText="Signing in..."
            />
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-zinc-400 text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-zinc-500 text-xs mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
