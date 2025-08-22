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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-100 via-teal-50 to-white">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 w-full max-w-md border border-cyan-100">
          <h1 className="text-2xl font-extrabold text-teal-700 mb-6 text-center drop-shadow">Register for Devil Mail</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/80"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/80"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/80"
            />
            <button type="submit" className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-cyan-500 transition-colors">Register</button>
          </form>
        <div className="py-4">
          Already have an account? <Link className="text-teal-600" href="/login">Login here</Link>
        </div>
        </div>
      </div>
  );
}
