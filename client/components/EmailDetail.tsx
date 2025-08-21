
"use client";
import "./EmailDetail.css";

interface EmailDetails {
  subject: string;
  from: string;
  body: string;
}

interface EmailDetailProps {
  email: EmailDetails | null;
  isLoading: boolean;
}

export default function EmailDetail({ email, isLoading }: EmailDetailProps) {
  if (isLoading) {
    return (
      <div className="email-detail-loading">Loading email content...</div>
    );
  }

  if (!email) {
    return (
      <div className="email-detail-empty">Select an email to read.</div>
    );
  }

  return (
    <div className="email-detail">
      <h2 className="email-detail-title">{email.subject}</h2>
      <p className="email-detail-from"><span className="label">From:</span> {email.from}</p>
      <hr className="email-detail-hr" />
      <div className="email-detail-body" dangerouslySetInnerHTML={{ __html: email.body }} />
    </div>
  );
}
