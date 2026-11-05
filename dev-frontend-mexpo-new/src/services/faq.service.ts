import {
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  httpPut,
} from "@/shared/utils/http-client";
import { META_DYNAMIC } from "@/shared/utils/http-meta";

export interface FaqItem {
  uuid: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  creator?: {
    uuid: string;
    full_name: string;
    email: string;
  };
}

export interface FaqListResult {
  items: FaqItem[];
  categories: string[];
}

export interface CreateFaqPayload {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  is_published?: boolean;
}

export async function getPublicFaqs(category?: string) {
  const query = category && category !== "Semua" ? { category } : undefined;
  const res = await httpGet<FaqItem[]>("faqs", undefined, META_DYNAMIC, query);
  return {
    status: res.status,
    data: {
      items: (Array.isArray(res.data) ? res.data : []) as FaqItem[],
      categories: ((res as any).categories as string[]) ?? ["Semua"],
    } as FaqListResult,
  };
}

export async function getAdminFaqs(query?: Record<string, string>) {
  const res = await httpGet<FaqItem[]>(
    "faqs/admin",
    "token",
    META_DYNAMIC,
    query,
  );
  return {
    status: res.status,
    message: res.message,
    data: {
      items: (Array.isArray(res.data) ? res.data : []) as FaqItem[],
      categories: ((res as any).categories as string[]) ?? ["Semua"],
    } as FaqListResult,
  };
}

export async function getFaq(uuid: string) {
  const res = await httpGet<FaqItem>(`faqs/${uuid}`, "token", META_DYNAMIC);
  return {
    status: res.status,
    data: res.data as FaqItem,
  };
}

export async function createFaq(payload: CreateFaqPayload) {
  return await httpPost("faqs", JSON.stringify(payload), "token");
}

export async function updateFaq(uuid: string, payload: Partial<CreateFaqPayload>) {
  return await httpPut(`faqs/${uuid}`, JSON.stringify(payload), "token");
}

export async function deleteFaq(uuid: string) {
  return await httpDelete(`faqs/${uuid}`, "token");
}

export async function reorderFaqs(items: { uuid: string; order: number }[]) {
  return await httpPatch(
    "faqs/reorder",
    JSON.stringify({ items }),
    "token",
  );
}
