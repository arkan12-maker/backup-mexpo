"use client";

import React, { useState, useMemo } from "react";
import { Clock } from "lucide-react";
import { EventRundown } from "@/entities/event/rundown.entity";
import { formatTime, formatTabDate, formatDateWithDay, getDayName } from "@/shared/utils/format";
import ContentTitle2 from "@/shared/components/ui/ContentTitle2";
import SearchBar from "@/shared/components/form/SearchBar";
import { DataPagination } from "@/shared/components/ui/DataPagination";

interface AgendaSectionProps {
  rundown?: EventRundown[];
}

export default function AgendaSection({ rundown = [] }: AgendaSectionProps) {
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"time_asc" | "time_desc" | "title_asc">("time_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Extract unique days
  const availableDays = useMemo(() => {
    const set = new Set<string>();
    rundown.forEach((item) => {
      if (item.start_time) {
        set.add(item.start_time.split("T")[0]);
      }
    });
    return Array.from(set).sort();
  }, [rundown]);

  const filteredRundown = useMemo(() => {
    let result = [...rundown];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          (item.description && item.description.toLowerCase().includes(q))
      );
    }

    if (selectedDay !== "ALL") {
      result = result.filter(
        (item) => item.start_time && item.start_time.split("T")[0] === selectedDay
      );
    }

    result.sort((a, b) => {
      if (sortBy === "time_asc") {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      }
      if (sortBy === "time_desc") {
        return new Date(b.start_time).getTime() - new Date(a.start_time).getTime();
      }
      if (sortBy === "title_asc") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [rundown, search, selectedDay, sortBy]);

  const totalItems = filteredRundown.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pagedRundown = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRundown.slice(start, start + itemsPerPage);
  }, [filteredRundown, currentPage, itemsPerPage]);

  const hasRundown = rundown && rundown.length > 0;

  return (
    <section id="agenda" className="py-12 sm:py-16 bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <ContentTitle2
              category="Agenda"
              title="Agenda & Rundown Event"
            />
            {hasRundown && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-secondary border border-blue-100 self-start sm:self-auto">
                Total: {totalItems} Sesi
              </span>
            )}
          </div>

          {hasRundown && (
            <>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <SearchBar
                    search={search}
                    setSearch={(val) => { setSearch(val); setCurrentPage(1); }}
                    placeholder="Cari jadwal atau sesi acara..."
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-secondary transition-colors"
                  >
                    <option value="time_asc">Waktu: Paling Awal</option>
                    <option value="time_desc">Waktu: Paling Akhir</option>
                    <option value="title_asc">Judul: A - Z</option>
                  </select>
                </div>
              </div>

              {availableDays.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <button
                    type="button"
                    onClick={() => { setSelectedDay("ALL"); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedDay === "ALL"
                        ? "bg-secondary text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Semua Hari ({rundown.length})
                  </button>
                  {availableDays.map((dayStr, idx) => (
                    <button
                      key={dayStr}
                      type="button"
                      onClick={() => { setSelectedDay(dayStr); setCurrentPage(1); }}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        selectedDay === dayStr
                          ? "bg-secondary text-white shadow-xs"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Hari {idx + 1} ({formatTabDate(dayStr)})
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {hasRundown ? (
          pagedRundown.length > 0 ? (
            <div className="space-y-6">
              <div className="max-w-3xl space-y-6 pt-2">
                {pagedRundown.map((item, index) => (
                  <div key={item.uuid || index} className="flex gap-4 sm:gap-6 group">
                    {/* Time Column */}
                    <div className="w-28 sm:w-36 shrink-0 pt-0.5">
                      <span className="font-bold text-xs sm:text-sm text-gray-900 group-hover:text-secondary transition-colors">
                        {formatTime(item.start_time)} – {formatTime(item.end_time)}
                      </span>
                    </div>

                    {/* Timeline Dot & Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-secondary ring-4 ring-blue-100 shrink-0" />
                      {index !== pagedRundown.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-1 min-h-[40px]" />
                      )}
                    </div>

                    {/* Content Column */}
                    <div className="pb-6 space-y-1">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {totalItems > itemsPerPage && (
                <DataPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(size) => {
                    setItemsPerPage(size);
                    setCurrentPage(1);
                  }}
                  pageSizeOptions={[6, 10, 20]}
                />
              )}
            </div>
          ) : (
            <div className="py-12 px-6 rounded-2xl border border-gray-100 bg-gray-50/50 text-center max-w-xl mx-auto">
              <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-700">Tidak Ada Jadwal Ditemukan</p>
              <p className="text-xs text-gray-400 mt-1">
                Coba ubah kata kunci pencarian atau ganti filter hari di atas.
              </p>
            </div>
          )
        ) : (
          <div className="py-12 px-6 rounded-2xl border border-gray-100 bg-gray-50/50 text-center max-w-xl">
            <Clock className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Belum Ada Agenda</p>
            <p className="text-xs text-gray-400 mt-1">
              Rundown kegiatan untuk event ini belum dipublikasikan oleh panitia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
