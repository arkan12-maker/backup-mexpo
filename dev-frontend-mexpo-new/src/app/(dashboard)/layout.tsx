// src/app/(dashboard)/layout.tsx
// Dashboard shell — clean edge-to-edge layout for modern sidebar management dashboards.
//
// Server-side auth guard (second layer, on top of src/proxy.ts):
// The proxy only runs on full (hard) navigations — it does NOT protect
// client-side transitions (next/link, router.push). This layout is a Server
// Component that re-renders on every navigation (hard AND soft), so it reads
// the httpOnly `token` cookie here and redirects to /auth when missing.
// This covers every route in the (dashboard) group: /dashboard/* and /profile.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-gray-900 flex flex-col">
      {children}
    </div>
  );
}
