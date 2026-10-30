"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMessage("Login failed: " + error.message);
      return;
    }

    if (data.user) {
      setLoggedIn(true);
      setMessage("Login successful!");
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setEmail("");
    setPassword("");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#faf7ef] p-5 text-[#263b2d]">
      <div className="mx-auto max-w-xl">
        <header className="mb-8 border-b border-[#d9c9a3] pb-5">
          <p className="text-sm font-semibold tracking-widest text-[#997344]">
            AYUKANTI
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Admin Panel</h1>
          <p className="mt-2 text-sm">Store Management</p>
        </header>

        <section className="rounded-2xl border border-[#e4dccb] bg-white p-5 shadow-sm">
          {loggedIn ? (
            <>
              <h2 className="text-xl font-semibold">Welcome to Ayukanti</h2>
              <p className="mt-3 text-sm">
                Login successful. Admin dashboard features will be added next.
              </p>
              <button
                onClick={handleLogout}
                className="mt-5 w-full rounded-lg bg-[#263b2d] p-3 font-semibold text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold">Admin Login</h2>
              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-900"
                    placeholder="Admin email"
                    autoComplete="username"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-3 text-base text-gray-900"
                    placeholder="Admin password"
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#263b2d] p-3 font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </>
          )}

          {message && (
            <p className="mt-4 rounded-lg bg-[#f8f0dc] p-3 text-sm">
              {message}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
