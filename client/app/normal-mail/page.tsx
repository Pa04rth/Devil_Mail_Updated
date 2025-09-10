// client/app/normal-mail/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../lib/api";
import axios from "axios";
import { Search, Mail, X } from "lucide-react";

import EmailList from "../../components/EmailList";
import EmailDetail from "../../components/EmailDetail";
import ComposeModal from "../../components/ComposeModal";

interface EmailListItem {
  id: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  timestamp: Date;
  isRead: boolean;
  threadId: string;
}

interface EmailDetails {
  id: string;
  from: string;
  subject: string;
  body: string;
}

interface SearchResponse {
  success: boolean;
  count: number;
  searchQuery: string;
  emails: EmailListItem[];
  message?: string;
}

export default function InboxPage() {
  const { user, logout } = useAuth();

  const [emails, setEmails] = useState<EmailListItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [searchResults, setSearchResults] = useState<EmailListItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(false);

  const [searchEmail, setSearchEmail] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [selectedEmailDetails, setSelectedEmailDetails] =
    useState<EmailDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const [isComposing, setIsComposing] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsLoadingList(false);
      return;
    }
    const fetchEmailList = async () => {
      try {
        const { data } = await api.get("/emails/inbox");
        setEmails(data);
      } catch (error) {
        console.error("Could not fetch email list", error);
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          logout();
        }
      } finally {
        setIsLoadingList(false);
      }
    };
    if (!searchMode) {
      fetchEmailList();
    }
  }, [user, logout, searchMode]);

  const handleSearch = async () => {
    if (!searchEmail.trim()) {
      alert("Please enter an email address to search");
      return;
    }
    setIsSearching(true);
    setSearchMode(true);
    try {
      const { data }: { data: SearchResponse } = await api.post(
        "/emails/search-emails",
        { email: searchEmail.trim() }
      );
      setSearchResults(data.emails || []);
      setSearchCount(data.count || 0);
      setSearchQuery(data.searchQuery || "");
      setSelectedEmailId(null);
      setSelectedEmailDetails(null);
    } catch (error) {
      console.error("Could not search emails", error);
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        logout();
      }
      alert("Failed to search emails. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchMode(false);
    setSearchEmail("");
    setSearchResults([]);
    setSearchCount(0);
    setSearchQuery("");
    setSelectedEmailId(null);
    setSelectedEmailDetails(null);
  };

  useEffect(() => {
    if (!selectedEmailId) {
      setSelectedEmailDetails(null);
      return;
    }
    const fetchEmailDetails = async () => {
      setIsLoadingDetails(true);
      try {
        const { data } = await api.get(`/emails/${selectedEmailId}`);
        setSelectedEmailDetails(data);
      } catch (error) {
        console.error("Could not fetch email details", error);
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          logout();
        }
      } finally {
        setIsLoadingDetails(false);
      }
    };
    fetchEmailDetails();
  }, [selectedEmailId, logout]);

  const currentEmails = searchMode ? searchResults : emails;
  const isLoading = searchMode ? isSearching : isLoadingList;

  if (isLoadingList && !searchMode) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4 p-8 bg-neutral-900 rounded-xl shadow-lg">
          <svg className="animate-spin h-8 w-8 text-red-600" /* ... */>
            {/* ... svg paths ... */}
          </svg>
          <span className="text-lg font-medium text-white">
            Loading your inbox...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden">
      <aside className="w-96 min-w-[384px] max-w-[500px] h-full bg-neutral-900 shadow-xl border-r border-neutral-800 flex flex-col sticky left-0 top-0 z-10">
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mail className="w-6 h-6 text-red-500" />
            <span className="text-xl font-extrabold text-white tracking-wide">
              {searchMode ? "Search Results" : "Inbox"}
            </span>
          </div>
          <button
            onClick={() => setIsComposing(true)}
            className="px-3 py-1.5 bg-red-600 text-white rounded text-sm font-semibold shadow-lg transition-transform duration-150 hover:scale-105 hover:bg-red-700"
          >
            + Compose
          </button>
        </div>

        <div className="px-6 py-4 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 to-neutral-800">
          <div className="space-y-3">
            <div className="relative">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Search emails sent to..."
                className="w-full px-3 py-2 bg-black/50 border border-red-900/50 rounded text-white placeholder-red-300/50 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/20 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Search className="absolute right-3 top-2.5 w-4 h-4 text-red-400" />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchEmail.trim()}
                className="flex-1 px-3 py-2 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white rounded text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Search
                  </>
                )}
              </button>
              {searchMode && (
                <button
                  onClick={clearSearch}
                  className="px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded text-sm transition-colors duration-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {searchMode && (
            <div className="mt-3 p-2 bg-red-900/20 border border-red-700/30 rounded text-xs text-red-200">
              {isSearching ? (
                <div className="text-red-300">Searching...</div>
              ) : searchCount > 0 ? (
                <div>
                  <strong>{searchCount}</strong> email
                  {searchCount !== 1 ? "s" : ""} found
                  {searchQuery && (
                    <div className="mt-1 text-red-300/70 font-mono text-xs">
                      Query: {searchQuery}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-300">
                  No emails found with current search criteria.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto bg-neutral-800 shadow-inner">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-red-400">
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">
                  {searchMode ? "Searching..." : "Loading Inbox..."}
                </span>
              </div>
            </div>
          ) : (
            <EmailList
              emails={currentEmails}
              selectedEmailId={selectedEmailId}
              onSelectEmail={setSelectedEmailId}
            />
          )}
        </div>
      </aside>

      <main className="relative h-screen w-screen bg-neutral-900">
        <EmailDetail
          email={selectedEmailDetails}
          isLoading={isLoadingDetails}
        />
      </main>

      {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
    </div>
  );
}
