"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../lib/api";
import axios from "axios";

import EmailList from "../../../components/EmailList";
import EmailDetail from "../../../components/EmailDetail";
import ComposeModal from "../../../components/ComposeModal";

interface EmailListItem {
  id: string;
  from: string;
  subject: string;
  snippet: string;
}
interface EmailDetails {
  id: string;
  from: string;
  subject: string;
  body: string;
}

export default function InboxPage() {
  const { user, logout } = useAuth();

  const [emails, setEmails] = useState<EmailListItem[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);

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

    fetchEmailList();
  }, [user, logout]);

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

  if (isLoadingList) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4 p-8 bg-neutral-900 rounded-xl shadow-lg">
          <svg
            className="animate-spin h-8 w-8 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
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
      {/* Sidebar & Email List */}
      <aside className="w-80 min-w-[320px] max-w-[400px] h-full bg-neutral-900 shadow-xl border-r border-neutral-800 flex flex-col sticky left-0 top-0 z-10">
        <div className="px-6 py-6 border-b border-neutral-800 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-white tracking-wide drop-shadow">
            Inbox
          </span>
          <button
            onClick={() => setIsComposing(true)}
            className="px-4 py-2 bg-red-600 text-white rounded font-semibold text-base shadow-lg border-none cursor-pointer transition-transform duration-150 hover:scale-105 hover:bg-red-700"
          >
            + Compose
          </button>
        </div>
        <div className="flex-grow overflow-y-auto rounded-xl bg-neutral-800 shadow-inner mt-2">
          <EmailList
            emails={emails}
            selectedEmailId={selectedEmailId}
            onSelectEmail={setSelectedEmailId}
          />
        </div>
        <div className="w-full h-2 bg-red-600 opacity-40 rounded-b-xl" />
        {/* <div className="px-4 py-4 border-t border-neutral-800 text-sm text-neutral-400">
          <div>Welcome,<br /><span className="font-semibold text-white">{user?.email}</span></div>
          <button onClick={logout} className="mt-2 px-3 py-1 bg-red-600 text-white rounded border-none cursor-pointer text-sm transition-colors duration-200 hover:bg-red-700">Logout</button>
        </div> */}
      </aside>
      {/* Email Detail */}
      <main className="relative h-screen w-screen bg-neutral-900 ">
      
        <EmailDetail
            email={selectedEmailDetails}
            isLoading={isLoadingDetails}
          />
        
      </main>
      {/* Compose Modal */}
      {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
    </div>
  );
}
