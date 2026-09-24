"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let idToken: string | undefined = undefined;

      // 1. Authenticate with Firebase Auth client side
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        idToken = await userCred.user.getIdToken();
      } catch {
        // Continue to server side authentication if Firebase Auth returns error
      }

      // 2. Authenticate session with backend API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, idToken }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Login failed. Invalid email or password.");
      }
    } catch {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center p-5 text-xs font-mono">
      <div className="w-full max-w-md bg-[#0F0F0F] border border-[#262626] p-8 md:p-10 space-y-8 shadow-2xl">
        <div className="space-y-2 border-b border-[#262626] pb-6 text-center">
          <div className="w-10 h-10 mx-auto bg-[#181818] border border-[#262626] flex items-center justify-center text-[var(--accent-color,#C8FF3D)] mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            ADMIN PORTAL
          </h1>
          <p className="text-[11px] text-[#9A9A9A] uppercase tracking-widest flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[var(--accent-color,#C8FF3D)] inline" />
            FIREBASE AUTHENTICATION
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/50 text-red-400 text-center uppercase">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase tracking-widest block">EMAIL ADDRESS</label>
            <input
              type="email"
              required
              placeholder="ENTER ADMIN EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#9A9A9A] uppercase tracking-widest block">PASSWORD</label>
            <input
              type="password"
              required
              placeholder="ENTER PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#060606] border border-[#262626] text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[var(--accent-color,#C8FF3D)] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[var(--accent-color,#C8FF3D)] text-[#0A0A0A] font-bold tracking-widest uppercase hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? "AUTHENTICATING..." : "SIGN IN TO DASHBOARD"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
