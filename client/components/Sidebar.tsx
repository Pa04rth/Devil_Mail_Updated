
"use client";
import "./Sidebar.css";

import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Devil Mail</h2>
      {user && (
        <div className="sidebar-user">
          <div>Welcome,</div>
          <div className="sidebar-user-email">{user.email}</div>
          <button onClick={logout} className="sidebar-logout">Logout</button>
        </div>
      )}
    </aside>
  );
}
