"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Landmark, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

import SearchBar from "@/shared/components/form/SearchBar";
import { DataPagination } from "@/shared/components/ui/DataPagination";
import { useAuthStore } from "@/stores/auth.store";
import { Event } from "@/entities/event/event.entity";
import { formatDateRange } from "@/shared/utils/format";
import { getAllEvents } from "@/services/event.service";
import { useList } from "@/shared/hooks/useList";
import PageHeader from "@/shared/components/ui/PageHeader";
import PageShell from "@/shared/components/ui/PageShell";

export default function SettlementList() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"REQUESTED" | "SETTLED" | "ALL">("REQUESTED");

  const isSuperAdmin = user?.role === "SUPERADMIN";
  const list = useList<Event>((q) => getAllEvents(q), [isSuperAdmin]);

  if (!isSuperAdmin) {
    return (
      <PageShell className="py-12 text-center">
        <p className="text-gray-500">
          Halaman ini khusus Super Admin. Anda tidak memiliki akses.
        </p>
      </PageShell>
    );
  }

  // Filter events based on committee request status:
  // "Settlement muncul di superadmin jika sudah dibuka oleh committe"
  const filteredEvents = list.items.filter((event) => {
    const isRequested = Boolean((event.features as any)?.settlement_requested);
    const hasAccount = Boolean(event.payout_account_number);
    const isSettled = event.payout_status === "SETTLED";

    if (activeTab === "REQUESTED") {
      return (isRequested || (hasAccount && event.ticket_mode === "PAID")) && !isSettled;
    }
    if (activeTab === "SETTLED") {
      return isSettled;
    }
    // "ALL" shows events where committee submitted or that are settled
    return isRequested || hasAccount || isSettled;
  });

  return (
    <PageShell className="py-10">
      <PageHeader
        title="Daftar Settlement & Payout"
        subtitle="Kelola pencairan dana tiket event yang telah dibuka & diajukan oleh panitia."
      />

      {/* Filter Tabs & Search */}
      <div className="space-y-4 mb-6">
        <div className="flex border-b border-gray-200 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("REQUESTED")}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "REQUESTED"
                ? "border-secondary text-secondary"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Menunggu Transfer Superadmin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("SETTLED")}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "SETTLED"
                ? "border-secondary text-secondary"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Selesai Ditransfer (Settled)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ALL")}
            className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "ALL"
                ? "border-secondary text-secondary"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Semua Pengajuan
          </button>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <SearchBar
            search={list.search}
            setSearch={list.applySearch}
            placeholder="Cari event atau nama panitia..."
          />
        </div>
      </div>

      {list.loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 text-secondary animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white p-12 border border-gray-100 rounded-2xl text-center max-w-xl mx-auto space-y-2">
          <Landmark className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-gray-800">
            {activeTab === "REQUESTED"
              ? "Tidak Ada Permohonan Settlement Menunggu"
              : "Tidak Ada Data Settlement"}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {activeTab === "REQUESTED"
              ? "Settlement hanya akan muncul di antrean ini setelah panitia event mengisi formulir rekening payout dan mengklik tombol 'Buka & Ajukan Settlement'."
              : "Belum ada riwayat permohonan settlement yang cocok dengan kriteria filter."}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {filteredEvents.map((event) => {
              const isSettled = event.payout_status === "SETTLED";
              const hasBank = Boolean(event.payout_bank_name && event.payout_account_number);

              return (
                <div
                  key={event.uuid}
                  className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 bg-white p-5 border border-gray-100 rounded-2xl hover:border-gray-200 transition-all shadow-2xs"
                >
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900 text-base truncate">
                        {event.name}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isSettled
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {isSettled ? "Settled" : "Menunggu Transfer"}
                      </span>
                    </div>

                    <p className="text-gray-500 text-xs">
                      Penyelenggara: <strong>{event.organizer_name || "Panitia"}</strong> · Pelaksanaan:{" "}
                      {formatDateRange(event.start_date, event.end_date)}
                    </p>

                    {/* Rekening Tujuan yang diisi Panitia */}
                    {hasBank ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700">
                        <Landmark className="w-3.5 h-3.5 text-secondary" />
                        <span>
                          Rekening Panitia: <strong>{event.payout_bank_name}</strong> -{" "}
                          <span className="font-mono">{event.payout_account_number}</span> (a.n.{" "}
                          {event.payout_account_holder})
                        </span>
                      </div>
                    ) : (
                      <p className="text-xs text-amber-600 font-medium">
                        Rekening bank belum dilengkapi oleh panitia
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/dashboard/${event.uuid}/settlement`}
                      className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/90 px-4 py-2 rounded-xl font-semibold text-white text-xs transition-colors shadow-xs"
                    >
                      {isSettled ? "Lihat Bukti Transfer" : "Proses Settlement"} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <DataPagination
              currentPage={list.page}
              totalPages={list.totalPages}
              itemsPerPage={list.pageSize}
              totalItems={filteredEvents.length}
              onPageChange={list.setPage}
              onItemsPerPageChange={(size) => {
                list.setPageSize(size);
                list.setPage(1);
              }}
            />
          </div>
        </>
      )}
    </PageShell>
  );
}
