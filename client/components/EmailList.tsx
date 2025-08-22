
"use client";


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
      <div className="text-center py-8 text-slate-400">No emails found.</div>
    );
  }
  return (
    <div className="w-full">
      <ul className="divide-y divide-slate-200">
        {emails.map((email) => (
          <li
            key={email.id}
            onClick={() => onSelectEmail(email.id)}
            className={`cursor-pointer px-4 py-3 rounded-xl my-2 shadow-sm bg-white/90 hover:bg-cyan-50 transition-colors ${email.id === selectedEmailId ? "bg-cyan-100 border-l-4 border-teal-400" : ""}`}
          >
            <span className="block font-semibold text-teal-700">{email.from}</span>
            <p className="text-slate-700">{email.subject}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
