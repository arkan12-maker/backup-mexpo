"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Plus, User } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import SuperAdminDashboard from "../admin/SuperAdminDashboard";
import EventList from "./Eventlist";
import DashboardSidebarLayout, {
  SidebarTabGroup,
} from "@/features/dashboard/shared/DashboardSidebarLayout";

export default function DashboardRouter() {
  const user = useAuthStore((s) => s.user);

  if (user?.role === "SUPERADMIN") {
    return <SuperAdminDashboard />;
  }

  const sidebarHeader = (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center font-bold text-sm shrink-0">
          <User className="w-5 h-5 text-secondary" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Akun Saya
          </p>
          <h3 className="text-sm font-extrabold text-gray-900 truncate">
            {user?.full_name || "Pengguna"}
          </h3>
        </div>
      </div>
      <div className="pt-1">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
          User Dashboard
        </span>
      </div>
    </div>
  );

  const sidebarFooter = (
    <Link
      href="/dashboard/create"
      className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-secondary hover:bg-brand-600 text-white font-semibold text-xs shadow-xs transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span>Buat Event Baru</span>
    </Link>
  );

  const groups: SidebarTabGroup[] = [
    {
      id: "events-group",
      label: "Event & Registrasi",
      subTabs: [
        {
          id: "my-events",
          label: "Daftar Event Saya",
          icon: Calendar,
          content: (
            <div className="space-y-4">
              <EventList hideHero={false} />
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <DashboardSidebarLayout
      groups={groups}
      defaultGroupId="events-group"
      defaultSubTabId="my-events"
      sidebarHeader={sidebarHeader}
      sidebarFooter={sidebarFooter}
      backHref="/"
      backLabel="Kembali ke Beranda"
    />
  );
}
