import {
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
} from "@/shared/utils/http-client";
import { META_DYNAMIC } from "@/shared/utils/http-meta";

export type ContactStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

export interface ContactMessageItem {
  uuid: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip_address?: string;
  status: ContactStatus;
  reply_message?: string | null;
  replied_at?: string | null;
  replied_by?: string | null;
  replier?: {
    uuid: string;
    full_name: string;
    email: string;
    photo?: string;
  } | null;
  created_at: string;
  updated_at?: string;
}

export interface ContactMessageStats {
  total: number;
  unread: number;
  read: number;
  replied: number;
  archived: number;
}

export interface ContactMessageListResult {
  items: ContactMessageItem[];
  total: number;
  totalPages: number;
  page: number;
  quantity: number;
}

export async function getContactMessages(query?: Record<string, string>) {
  const res = await httpGet<ContactMessageItem[]>(
    "contact-messages",
    "token",
    META_DYNAMIC,
    query,
  );
  return {
    status: res.status,
    message: res.message,
    data: {
      items: (Array.isArray(res.data) ? res.data : []) as ContactMessageItem[],
      total: ((res as any).total as number) ?? 0,
      totalPages: ((res as any).totalPages as number) ?? 1,
      page: ((res as any).page as number) ?? 1,
      quantity: ((res as any).quantity as number) ?? 10,
    } as ContactMessageListResult,
  };
}

export async function getContactMessageStats() {
  const res = await httpGet<ContactMessageStats>(
    "contact-messages/stats",
    "token",
    META_DYNAMIC,
  );
  return {
    status: res.status,
    data: res.data as ContactMessageStats,
  };
}

export async function getContactMessage(uuid: string) {
  const res = await httpGet<ContactMessageItem>(
    `contact-messages/${uuid}`,
    "token",
    META_DYNAMIC,
  );
  return {
    status: res.status,
    data: res.data as ContactMessageItem,
  };
}

export async function updateContactStatus(uuid: string, status: ContactStatus) {
  return await httpPatch(
    `contact-messages/${uuid}/status`,
    JSON.stringify({ status }),
    "token",
  );
}

export async function replyContactMessage(uuid: string, replyMessage: string) {
  return await httpPost(
    `contact-messages/${uuid}/reply`,
    JSON.stringify({ reply_message: replyMessage }),
    "token",
  );
}

export async function deleteContactMessage(uuid: string) {
  return await httpDelete(`contact-messages/${uuid}`, "token");
}
