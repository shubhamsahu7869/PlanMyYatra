"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiPost } from "../../lib/api";
import { saveToken } from "../../lib/auth";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await apiPost("/api/auth/register", { name, email, password });
      saveToken(response.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#061322] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16 sm:px-10">
        <div className="w-full rounded-3xl border border-teal-900/60 bg-[#0b1b2b]/80 p-10 shadow-2xl shadow-black/20">
          <h1 className="text-3xl font-semibold">Create your travel account</h1>
          <p className="mt-2 text-slate-400">Register to save trips, generate AI itineraries, and manage your mood-optimized plans.</p>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm">
              <span>Name</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-teal-800/70 bg-[#061322] px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
                required
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-teal-800/70 bg-[#061322] px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
                required
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-teal-800/70 bg-[#061322] px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
                required
                minLength={6}
              />
            </label>
            <label className="block space-y-2 text-sm">
              <span>Confirm Password</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-2xl border border-teal-800/70 bg-[#061322] px-4 py-3 text-slate-100 outline-none transition focus:border-teal-400"
                required
                minLength={6}
              />
            </label>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-teal-500 px-4 py-3 font-semibold text-[#061322] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <LoadingSpinner label="Creating account" /> : "Register"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account? <Link href="/login" className="text-teal-300 hover:text-orange-200">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

