
"use client";


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
      <div className="text-center py-8 text-neutral-500">Loading email content...</div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-8 text-neutral-500">Select an email to read.</div>
    );
  }

  return (
    <div className="p-8 bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-800">
      <h2 className="text-2xl font-extrabold text-white mb-2 drop-shadow">{email.subject}</h2>
      <p className="mb-2 text-neutral-400"><span className="font-semibold text-red-600">From:</span> {email.from}</p>
      <hr className="my-4 border-red-800" />
      <div className="prose max-w-none text-white" dangerouslySetInnerHTML={{ __html: email.body }} />
    </div>
  );
}
