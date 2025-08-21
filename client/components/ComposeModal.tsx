
"use client";
import "./ComposeModal.css";

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
      alert("Email sent successfully!");
      onClose();
    } catch (error) {
      alert("Failed to send email.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="compose-modal-overlay">
      <div className="compose-modal">
        <div className="compose-modal-header">
          <span className="compose-modal-title">New Message</span>
          <button
            onClick={onClose}
            className="compose-modal-close"
            aria-label="Close compose window"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSend} className="compose-modal-form">
          <div>
            <label htmlFor="compose-to" className="sr-only">To</label>
            <input
              id="compose-to"
              type="email"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              className="compose-modal-input"
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
              className="compose-modal-input"
            />
          </div>
          <div>
            <label htmlFor="compose-body" className="sr-only">Email Body</label>
            <textarea
              id="compose-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="compose-modal-textarea"
            />
          </div>
          <button
            type="submit"
            disabled={isSending}
            className="compose-modal-submit"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
