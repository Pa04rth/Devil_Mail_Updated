// client/app/admin/add-email/page.tsx
"use client";

import { useState } from "react";
import api from "../../../lib/api";
import {
  UserPlus,
  User,
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import axios from "axios";

type EmailType = "single" | "bulk";

const AddUserForm = ({
  type,
  onUserAdded,
}: {
  type: EmailType;
  onUserAdded: (msg: string) => void;
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.post("/admin/create-user", {
        username,
        email,
        password,
        emailType: type,
      });

      onUserAdded(data.message);

      // Clear form on success
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || "An unexpected error occurred."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full px-4 py-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white focus:outline-none focus:border-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@luxidevilott.com"
          required
          className="w-full px-4 py-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white focus:outline-none focus:border-red-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 bg-neutral-900 border-2 border-neutral-700 rounded-lg text-white focus:outline-none focus:border-red-500"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-red-700 hover:bg-red-600 text-white font-semibold py-3 rounded-lg disabled:opacity-50"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          `Create ${type.charAt(0).toUpperCase() + type.slice(1)} User`
        )}
      </button>
      {error && (
        <p className="text-sm text-red-400 mt-2 text-center">{error}</p>
      )}
    </form>
  );
};

export default function AddEmailPage() {
  const [activeTab, setActiveTab] = useState<EmailType>("single");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleUserAdded = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 4000); // Hide message after 4 seconds
  };

  return (
    <div className="h-full bg-neutral-900 flex items-center justify-center p-8 overflow-y-auto">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <UserPlus className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white tracking-wider">
            Add New Email
          </h1>
          <p className="text-neutral-300 mt-2 font-medium">
            Register users with a specific email type.
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 p-3 flex items-center justify-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg text-green-200 text-center animate-fade-in">
            <CheckCircle className="w-5 h-5" /> {successMessage}
          </div>
        )}

        <div className="flex border-b border-neutral-800 mb-6">
          <button
            onClick={() => setActiveTab("single")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-lg font-semibold transition-colors ${
              activeTab === "single"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-neutral-400"
            }`}
          >
            <User /> Single
          </button>
          <button
            onClick={() => setActiveTab("bulk")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-lg font-semibold transition-colors ${
              activeTab === "bulk"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-neutral-400"
            }`}
          >
            <Users /> Bulk
          </button>
        </div>

        {activeTab === "single" ? (
          <AddUserForm type="single" onUserAdded={handleUserAdded} />
        ) : (
          <AddUserForm type="bulk" onUserAdded={handleUserAdded} />
        )}
      </div>
    </div>
  );
}
