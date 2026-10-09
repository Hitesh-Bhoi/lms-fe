"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UsersIcon } from "@/common/icon";
import { loginAdmin } from "@/libs/Apis";
import { emailRegx } from "@/common/helper";

// administrator login page component
export const Login = () => {
  // router instance for navigation
  const router = useRouter();
  // administrator email address input
  const [email, setEmail] = useState<string>("");
  // administrator password input
  const [password, setPassword] = useState<string>("");
  // form error alert message
  const [error, setError] = useState<string>("");
  // login submission loading state
  const [loading, setLoading] = useState<boolean>(false);

  // handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    // validate required credentials and email format
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!emailRegx.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await loginAdmin({ email, password });
      router.push("/");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err?.message : "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200/80 p-8">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-linear-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 shrink-0">
            <UsersIcon className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome to LMS</h1>
          <p className="text-slate-500 mt-2 text-sm">Please sign in to your administrator account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200/80 text-rose-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all sm:text-sm text-slate-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all sm:text-sm text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-blue-500/25"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};
