"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import SuperAdminDashboard from "../admin/SuperAdminDashboard";
import EventList from "./Eventlist";

export default function DashboardRouter() {
  const user = useAuthStore((s) => s.user);

  if (user?.role === "SUPERADMIN") {
    return <SuperAdminDashboard />;
  }

  return <EventList />;
}

