
"use client";

import { useState } from "react";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  return (
    <main className="min-h-screen bg-[#faf7ef] p-5 text-[#263b2d]">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 border-b border-[#d9c9a3] pb-5">
          <p className="text-sm font-semibold tracking-widest text-[#997344]">
            AYUKANTI
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Admin Panel
          </h1>

          <p className="mt-2 text-sm text-[#454d45]">
            Manage your store, products and sales.
          </p>
        </header>

        <section className="rounded-2xl border border-[#e4dccb] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">
            Admin Login
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Sign in with your store administrator account.
          </p>

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setMessage(
                "Login abhi connect nahi hai. Agle step mein Supabase Authentication connect karenge."
              );
            }}
          >
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
              className="w-full rounded-lg bg-[#263b2d] p-3 font-semibold text-white transition hover:bg-[#1d3023]"
            >
              Sign In
            </button>
          </form>

          {message && (
            <p
              role="status"
              className="mt-4 rounded-lg bg-[#f8f0dc] p-3 text-sm text-[#263b2d]"
            >
              {message}
            </p>
          )}
        </section>

        <footer className="mt-6 text-center text-xs text-gray-500">
          Ayukanti · Store Administration
        </footer>
      </div>
    </main>
  );
}
