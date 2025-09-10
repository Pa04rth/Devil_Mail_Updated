// client/app/main/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Mail, Send, Clock, Search } from "lucide-react";
import api from "../../lib/api";

interface EmailResult {
  id: string;
  from: string;
  subject: string;
  snippet: string;
}

export default function Main() {
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<EmailResult[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [error, setError] = useState<string | null>(null);

  // Stop the countdown when results are found or an error occurs
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
      handleSearch(); // Retry search
    }
    return () => clearInterval(timer);
  }, [searchAttempted, isSearching, results, countdown, error]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) return;

    setIsSearching(true);
    setSearchAttempted(true);
    setError(null);
    setCountdown(10); // Reset countdown on new search

    try {
      const response = await api.post("/emails/search-public", {
        email: email,
      });

      if (response.data.success) {
        setResults(response.data.emails || []);
      } else {
        setError(response.data.message || "An unknown error occurred.");
      }
    } catch (err: any) {
      console.error("Error searching emails:", err);
      setError(
        err.response?.data?.message || "Failed to connect to the server."
      );
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950 to-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-900/50 rounded-2xl shadow-2xl shadow-red-900/20 backdrop-blur-sm overflow-hidden">
          <div className="relative bg-gradient-to-r from-red-900 to-red-800 p-6 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-400/20 blur-sm"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-2">
                <Mail className="w-8 h-8 text-red-200 mr-3" />
                <h1 className="text-3xl font-bold text-white tracking-wider">
                  Devil Mail
                </h1>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto rounded-full"></div>
            </div>
          </div>
          <div className="p-8">
            <p className="text-red-200 text-center mb-8 font-medium">
              Enter the shadows of digital communication
            </p>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.soul@hell.com"
                  className="w-full px-4 py-3 bg-black/50 border-2 border-red-900/50 rounded-lg text-white placeholder-red-300/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 group-hover:border-red-700/70"
                  required
                  disabled={isSearching}
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !email}
                className="w-full relative group bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-900/30 hover:shadow-xl hover:shadow-red-800/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center justify-center">
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search for Mail
                    </>
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {searchAttempted && !isSearching && (
        <div className="relative z-10 w-full max-w-4xl mt-8 animate-fade-in">
          {results.length > 0 ? (
            <div className="bg-neutral-900/80 border border-red-800/50 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-4">
                Found {results.length} message(s) for {email}
              </h2>
              <ul className="divide-y divide-neutral-800">
                {results.map((res) => (
                  <li key={res.id} className="py-3">
                    <p className="font-semibold text-red-400">{res.from}</p>
                    <p className="text-white font-medium">{res.subject}</p>
                    <p className="text-sm text-neutral-400 mt-1">
                      {res.snippet}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-neutral-900/80 border border-red-800/50 rounded-lg p-6 text-center backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white">
                No Messages Found
              </h2>
              {error ? (
                <p className="text-yellow-400 mt-2">{error}</p>
              ) : (
                <>
                  <p className="text-neutral-300 mt-2">
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
      )}
    </div>
  );
}
