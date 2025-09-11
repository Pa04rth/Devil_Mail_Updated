// client/app/(auth)/login/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { AlertTriangle } from "lucide-react";

type EmailType = "single" | "bulk";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailType, setEmailType] = useState<EmailType>("single");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login({ email, password, emailType });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Login Failed! Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="bg-neutral-900 rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-neutral-800">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Login to Devil Mail
        </h1>

        {/* Email Type Slider */}
        <div className="relative flex p-1 bg-neutral-800 rounded-full mb-6">
          <span
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-red-600 rounded-full transition-transform duration-300 ease-in-out ${
              emailType === "bulk" ? "translate-x-full" : "translate-x-0"
            }`}
          />
          <button
            onClick={() => setEmailType("single")}
            className="relative w-1/2 py-2 text-sm font-bold text-center z-10 transition-colors"
          >
            Single
          </button>
          <button
            onClick={() => setEmailType("bulk")}
            className="relative w-1/2 py-2 text-sm font-bold text-center z-10 transition-colors"
          >
            Bulk
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg text-sm text-red-200">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (e.g., test@luxidevilott.com)"
            required
            className="w-full px-4 py-3 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-neutral-800 text-white placeholder-neutral-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-neutral-800 text-white placeholder-neutral-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
