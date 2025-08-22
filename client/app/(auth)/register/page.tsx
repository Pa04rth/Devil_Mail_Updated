"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "../../../lib/api";


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", { username, email, password });
      alert("Registration successful! Please login.");
      router.push("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration Failed! The email might already be in use.");
    }
  };

    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-neutral-900 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-neutral-800">
          <h1 className="text-2xl font-extrabold text-white mb-6 text-center drop-shadow">Register for Devil Mail</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-neutral-800 text-white placeholder-neutral-400"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
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
            <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors">Register</button>
          </form>
        <div className="py-4 text-white">
          Already have an account? <Link className="text-red-600" href="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}
