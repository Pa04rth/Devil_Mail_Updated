
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
      <div className="text-center py-8 text-slate-400">Loading email content...</div>
    );
  }

  if (!email) {
    return (
      <div className="text-center py-8 text-slate-400">Select an email to read.</div>
    );
  }

  return (
    <div className=" p-8 bg-white/95 rounded-3xl shadow-2xl border border-cyan-100">
      <h2 className="text-2xl font-extrabold text-teal-700 mb-2 drop-shadow">{email.subject}</h2>
      <p className="mb-2 text-slate-500"><span className="font-semibold text-teal-400">From:</span> {email.from}</p>
      <hr className="my-4 border-cyan-200" />
      <div className="prose max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: email.body }} />
    </div>
  );
}
