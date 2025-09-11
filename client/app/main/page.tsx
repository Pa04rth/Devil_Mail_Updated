// client/app/main/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Mail, Send, Clock, Search } from "lucide-react";
import api from "../../lib/api";
import axios from "axios";

interface EmailResult {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  timestamp: string;
}

export default function Main() {
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (
      searchAttempted &&
      !isSearching &&
      results.length === 0 &&
      countdown > 0 &&
      !error
    ) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleSearch();
    }
    return () => clearInterval(timer);
  }, [searchAttempted, isSearching, results, countdown, error]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    setIsSearching(true);
    setSearchAttempted(true);
    setError(null);
    setCountdown(10);

    try {
      const response = await api.post("/emails/search-public", { email });
      if (response.data.success) {
        setResults(response.data.emails || []);
      } else {
        setError(response.data.message || "An unknown error occurred.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Handle Axios errors properly
        setError(
          err.response?.data?.message || "Failed to connect to the server."
        );
      } else if (err instanceof Error) {
        // Handle generic errors
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
      console.error("Error searching emails:", err);
    } finally {
      setIsSearching(false);
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex flex-col items-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 w-full max-w-md mt-20">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/50 rounded-2xl shadow-2xl shadow-red-900/20 backdrop-blur-sm overflow-hidden">
            <div className="relative bg-gradient-to-r from-red-900 to-red-800 p-6 text-center">
              <Mail className="w-8 h-8 text-red-200 mx-auto mb-2" />
              <h1 className="text-3xl font-bold text-white tracking-wider">
                Devil Mail
              </h1>
            </div>
            <div className="p-8">
              <p className="text-red-200 text-center mb-6 font-medium">
                Enter the shadows of digital communication
              </p>
              <form onSubmit={handleSearch} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.soul@hell.com"
                  className="w-full px-4 py-3 bg-black/50 border-2 border-red-900/50 rounded-lg text-white placeholder-red-300/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all"
                  required
                  disabled={isSearching}
                />
                <button
                  type="submit"
                  disabled={isSearching || !email}
                  className="w-full flex items-center justify-center bg-red-700 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/30"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  <span className="ml-2">
                    {isSearching ? "Searching..." : "Search for Mail"}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {searchAttempted && !isSearching && (
          <div className="relative z-10 w-full max-w-4xl mt-8 animate-fade-in">
            <div className="bg-neutral-900/80 border border-red-800/50 rounded-lg p-4 sm:p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4">
                {results.length > 0
                  ? `Found ${results.length} message(s) for ${email}`
                  : "No Messages Found"}
              </h2>
              {results.length > 0 ? (
                <ul className="divide-y divide-neutral-800">
                  {results.map((res) => (
                    <li key={res.id} className="py-3 group">
                      <Link
                        href={`/email/${res.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-md group-hover:bg-red-900/20 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <p className="text-xs text-neutral-500 flex-shrink-0 ml-4">
                            {new Date(res.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-white font-medium mt-1 group-hover:text-red-300 transition-colors">
                          {res.subject}
                        </p>
                        <p className="text-sm text-neutral-400 mt-1">
                          {res.snippet}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  {error ? (
                    <p className="text-yellow-400">{error}</p>
                  ) : (
                    <>
                      <p className="text-neutral-300">
                        Waiting for a message to appear...
                      </p>
                      <div className="flex items-center justify-center gap-3 mt-4 text-2xl font-mono text-red-500">
                        <Clock className="w-6 h-6" />
                        <span>Retrying in {countdown}s</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
}
