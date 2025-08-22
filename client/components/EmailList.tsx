
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
      <div className="text-center py-8 text-neutral-500">No emails found.</div>
    );
  }
  return (
    <div className="w-full">
      <ul className="divide-y divide-neutral-800">
        {emails.map((email) => (
          <li
            key={email.id}
            onClick={() => onSelectEmail(email.id)}
            className={`cursor-pointer px-4 py-3 rounded-xl my-2 shadow-sm bg-neutral-900 hover:bg-neutral-800 transition-colors ${email.id === selectedEmailId ? "bg-red-900 border-l-4 border-red-600" : ""}`}
          >
            <span className="block font-semibold text-white">{email.from}</span>
            <p className="text-neutral-300">{email.subject}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
