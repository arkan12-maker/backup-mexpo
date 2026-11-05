import { httpGet } from "@/shared/utils/http-client";
import { META_DYNAMIC } from "@/shared/utils/http-meta";

export interface AdminOverviewData {
  events: {
    total: number;
    drafted: number;
    pending: number;
    published: number;
    rejected: number;
    finished: number;
  };
  users: {
    total: number;
    superadmins: number;
    regular: number;
  };
  financials: {
    totalTransactions: number;
    grossVolume: number;
    platformFee: number;
    pendingSettlements: number;
  };
  inquiries: {
    total: number;
    unread: number;
  };
  actionsNeeded: {
    pendingApprovals: number;
    pendingSettlements: number;
    unreadInquiries: number;
    total: number;
  };
  recentPendingEvents: Array<{
    uuid: string;
    slug?: string;
    name: string;
    organizer_name: string;
    photo?: string;
    updated_at: string;
    created_at: string;
    creator?: {
      uuid: string;
      full_name: string;
      email: string;
    };
  }>;
  recentInquiries: Array<{
    uuid: string;
    name: string;
    email: string;
    subject: string;
    status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
    created_at: string;
  }>;
}

export async function getAdminOverview() {
  const res = await httpGet<AdminOverviewData>(
    "events/admin/overview",
    "token",
    META_DYNAMIC,
  );
  return {
    status: res.status,
    message: res.message,
    data: res.data as AdminOverviewData,
  };
}

