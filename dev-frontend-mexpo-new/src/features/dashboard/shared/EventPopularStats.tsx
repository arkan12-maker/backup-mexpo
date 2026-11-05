"use client";

import React from "react";
import {
  Store,
  BookOpen,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
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
import { formatTime } from "@/shared/utils/format";

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
  // 1. Fetch Booth reports
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

  // 2. Fetch Workshops
  const { data: workshopsData, isLoading: loadingWorkshops } = useApiQuery<Workshop[]>(
    keys.workshops.all(eventId),
    async () => {
      const res = await getWorkshops(eventId);
      return res.data;
    },
    { staleTime: 60 * 1000 }
  );

  // Combine booth attendance counts map
  const attendanceMap = React.useMemo(() => {
    const map = new Map<string, number>();
    (attendanceBoothData || []).forEach((b) => {
      map.set(b.uuid, b.counts);
    });
    return map;
  }, [attendanceBoothData]);

  // Ranked booths by omzet (revenue) or transaction count
  const rankedBooths = React.useMemo(() => {
    if (!amountBoothData || amountBoothData.length === 0) return [];
    return [...amountBoothData]
      .sort((a, b) => b.amount - a.amount || b.count_transaction - a.count_transaction)
      .slice(0, 5);
  }, [amountBoothData]);

  const totalEventBoothOmzet = React.useMemo(() => {
    return (amountBoothData || []).reduce((acc, b) => acc + (b.amount || 0), 0);
  }, [amountBoothData]);

  // Ranked workshops by attendees checked in / booked
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* ── CARD 1: Booth Terlaris ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Store className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <span>Booth Terlaris</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Top 5 Omzet
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Peringkat tenant berdasarkan omzet &amp; frekuensi transaksi
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Omzet</p>
              <p className="text-xs font-extrabold text-amber-700 font-outfit">
                {formatIDR(totalEventBoothOmzet)}
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {loadingAmount ? (
              <div className="py-10 text-center text-xs text-gray-400">
                Memuat data statistik booth...
              </div>
            ) : rankedBooths.length === 0 ? (
              <div className="py-10 text-center text-xs text-gray-400 space-y-2">
                <Store className="w-8 h-8 text-gray-300 mx-auto" />
                <p>Belum ada transaksi tenant yang tercatat untuk event ini.</p>
              </div>
            ) : (
              rankedBooths.map((booth, idx) => {
                const visitorCount = attendanceMap.get(booth.uuid) || 0;
                const percentage =
                  totalEventBoothOmzet > 0
                    ? Math.round((booth.amount / totalEventBoothOmzet) * 100)
                    : 0;

                const medalColors = [
                  "bg-amber-100 text-amber-800 border-amber-300",
                  "bg-slate-100 text-slate-800 border-slate-300",
                  "bg-amber-50 text-amber-700 border-amber-200",
                  "bg-gray-50 text-gray-600 border-gray-200",
                  "bg-gray-50 text-gray-600 border-gray-200",
                ];

                return (
                  <div
                    key={booth.uuid}
                    className="p-3.5 rounded-2xl bg-gray-50/70 hover:bg-gray-50 border border-gray-100 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${
                            medalColors[idx] || "bg-gray-50 text-gray-600"
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-gray-900 truncate">
                            {booth.name}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate">
                            {booth.booth_number ? `Nomor: ${booth.booth_number}` : "Tenant Terverifikasi"}{" "}
                            • {booth.count_transaction}x Transaksi
                            {visitorCount > 0 && ` • ${visitorCount} Pengunjung`}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-gray-900 font-outfit">
                          {formatIDR(booth.amount)}
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          {percentage}% dari omzet
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-gray-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-2 text-right">
          <span className="text-[11px] text-gray-400 font-medium">
            Data terakumulasi dari seluruh transaksi kasir POS tenant
          </span>
        </div>
      </div>

      {/* ── CARD 2: Workshop Sering Dikunjungi ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <span>Workshop Sering Dikunjungi</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Terpopuler
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Lokakarya dengan peserta hadir (check-in) dan minat terbanyak
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Workshop</p>
              <p className="text-xs font-extrabold text-secondary font-outfit">
                {workshopsData?.length || 0} Sesi
              </p>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            {loadingWorkshops ? (
              <div className="py-10 text-center text-xs text-gray-400">
                Memuat data statistik workshop...
              </div>
            ) : rankedWorkshops.length === 0 ? (
              <div className="py-10 text-center text-xs text-gray-400 space-y-2">
                <BookOpen className="w-8 h-8 text-gray-300 mx-auto" />
                <p>Belum ada sesi workshop yang terdaftar pada event ini.</p>
              </div>
            ) : (
              rankedWorkshops.map((ws, idx) => {
                const speakerName = ws.workshopSpeakers?.[0]?.event_speaker?.name;
                const medalColors = [
                  "bg-blue-100 text-blue-800 border-blue-300",
                  "bg-slate-100 text-slate-800 border-slate-300",
                  "bg-blue-50 text-blue-700 border-blue-200",
                  "bg-gray-50 text-gray-600 border-gray-200",
                  "bg-gray-50 text-gray-600 border-gray-200",
                ];

                return (
                  <div
                    key={ws.uuid}
                    className="p-3.5 rounded-2xl bg-gray-50/70 hover:bg-gray-50 border border-gray-100 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-xl border flex items-center justify-center font-black text-xs shrink-0 ${
                            medalColors[idx] || "bg-gray-50 text-gray-600"
                          }`}
                        >
                          #{idx + 1}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-gray-900 truncate">
                            {ws.title}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate flex items-center gap-1.5">
                            {ws.location && (
                              <span className="inline-flex items-center gap-0.5">
                                <MapPin className="w-3 h-3" /> {ws.location}
                              </span>
                            )}
                            {speakerName && <span>• {speakerName}</span>}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-extrabold text-secondary font-outfit">
                          {ws.checkedInCount} Hadir
                        </p>
                        <p className="text-[10px] text-gray-400 font-medium">
                          dari {ws.registeredCount} pendaftar ({ws.attendanceRate}%)
                        </p>
                      </div>
                    </div>

                    {/* Progress bar of attendance rate */}
                    <div className="w-full bg-gray-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-secondary h-1.5 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(ws.attendanceRate, ws.registeredCount > 0 ? 10 : 0)
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

        <div className="pt-2 text-right">
          <span className="text-[11px] text-gray-400 font-medium">
            Diperbarui secara real-time berdasarkan scan check-in pintu lokakarya
          </span>
        </div>
      </div>
    </div>
  );
}

