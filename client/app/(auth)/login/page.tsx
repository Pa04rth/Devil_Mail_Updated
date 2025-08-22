"use client";
import { useState } from "react";
import Link from "next/link";

import { useAuth } from "../../../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (error) {
      alert("Login Failed! Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-neutral-800">
        <h1 className="text-2xl font-extrabold text-white mb-6 text-center drop-shadow">
          Login to Devil Mail
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (e.g., test@luxidevilott.com)"
            required
            className="w-full px-4 py-2 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-neutral-800 text-white placeholder-neutral-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-neutral-800 text-white placeholder-neutral-400"
          />
          <button
            type="submit"
            className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="py-4 text-white">
          Don't have an account? <Link className="text-red-600" href="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
