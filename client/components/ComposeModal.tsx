
"use client";


import { useState } from "react";
import api from "../lib/api";


interface ComposeModalProps {
  onClose: () => void;
}

export default function ComposeModal({ onClose }: ComposeModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post("/emails/send", { to, subject, body });
      onClose();
    } catch (error) {
      alert("Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-cyan-100 relative">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-extrabold text-teal-700 drop-shadow">New Message</span>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-teal-500 font-bold px-2"
            aria-label="Close compose window"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <div>
            <label htmlFor="compose-to" className="sr-only">To</label>
            <input
              id="compose-to"
              type="email"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="w-full px-4 py-2 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/80"
            />
          </div>
          <div>
            <label htmlFor="compose-subject" className="sr-only">Subject</label>
            <input
              id="compose-subject"
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full px-4 py-2 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white/80"
            />
          </div>
          <div>
            <label htmlFor="compose-body" className="sr-only">Email Body</label>
            <textarea
              id="compose-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="w-full px-4 py-2 border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 min-h-[120px] bg-white/80"
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="bg-gradient-to-r from-teal-500 to-cyan-400 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-cyan-500 transition-colors disabled:opacity-50"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
