
"use client";


import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-full bg-gradient-to-b from-white to-slate-100 shadow-xl border-r border-slate-200 flex flex-col p-6 rounded-r-3xl">
      <h2 className="text-2xl font-extrabold text-teal-700 mb-6 drop-shadow">Devil Mail</h2>
      {user && (
        <div className="mt-auto flex flex-col gap-2">
          <div className="text-slate-500">Welcome,</div>
          <div className="font-semibold text-teal-700">{user.email}</div>
          <button onClick={logout} className="mt-2 px-3 py-1 bg-cyan-100 text-teal-700 rounded border-none cursor-pointer text-sm transition-colors duration-200 hover:bg-cyan-200">Logout</button>
        </div>
      )}
    </aside>
  );
}
