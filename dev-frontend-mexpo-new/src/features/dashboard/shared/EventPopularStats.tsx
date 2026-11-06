"use client";

import React from "react";
import { useApiQuery } from "@/lib/hooks/useApi";
import { keys } from "@/lib/query-keys";
import {
  getAmountBoothReport,
  getBoothReport,
  AmountReportRow,
  BoothReportRow,
} from "@/services/report.service";
import { getWorkshops } from "@/services/workshop.service";
import { Workshop } from "@/entities/event/workshop.entity";

interface EventPopularStatsProps {
  eventId: string;
}

function formatIDR(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function EventPopularStats({ eventId }: EventPopularStatsProps) {
  const { data: amountBoothData, isLoading: loadingAmount } = useApiQuery<AmountReportRow[]>(
    keys.reports.range(eventId, "amount-booth"),
    async () => {
      const res = await getAmountBoothReport(eventId);
      return res.data;
    },
    { staleTime: 60 * 1000 }
  );

  const { data: attendanceBoothData } = useApiQuery<BoothReportRow[]>(
    keys.reports.range(eventId, "booth-attendance"),
    async () => {
      const res = await getBoothReport(eventId);
      return res.data;
    },
    { staleTime: 60 * 1000 }
  );

  const { data: workshopsData, isLoading: loadingWorkshops } = useApiQuery<Workshop[]>(
    keys.workshops.all(eventId),
    async () => {
      const res = await getWorkshops(eventId);
      return res.data;
    },
    { staleTime: 60 * 1000 }
  );

  const attendanceMap = React.useMemo(() => {
    const map = new Map<string, number>();
    (attendanceBoothData || []).forEach((b) => {
      map.set(b.uuid, b.counts);
    });
    return map;
  }, [attendanceBoothData]);

  const rankedBooths = React.useMemo(() => {
    if (!amountBoothData || amountBoothData.length === 0) return [];
    return [...amountBoothData]
      .sort((a, b) => b.amount - a.amount || b.count_transaction - a.count_transaction)
      .slice(0, 5);
  }, [amountBoothData]);

  const totalEventBoothOmzet = React.useMemo(() => {
    return (amountBoothData || []).reduce((acc, b) => acc + (b.amount || 0), 0);
  }, [amountBoothData]);

  const rankedWorkshops = React.useMemo(() => {
    if (!workshopsData || workshopsData.length === 0) return [];
    return [...workshopsData]
      .map((w) => {
        const bookings = w.workshopBookings || [];
        const registered = bookings.length;
        const checkedIn = bookings.filter((b) => b.status === "CHECKED_IN").length;
        const attendanceRate = registered > 0 ? Math.round((checkedIn / registered) * 100) : 0;
        return {
          ...w,
          registeredCount: registered,
          checkedInCount: checkedIn,
          attendanceRate,
        };
      })
      .sort(
        (a, b) =>
          b.checkedInCount - a.checkedInCount ||
          b.registeredCount - a.registeredCount ||
          b.attendanceRate - a.attendanceRate
      )
      .slice(0, 5);
  }, [workshopsData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-6">
      {/* ── CARD 1: Booth Terlaris ── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              Booth Terlaris
            </h3>
            <p className="text-xs text-gray-500">
              Peringkat tenant berdasarkan omzet transaksi
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-secondary">
              {formatIDR(totalEventBoothOmzet)}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {loadingAmount ? (
            <p className="py-8 text-center text-xs text-gray-400">
              Memuat data booth...
            </p>
          ) : rankedBooths.length === 0 ? (
            <p className="py-8 text-center text-xs text-gray-400">
              Belum ada transaksi tenant yang tercatat.
            </p>
          ) : (
            rankedBooths.map((booth, idx) => {
              const visitorCount = attendanceMap.get(booth.uuid) || 0;
              const percentage =
                totalEventBoothOmzet > 0
                  ? Math.round((booth.amount / totalEventBoothOmzet) * 100)
                  : 0;

              return (
                <div
                  key={booth.uuid}
                  className="p-3 rounded-xl bg-gray-50/70 hover:bg-gray-50 border border-gray-100 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-white border border-gray-200 text-gray-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {booth.name}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {booth.booth_number ? `Booth ${booth.booth_number} • ` : ""}
                          {booth.count_transaction} transaksi
                          {visitorCount > 0 ? ` • ${visitorCount} pengunjung` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-gray-900 font-mono">
                        {formatIDR(booth.amount)}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {percentage}% dari total
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200/70 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-secondary h-1 rounded-full"
                      style={{ width: `${Math.max(percentage, 4)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── CARD 2: Workshop Sering Dikunjungi ── */}
      <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">
              Workshop Terpopuler
            </h3>
            <p className="text-xs text-gray-500">
              Sesi dengan kehadiran (check-in) terbanyak
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">
              {workshopsData?.length || 0} sesi
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {loadingWorkshops ? (
            <p className="py-8 text-center text-xs text-gray-400">
              Memuat data workshop...
            </p>
          ) : rankedWorkshops.length === 0 ? (
            <p className="py-8 text-center text-xs text-gray-400">
              Belum ada data workshop terdaftar.
            </p>
          ) : (
            rankedWorkshops.map((ws, idx) => {
              const speakerName = ws.workshopSpeakers?.[0]?.event_speaker?.name;

              return (
                <div
                  key={ws.uuid}
                  className="p-3 rounded-xl bg-gray-50/70 hover:bg-gray-50 border border-gray-100 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded-md bg-white border border-gray-200 text-gray-600 font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {ws.title}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">
                          {ws.location ? `${ws.location} ` : ""}
                          {speakerName ? `• ${speakerName}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-bold text-secondary">
                        {ws.checkedInCount} hadir
                      </p>
                      <p className="text-[10px] text-gray-400">
                        dari {ws.registeredCount} peserta ({ws.attendanceRate}%)
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200/70 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-secondary h-1 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(ws.attendanceRate, ws.registeredCount > 0 ? 8 : 0)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
