"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import api from "../../../lib/api";
import "../auth.css";

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
    <div className="auth-container">
      <h1>Register for Devil Mail</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (e.g., yourname@luxidevilott.com)"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link href="/login">Login here</Link>
      </p>
    </div>
  );
}
