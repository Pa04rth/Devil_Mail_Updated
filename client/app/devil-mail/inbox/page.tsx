
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../lib/api";
import axios from "axios";


import EmailList from "../../../components/EmailList";
import EmailDetail from "../../../components/EmailDetail";
import ComposeModal from "../../../components/ComposeModal";
import "./inbox.css";

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-lg">
          <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-lg font-medium text-indigo-700">Loading your inbox...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="inbox-main">
      {/* Sidebar & Email List */}
      <aside className="inbox-sidebar">
        <div className="inbox-header">
          <span className="inbox-title">Inbox</span>
          <button
            onClick={() => setIsComposing(true)}
            className="compose-btn"
          >
            + Compose
          </button>
        </div>
        <div className="inbox-list">
          <EmailList
            emails={emails}
            selectedEmailId={selectedEmailId}
            onSelectEmail={setSelectedEmailId}
          />
        </div>
        <div className="inbox-gradient" />
        {/* <div className="inbox-footer">
          <div>Welcome,<br /><span className="user-email">{user?.email}</span></div>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div> */}
      </aside>
      {/* Email Detail */}
      <main className="inbox-content">
        <div className="inbox-content-inner">
          <EmailDetail email={selectedEmailDetails} isLoading={isLoadingDetails} />
        </div>
      </main>
      {/* Compose Modal */}
      {isComposing && <ComposeModal onClose={() => setIsComposing(false)} />}
    </div>
  );
}
