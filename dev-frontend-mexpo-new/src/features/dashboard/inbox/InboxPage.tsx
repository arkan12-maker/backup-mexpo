"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CornerDownLeft,
  Inbox,
  Loader2,
  Mail,
  MailCheck,
  MailQuestion,
  RefreshCw,
  Search,
  Send,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useApiMutation, useApiQuery } from "@/lib/hooks/useApi";
import { keys } from "@/lib/query-keys";
import {
  ContactMessageItem,
  ContactMessageListResult,
  ContactMessageStats,
  ContactStatus,
  deleteContactMessage,
  getContactMessages,
  getContactMessageStats,
  replyContactMessage,
  updateContactStatus,
} from "@/services/inbox.service";
import Button from "@/shared/components/button/Button";
import { DataPagination } from "@/shared/components/ui/DataPagination";

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function InboxPage() {
  const [activeFilter, setActiveFilter] = useState<ContactStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Stats query
  const { data: stats, refetch: refetchStats } = useApiQuery<ContactMessageStats>(
    keys.inbox.stats,
    () => getContactMessageStats(),
  );

  // List query params
  const queryParams: Record<string, string> = {
    page: String(page),
    quantity: "10",
  };
  if (activeFilter !== "ALL") queryParams.status = activeFilter;
  if (debouncedSearch) queryParams.search = debouncedSearch;

  const {
    data: listData,
    isLoading,
    refetch: refetchList,
    isFetching,
  } = useApiQuery<ContactMessageListResult>(
    keys.inbox.list(queryParams),
    () => getContactMessages(queryParams),
  );

  const messages: ContactMessageItem[] = listData?.items || [];
  const selectedMessage: ContactMessageItem | null =
    messages.find((m: ContactMessageItem) => m.uuid === selectedId) ||
    (messages.length > 0 && !selectedId ? messages[0] : null);

  // Mutations
  const { mutate: updateStatus, isPending: isUpdatingStatus } = useApiMutation(
    (args: { uuid: string; status: ContactStatus }) =>
      updateContactStatus(args.uuid, args.status),
    {
      onSuccess: () => {
        toast.success("Status pesan diperbarui");
        refetchList();
        refetchStats();
      },
      onError: (err: any) => toast.error(err.message),
    },
  );

  const { mutate: sendReply, isPending: isSendingReply } = useApiMutation(
    (args: { uuid: string; text: string }) =>
      replyContactMessage(args.uuid, args.text),
    {
      onSuccess: () => {
        toast.success("Balasan berhasil dikirim ke email pengunjung!");
        setReplyText("");
        refetchList();
        refetchStats();
      },
      onError: (err: any) => toast.error(err.message),
    },
  );

  const { mutate: deleteMsg, isPending: isDeleting } = useApiMutation(
    (uuid: string) => deleteContactMessage(uuid),
    {
      onSuccess: () => {
        toast.success("Pesan berhasil dihapus");
        if (selectedId) setSelectedId(null);
        refetchList();
        refetchStats();
      },
      onError: (err: any) => toast.error(err.message),
    },
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    const timer = setTimeout(() => setDebouncedSearch(val), 300);
    return () => clearTimeout(timer);
  };

  const handleSelectMessage = (m: ContactMessageItem) => {
    setSelectedId(m.uuid);
    if (m.status === "UNREAD") {
      updateStatus({ uuid: m.uuid, status: "READ" });
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.error("Tulis pesan balasan terlebih dahulu");
      return;
    }
    sendReply({ uuid: selectedMessage.uuid, text: replyText });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
            <Link
              href="/dashboard"
              className="hover:text-secondary flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-bold">Kotak Pertanyaan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
            <Inbox className="w-7 h-7 text-secondary" />
            Kotak Pertanyaan Masuk
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Daftar pertanyaan dan pesan yang dikirim oleh pengunjung melalui
            halaman Kontak website Mexpo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              refetchList();
              refetchStats();
            }}
            disabled={isFetching}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            Segarkan
          </button>
        </div>
      </div>

      {/* ── Quick Stats Badges ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => {
            setActiveFilter("ALL");
            setPage(1);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === "ALL"
              ? "bg-secondary text-white border-secondary shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-secondary/40"
          }`}
        >
          <span className="text-xs font-medium opacity-80 block">
            Semua Pesan
          </span>
          <span className="text-2xl font-extrabold mt-1 block">
            {stats?.total ?? 0}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveFilter("UNREAD");
            setPage(1);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === "UNREAD"
              ? "bg-rose-600 text-white border-rose-600 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-rose-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium opacity-80 block">
              Belum Dibaca
            </span>
            {(stats?.unread ?? 0) > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </div>
          <span className="text-2xl font-extrabold mt-1 block text-rose-600 group-hover:text-rose-700">
            {stats?.unread ?? 0}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveFilter("REPLIED");
            setPage(1);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === "REPLIED"
              ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300"
          }`}
        >
          <span className="text-xs font-medium opacity-80 block">
            Sudah Dibalas
          </span>
          <span className="text-2xl font-extrabold mt-1 block text-emerald-600">
            {stats?.replied ?? 0}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveFilter("ARCHIVED");
            setPage(1);
          }}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeFilter === "ARCHIVED"
              ? "bg-gray-800 text-white border-gray-800 shadow-md"
              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
          }`}
        >
          <span className="text-xs font-medium opacity-80 block">Diarsipkan</span>
          <span className="text-2xl font-extrabold mt-1 block text-gray-600">
            {stats?.archived ?? 0}
          </span>
        </button>
      </div>

      {/* ── Main Split View Container ── */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* ── Left Column: Message List (5 cols) ── */}
        <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col bg-gray-50/50">
          {/* Filter & Search Bar */}
          <div className="p-4 border-b border-gray-200 space-y-3 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama, email, subjek..."
                value={search}
                onChange={handleSearchChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
              {(
                [
                  { id: "ALL", label: "Semua" },
                  { id: "UNREAD", label: "Belum Dibaca" },
                  { id: "READ", label: "Dibaca" },
                  { id: "REPLIED", label: "Dibalas" },
                  { id: "ARCHIVED", label: "Arsip" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveFilter(tab.id);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium transition-all ${
                    activeFilter === tab.id
                      ? "bg-secondary text-white font-semibold"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100 max-h-[640px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs">Memuat pesan...</span>
              </div>
            ) : messages.length > 0 ? (
              messages.map((m: ContactMessageItem) => {
                const isSelected = selectedMessage?.uuid === m.uuid;
                return (
                  <button
                    key={m.uuid}
                    onClick={() => handleSelectMessage(m)}
                    className={`w-full text-left p-4 transition-all flex flex-col gap-1.5 relative ${
                      isSelected
                        ? "bg-white shadow-sm ring-1 ring-inset ring-secondary/20"
                        : "hover:bg-white/80"
                    }`}
                  >
                    {/* Unread dot */}
                    {m.status === "UNREAD" && (
                      <span className="absolute left-1.5 top-5 w-2 h-2 rounded-full bg-rose-500" />
                    )}

                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-semibold text-xs truncate ${
                          m.status === "UNREAD"
                            ? "text-gray-900 font-bold"
                            : "text-gray-700"
                        }`}
                      >
                        {m.name}
                      </span>
                      <span className="text-[10px] text-gray-400 shrink-0">
                        {formatDate(m.created_at)}
                      </span>
                    </div>

                    <p
                      className={`text-xs truncate ${
                        m.status === "UNREAD"
                          ? "text-gray-900 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {m.subject}
                    </p>

                    <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                      {m.message}
                    </p>

                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          m.status === "UNREAD"
                            ? "bg-rose-100 text-rose-700"
                            : m.status === "REPLIED"
                            ? "bg-emerald-100 text-emerald-700"
                            : m.status === "ARCHIVED"
                            ? "bg-gray-200 text-gray-600"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {m.status === "UNREAD"
                          ? "Belum Dibaca"
                          : m.status === "REPLIED"
                          ? "Sudah Dibalas"
                          : m.status === "ARCHIVED"
                          ? "Arsip"
                          : "Dibaca"}
                      </span>
                      {m.reply_message && (
                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                          <MailCheck className="w-3 h-3" /> Ada balasan
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 text-xs">
                <Inbox className="w-8 h-8 text-gray-300 mb-2" />
                <span>Tidak ada pesan yang cocok.</span>
              </div>
            )}
          </div>

          {/* Pagination */}
          {listData && listData.totalPages > 1 && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <DataPagination
                currentPage={page}
                totalPages={listData.totalPages}
                itemsPerPage={10}
                totalItems={listData.total}
                onPageChange={setPage}
                onItemsPerPageChange={() => {}}
              />
            </div>
          )}
        </div>

        {/* ── Right Column: Message Detail & Reply Composer (7 cols) ── */}
        <div className="lg:col-span-7 flex flex-col bg-white">
          {selectedMessage ? (
            <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedMessage.subject}
                    </h2>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        selectedMessage.status === "UNREAD"
                          ? "bg-rose-100 text-rose-700"
                          : selectedMessage.status === "REPLIED"
                          ? "bg-emerald-100 text-emerald-700"
                          : selectedMessage.status === "ARCHIVED"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {selectedMessage.status === "UNREAD"
                        ? "Belum Dibaca"
                        : selectedMessage.status === "REPLIED"
                        ? "Sudah Dibalas"
                        : selectedMessage.status === "ARCHIVED"
                        ? "Arsip"
                        : "Dibaca"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="font-semibold text-gray-700 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {selectedMessage.name}
                    </span>
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-secondary hover:underline flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      {selectedMessage.email}
                    </a>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(selectedMessage.created_at)}
                    </span>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {selectedMessage.status !== "ARCHIVED" ? (
                    <button
                      onClick={() =>
                        updateStatus({
                          uuid: selectedMessage.uuid,
                          status: "ARCHIVED",
                        })
                      }
                      disabled={isUpdatingStatus}
                      className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Arsipkan Pesan"
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        updateStatus({
                          uuid: selectedMessage.uuid,
                          status: "READ",
                        })
                      }
                      disabled={isUpdatingStatus}
                      className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      title="Kembalikan dari Arsip"
                    >
                      <Inbox className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (
                        confirm(
                          "Apakah Anda yakin ingin menghapus pesan ini secara permanen?",
                        )
                      ) {
                        deleteMsg(selectedMessage.uuid);
                      }
                    }}
                    disabled={isDeleting}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                    title="Hapus Pesan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message Content */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Isi Pertanyaan Pengunjung:
                </h3>
                <div className="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Previous Reply If Exists */}
              {selectedMessage.reply_message && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Tanggapan Email yang Telah Dikirim:
                    </h3>
                    <span className="text-[11px] text-gray-400">
                      Dibalas: {formatDate(selectedMessage.replied_at)}
                      {selectedMessage.replier?.full_name
                        ? ` oleh ${selectedMessage.replier.full_name}`
                        : ""}
                    </span>
                  </div>
                  <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedMessage.reply_message}
                  </div>
                </div>
              )}

              {/* Direct Reply Form */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                  <CornerDownLeft className="w-4 h-4 text-secondary" />
                  <span>
                    {selectedMessage.reply_message
                      ? "Kirim Balasan Tambahan ke Pengunjung"
                      : `Balas Langsung ke ${selectedMessage.email}`}
                  </span>
                </div>

                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Ketik tanggapan Anda di sini... (Pesan ini akan otomatis dikirimkan ke alamat email pengunjung)"
                    className="w-full rounded-2xl border border-gray-200 p-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all resize-y"
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-gray-400">
                      Balasan dikirim via SMTP resmi Mexpo ke{" "}
                      <strong>{selectedMessage.email}</strong>
                    </p>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSendingReply || !replyText.trim()}
                      className="px-5 py-2 text-xs font-bold flex items-center gap-2"
                    >
                      {isSendingReply ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Kirim Balasan Email
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-gray-400 space-y-3">
              <MailQuestion className="w-12 h-12 text-gray-300" />
              <p className="font-semibold text-gray-700 text-base">
                Pilih Pesan untuk Membaca
              </p>
              <p className="text-xs text-gray-400 max-w-sm">
                Pilih salah satu pesan di kolom kiri untuk melihat rincian
                pertanyaan dan mengirimkan balasan langsung ke email pengunjung.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
