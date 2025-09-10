// client/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../lib/api";
import { Shield, Save, AlertTriangle, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  const [mainPageSubject, setMainPageSubject] = useState("");
  const [inboxPageSubject, setInboxPageSubject] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/admin/settings");
        setMainPageSubject(data.mainPageSubject);
        setInboxPageSubject(data.inboxPageSubject);
      } catch (err) {
        setError("Failed to load settings.");
        console.error("Settings fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    // Only fetch if we are sure the user is an admin
    if (user?.role === "admin") {
      fetchSettings();
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      await api.put("/admin/settings", {
        mainPageSubject,
        inboxPageSubject,
      });
      setMessage("Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <Shield className="w-12 h-12 text-red-500 mb-3" />
          <h1 className="text-3xl font-bold text-white tracking-wider">
            Dashboard
          </h1>
          <p className="text-neutral-300 mt-2 font-medium">
            Manage global email search subjects from here.
          </p>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label
              htmlFor="mainPageSubject"
              className="block mb-2 text-sm font-medium text-white"
            >
              Public Main Page Subject
            </label>
            <input
              id="mainPageSubject"
              type="text"
              value={mainPageSubject}
              onChange={(e) => setMainPageSubject(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
              required
            />
          </div>
          <div>
            <label
              htmlFor="inboxPageSubject"
              className="block mb-2 text-sm font-medium text-white"
            >
              Authenticated Inbox Search Subject
            </label>
            <input
              id="inboxPageSubject"
              type="text"
              value={inboxPageSubject}
              onChange={(e) => setInboxPageSubject(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-900 border-2 border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Settings
              </>
            )}
          </button>
        </form>
        {message && (
          <div className="mt-4 p-3 flex items-center justify-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg text-green-200 text-center animate-fade-in">
            <CheckCircle className="w-5 h-5" />
            {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 flex items-center justify-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-center animate-fade-in">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
