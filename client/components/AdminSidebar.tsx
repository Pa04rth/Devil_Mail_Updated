// client/components/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { LayoutDashboard, Mail, LogOut, UserPlus } from "lucide-react"; // Import new icon

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Inbox", href: "/admin/inbox", icon: Mail },
    { name: "Add Email", href: "/admin/add-email", icon: UserPlus }, // NEW LINK
  ];

  return (
    <aside className="w-64 min-w-[256px] h-full bg-neutral-900 shadow-xl border-r border-neutral-800 flex flex-col p-6 sticky top-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <h2 className="text-2xl font-extrabold text-white drop-shadow">
          Admin Panel
        </h2>
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-red-800 text-white"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>
      {user && (
        <div className="mt-auto flex flex-col gap-4 border-t border-neutral-800 pt-4">
          <div>
            <div className="text-xs text-neutral-500">Logged in as</div>
            <div className="font-semibold text-white truncate">
              {user.email}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-3 px-4 py-2 bg-red-600/80 text-white rounded-lg text-sm font-medium transition-colors hover:bg-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}
