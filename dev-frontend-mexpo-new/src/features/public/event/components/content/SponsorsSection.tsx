"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Award } from "lucide-react";
import { EventSponsor } from "@/entities/event/sponsor.entity";
import ContentTitle2 from "@/shared/components/ui/ContentTitle2";
import SearchBar from "@/shared/components/form/SearchBar";
import { DataPagination } from "@/shared/components/ui/DataPagination";

interface SponsorsSectionProps {
  sponsors?: EventSponsor[];
}

export default function SponsorsSection({ sponsors = [] }: SponsorsSectionProps) {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"name_asc" | "name_desc">("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // If there are no sponsors registered for this event, do not render a fake sponsor grid!
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  // Extract unique levels
  const levels = Array.from(
    new Set(sponsors.map((s) => s.level).filter(Boolean) as string[])
  ).sort();

  const filteredSponsors = sponsors
    .filter((sp) => {
      const q = search.toLowerCase();
      const matchSearch =
        sp.name.toLowerCase().includes(q) ||
        (sp.level && sp.level.toLowerCase().includes(q));

      const matchLevel = selectedLevel === "ALL" || sp.level === selectedLevel;
      return matchSearch && matchLevel;
    })
    .sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return 0;
    });

  const totalItems = filteredSponsors.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pagedSponsors = filteredSponsors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section id="sponsor" className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <ContentTitle2
              category="Sponsor & Partner"
              title="Didukung Oleh"
            />
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-secondary border border-blue-100 self-start sm:self-auto">
              Total: {totalItems} Mitra
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex-1">
              <SearchBar
                search={search}
                setSearch={(val) => { setSearch(val); setCurrentPage(1); }}
                placeholder="Cari sponsor atau partner..."
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
                <option value="name_asc">Nama: A - Z</option>
                <option value="name_desc">Nama: Z - A</option>
              </select>
            </div>
          </div>

          {levels.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => { setSelectedLevel("ALL"); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedLevel === "ALL"
                    ? "bg-secondary text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Semua Level ({sponsors.length})
              </button>
              {levels.map((lvl) => {
                const count = sponsors.filter((s) => s.level === lvl).length;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => { setSelectedLevel(lvl); setCurrentPage(1); }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedLevel === lvl
                        ? "bg-secondary text-white shadow-xs"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {lvl} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {pagedSponsors.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 items-center">
              {pagedSponsors.map((sp, index) => (
                <div
                  key={sp.uuid || index}
                  className="bg-white rounded-xl border border-gray-100 p-4 h-24 flex flex-col items-center justify-center shadow-2xs hover:shadow-sm hover:border-gray-200 transition-all group relative"
                  title={sp.name}
                >
                  <div className="relative w-full h-10">
                    <Image
                      src={sp.logo || "/images/brand/brand-01.svg"}
                      alt={sp.name}
                      fill
                      className="object-contain filter grayscale group-hover:grayscale-0 transition-all opacity-75 group-hover:opacity-100"
                    />
                  </div>
                  {sp.level && (
                    <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-wider truncate max-w-full">
                      {sp.level}
                    </span>
                  )}
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
                pageSizeOptions={[6, 12, 24]}
              />
            )}
          </div>
        ) : (
          <div className="py-12 px-6 rounded-2xl border border-gray-100 bg-gray-50/50 text-center max-w-xl mx-auto">
            <Award className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Tidak Ada Sponsor Ditemukan</p>
            <p className="text-xs text-gray-400 mt-1">
              Coba ubah kata kunci pencarian atau ganti filter level di atas.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
