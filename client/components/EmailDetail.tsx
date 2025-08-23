"use client";

import { useState } from "react";
import api from "../lib/api";

interface EmailDetails {
  id: string;
  subject: string;
  from: string;
  body: string;
}

interface EmailDetailProps {
  email: EmailDetails | null;
  isLoading: boolean;
}

export default function EmailDetail({ email, isLoading }: EmailDetailProps) {
  const [showReply, setShowReply] = useState(false);
  const [showForward, setShowForward] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [forwardTo, setForwardTo] = useState("");
  const [forwardBody, setForwardBody] = useState(email ? email.body : "");
  const [isSending, setIsSending] = useState(false);

  const handleReplySend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post("/emails/reply", {
        to: email?.from,
        subject: `Re: ${email?.subject}`,
        body: replyBody,
        originalId: email?.id,
      });
      setShowReply(false);
      setReplyBody("");
      alert("Reply sent!");
    } catch (error) {
      alert("Failed to send reply.");
    } finally {
      setIsSending(false);
    }
  };

  const handleForwardSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await api.post("/emails/forward", {
        to: forwardTo,
        subject: `Fwd: ${email?.subject}`,
        body: forwardBody,
        originalId: email?.id,
      });
      setShowForward(false);
      setForwardTo("");
      setForwardBody(email ? email.body : "");
      alert("Email forwarded!");
    } catch (error) {
      alert("Failed to forward email.");
    } finally {
      setIsSending(false);
    }
  };
  if (isLoading) {
    return (
      <div className=" flex items-center justify-center text-center p-85 text-neutral-500">
        Loading email content...
      </div>
    );
  }

  if (!email) {
    return (
      <div className=" flex items-center justify-center text-center p-85 text-neutral-500">
        Select an email to read.
      </div>
    );
  }

  return (
    <div className="flex items-start justify-start h-full w-full  ">
      <div className="p-10 absolute  border-neutral-800 mt-4 ml-4 min-w-[400px] max-w-[700px]">
        <h2 className="text-2xl font-extrabold text-white mb-2 drop-shadow">
          {email.subject}
        </h2>
        <p className="mb-2 text-neutral-400">
          <span className="font-semibold text-red-600">From:</span> {email.from}
        </p>
        <hr className="my-4 border-red-800" />
        <div
          className="prose max-w-none text-white"
          dangerouslySetInnerHTML={{ __html: email.body }}
        />
      </div>
      <div className="flex gap-70 mt-150 p-15">
        <button
          className="bg-red-600 text-white px-20 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors"
          onClick={() => setShowReply(true)}
        >
          Reply
        </button>
        <button
          className="bg-red-600 text-white px-20 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors"
          onClick={() => setShowForward(true)}
        >
          Forward
        </button>
      </div>

      {/* Reply Modal */}
      {showReply && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-neutral-800 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-extrabold text-white drop-shadow">
                Reply to {email.from}
              </span>
              <button
                onClick={() => setShowReply(false)}
                className="text-2xl text-neutral-400 hover:text-red-600 font-bold px-2"
                aria-label="Close reply window"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleReplySend} className="flex flex-col gap-4">
              <textarea
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                required
                placeholder="Type your reply..."
                className="w-full px-4 py-2 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[120px] bg-neutral-800 text-white placeholder-neutral-400"
              />
              <button
                type="submit"
                disabled={isSending}
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Send Reply"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Forward Modal */}
      {showForward && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md p-8 border border-neutral-800 relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-extrabold text-white drop-shadow">
                Forward Email
              </span>
              <button
                onClick={() => setShowForward(false)}
                className="text-2xl text-neutral-400 hover:text-red-600 font-bold px-2"
                aria-label="Close forward window"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleForwardSend} className="flex flex-col gap-4">
              <input
                type="email"
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value)}
                required
                placeholder="Recipient's email"
                className="w-full px-4 py-2 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 bg-neutral-800 text-white placeholder-neutral-400"
              />
              <textarea
                value={forwardBody}
                onChange={(e) => setForwardBody(e.target.value)}
                required
                placeholder="Forward message..."
                className="w-full px-4 py-2 border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[120px] bg-neutral-800 text-white placeholder-neutral-400"
              />
              <button
                type="submit"
                disabled={isSending}
                className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Send Forward"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
