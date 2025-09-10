// client/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../lib/api";
import {
  Shield,
  Save,
  AlertTriangle,
  CheckCircle,
  Plus,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

export default function AdminDashboard() {
  const { user } = useAuth();

  // State for subject arrays
  const [mainPageSubjects, setMainPageSubjects] = useState<string[]>([]);
  const [inboxPageSubjects, setInboxPageSubjects] = useState<string[]>([]);

  // State for the text in the input boxes
  const [currentMainSubject, setCurrentMainSubject] = useState("");
  const [currentInboxSubject, setCurrentInboxSubject] = useState("");

  // State for the refresh token
  const [googleRefreshToken, setGoogleRefreshToken] = useState("");
  const [showToken, setShowToken] = useState(false);

  // General component state
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("/admin/settings");
        setMainPageSubjects(data.mainPageSubject || []);
        setInboxPageSubjects(data.inboxPageSubject || []);
      } catch (err) {
        setError("Failed to load settings.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (user?.role === "admin") {
      fetchSettings();
    }
  }, [user]);

  const handleAddSubject = (type: "main" | "inbox") => {
    if (type === "main" && currentMainSubject.trim()) {
      if (!mainPageSubjects.includes(currentMainSubject.trim())) {
        setMainPageSubjects([...mainPageSubjects, currentMainSubject.trim()]);
      }
      setCurrentMainSubject("");
    } else if (type === "inbox" && currentInboxSubject.trim()) {
      if (!inboxPageSubjects.includes(currentInboxSubject.trim())) {
        setInboxPageSubjects([
          ...inboxPageSubjects,
          currentInboxSubject.trim(),
        ]);
      }
      setCurrentInboxSubject("");
    }
  };

  const handleRemoveSubject = (
    subjectToRemove: string,
    type: "main" | "inbox"
  ) => {
    if (type === "main") {
      setMainPageSubjects(
        mainPageSubjects.filter((s) => s !== subjectToRemove)
      );
    } else {
      setInboxPageSubjects(
        inboxPageSubjects.filter((s) => s !== subjectToRemove)
      );
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");
    try {
      await api.put("/admin/settings", {
        mainPageSubject: mainPageSubjects,
        inboxPageSubject: inboxPageSubjects,
        googleRefreshToken: googleRefreshToken,
      });
      setMessage("Settings saved successfully!");
      setGoogleRefreshToken("");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError("Failed to save settings. Please try again.");
      console.error(err);
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
    <div className="h-full bg-neutral-900 flex items-center justify-center p-8 overflow-y-auto">
      <div className="w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white tracking-wider">
            Dashboard
          </h1>
          <p className="text-neutral-300 mt-2 font-medium">
            Manage global application settings.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div>
            <label className="block mb-3 text-lg font-medium text-white">
              Public Main Page Subjects
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentMainSubject}
                onChange={(e) => setCurrentMainSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubject("main");
                  }
                }}
                placeholder="Add a new subject and press Enter..."
                className="flex-grow px-4 py-2 bg-neutral-900 border-2 border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => handleAddSubject("main")}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
              {mainPageSubjects.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2 bg-neutral-800 text-white text-sm font-medium pl-3 pr-2 py-1 rounded-full animate-fade-in"
                >
                  <span className="max-w-[200px] truncate">{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(s, "main")}
                    className="text-neutral-400 hover:text-red-500"
                    aria-label={`Remove ${s} subject`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-3 text-lg font-medium text-white">
              Authenticated Inbox Search Subjects
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={currentInboxSubject}
                onChange={(e) => setCurrentInboxSubject(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubject("inbox");
                  }
                }}
                placeholder="Add a new subject and press Enter..."
                className="flex-grow px-4 py-2 bg-neutral-900 border-2 border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all"
              />
              <button
                type="button"
                onClick={() => handleAddSubject("inbox")}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neutral-600 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3 min-h-[40px]">
              {inboxPageSubjects.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2 bg-neutral-800 text-white text-sm font-medium pl-3 pr-2 py-1 rounded-full animate-fade-in"
                >
                  <span className="max-w-[200px] truncate">{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(s, "inbox")}
                    className="text-neutral-400 hover:text-red-500"
                    aria-label={`Remove ${s} subject`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8">
            <label
              htmlFor="googleToken"
              className="block mb-2 text-lg font-medium text-white"
            >
              Google Refresh Token
            </label>
            <p className="text-xs text-neutral-400 mb-3">
              Update the token used to access the Gmail API. Leave blank to keep
              the existing token.
            </p>
            <div className="relative">
              <input
                id="googleToken"
                type={showToken ? "text" : "password"}
                value={googleRefreshToken}
                onChange={(e) => setGoogleRefreshToken(e.target.value)}
                placeholder="Enter new token (current token is hidden for security)"
                className="w-full px-4 py-2 bg-neutral-900 border-2 border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/30 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-white"
                aria-label={showToken ? "Hide token" : "Show token"}
              >
                {showToken ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? (
              <>
                {" "}
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>{" "}
                Saving...{" "}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save All Settings
              </>
            )}
          </button>
        </form>

        {message && (
          <div className="mt-4 p-3 flex items-center justify-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg text-green-200 text-center animate-fade-in">
            <CheckCircle className="w-5 h-5" /> {message}
          </div>
        )}
        {error && (
          <div className="mt-4 p-3 flex items-center justify-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-center animate-fade-in">
            <AlertTriangle className="w-5 h-5" /> {error}
          </div>
        )}
      </div>
    </div>
  );
}
