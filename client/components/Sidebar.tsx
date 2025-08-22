
"use client";


import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 h-full bg-neutral-900 shadow-xl border-r border-neutral-800 flex flex-col p-6">
      <h2 className="text-2xl font-extrabold text-white mb-6 drop-shadow">Devil Mail</h2>
      {user && (
        <div className="mt-auto flex flex-col gap-2">
          <div className="text-neutral-400">Welcome,</div>
          <div className="font-semibold text-white">{user.email}</div>
          <button onClick={logout} className="mt-2 px-3 py-1 bg-red-600 text-white rounded border-none cursor-pointer text-sm transition-colors duration-200 hover:bg-red-700">Logout</button>
        </div>
      )}
    </aside>
  );
}
