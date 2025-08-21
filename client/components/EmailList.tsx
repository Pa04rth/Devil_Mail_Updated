
"use client";
import "./EmailList.css";

interface Email {
  id: string;
  from: string;
  subject: string;
}

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (id: string) => void;
}

export default function EmailList({
  emails,
  selectedEmailId,
  onSelectEmail,
}: EmailListProps) {
  if (emails.length === 0) {
    return (
      <div className="email-list-empty">No emails found.</div>
    );
  }
  return (
    <div className="email-list">
      <ul className="email-list-ul">
        {emails.map((email) => (
          <li
            key={email.id}
            onClick={() => onSelectEmail(email.id)}
            className={`email-list-li${email.id === selectedEmailId ? " selected" : ""}`}
          >
            <span className="email-list-from">{email.from}</span>
            <p className="email-list-subject">{email.subject}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
