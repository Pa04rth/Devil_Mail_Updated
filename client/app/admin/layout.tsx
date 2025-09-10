// client/app/admin/layout.tsx
"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Verifying access...</span>
        </div>
      </div>
    );
  }

  // After loading, if user is not an admin, redirect them.
  if (!user || user.role !== "admin") {
    router.push("/login");
    return null; // Render nothing while redirecting
  }

  return (
    <div className="flex h-screen w-screen bg-black overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto">{children}</main>
    </div>
  );
}
