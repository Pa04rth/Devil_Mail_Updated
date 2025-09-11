// client/app/email/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "../../../lib/api";
import { Mail, Clock, User, AlertTriangle } from "lucide-react";

interface EmailDetails {
  to: string;
  subject: string;
  body: string;
  timestamp: string;
}

export default function EmailViewerPage() {
  const params = useParams();
  const id = params.id as string;

  const [email, setEmail] = useState<EmailDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchEmail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/emails/public/${id}`);
        setEmail(data);
      } catch (err) {
        console.error("Failed to fetch email content", err);
        setError(
          "Could not load the email. It may have been moved or deleted."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmail();
  }, [id]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg text-neutral-400">Loading Email...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {email && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl animate-fade-in">
            <header className="p-6 border-b border-neutral-800">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {email.subject}
              </h1>
              <div className="flex flex-col sm:flex-row justify-between text-sm text-neutral-400 gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span>{new Date(email.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </header>
            <main className="p-1 sm:p-2 bg-white">
              <iframe
                srcDoc={email.body}
                className="w-full h-[70vh] border-none"
                title="Email Content"
                sandbox="allow-popups allow-popups-to-escape-sandbox" // Security sandbox
              />
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
