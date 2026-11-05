"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Users, Search, Calendar, MapPin, Clock, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import { EventSpeaker } from "@/entities/event/speaker.entity";
import ContentTitle2 from "@/shared/components/ui/ContentTitle2";
import SearchBar from "@/shared/components/form/SearchBar";
import { DataPagination } from "@/shared/components/ui/DataPagination";
import { Modal } from "@/shared/components/ui/Modal";

interface SpeakersSectionProps {
  speakers?: EventSpeaker[];
}

function parseSpeakerDetails(speaker: EventSpeaker) {
  const bio = speaker.bio?.trim() || "";

  // Split by newline
  const lines = bio.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 2) {
    const role = lines[0];
    const topic = lines.length > 2 ? lines[1] : "Narasumber";
    return {
      role: role.length <= 60 ? role : "Narasumber & Praktisi",
      topic: topic.length <= 40 ? topic : "Inovasi & Teknologi",
      fullBio: bio,
    };
  }

  // Split by dash or pipe or bullet
  const parts = bio.split(/\s*[-|•]\s*/).map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      role: parts[0],
      topic: parts[1],
      fullBio: bio,
    };
  }

  return {
    role: bio.length > 0 && bio.length < 50 ? bio : "Narasumber & Praktisi",
    topic: "Event Speaker",
    fullBio: bio || "Praktisi dan narasumber berpengalaman di bidangnya yang hadir untuk berbagi wawasan dan studi kasus terkini.",
  };
}

export default function SpeakersSection({ speakers = [] }: SpeakersSectionProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name_asc" | "name_desc">("name_asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedSpeaker, setSelectedSpeaker] = useState<EventSpeaker | null>(null);

  const filteredSpeakers = useMemo(() => {
    let result = [...speakers];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.bio && s.bio.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [speakers, search, sortBy]);

  const totalItems = filteredSpeakers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pagedSpeakers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSpeakers.slice(start, start + itemsPerPage);
  }, [filteredSpeakers, currentPage, itemsPerPage]);

  const hasSpeakers = speakers && speakers.length > 0;
  const activeDetails = selectedSpeaker ? parseSpeakerDetails(selectedSpeaker) : null;

  return (
    <section id="pembicara" className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <ContentTitle2
              category="Pembicara"
              title="Pembicara Utama"
            />
            {hasSpeakers && (
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-secondary border border-blue-100 self-start sm:self-auto">
                Total: {totalItems} Pembicara
              </span>
            )}
          </div>

          {hasSpeakers && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <SearchBar
                  search={search}
                  setSearch={(val) => {
                    setSearch(val);
                    setCurrentPage(1);
                  }}
                  placeholder="Cari pembicara berdasarkan nama, peran, atau topik..."
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
                  className="px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-secondary transition-colors"
                >
                  <option value="name_asc">Nama: A - Z</option>
                  <option value="name_desc">Nama: Z - A</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        {hasSpeakers ? (
          pagedSpeakers.length > 0 ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {pagedSpeakers.map((speaker, index) => {
                  const details = parseSpeakerDetails(speaker);
                  const linkedWorkshops = speaker.workshopSpeakers || [];
                  const linkedRundowns = speaker.eventRundownSpeakers || [];
                  const totalSessions = linkedWorkshops.length + linkedRundowns.length;

                  return (
                    <div
                      key={speaker.uuid || index}
                      onClick={() => setSelectedSpeaker(speaker)}
                      className="bg-white rounded-3xl border border-gray-100/90 p-6 shadow-2xs hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer relative"
                    >
                      {/* Avatar */}
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gray-50 border-4 border-blue-50/80 group-hover:border-blue-100 transition-colors shadow-sm mb-4 shrink-0">
                        <Image
                          src={speaker.photo || `/images/user/user-01.jpg`}
                          alt={speaker.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Speaker Identity */}
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-secondary transition-colors line-clamp-1 w-full">
                        {speaker.name}
                      </h3>

                      <p className="text-gray-500 text-xs sm:text-sm font-medium mt-1 line-clamp-1 w-full">
                        {details.role}
                      </p>

                      {/* Topic Pill */}
                      <div className="mt-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-secondary border border-blue-100/80">
                          <Sparkles className="w-3 h-3 shrink-0" />
                          <span className="truncate max-w-[170px]">{details.topic}</span>
                        </span>
                      </div>

                      {/* Short Bio Snippet */}
                      <p className="text-gray-500 text-xs mt-3 line-clamp-2 leading-relaxed text-center px-1">
                        {details.fullBio}
                      </p>

                      {/* Associated Sessions / Indicator */}
                      <div className="mt-4 pt-3 border-t border-gray-50 w-full flex items-center justify-between text-xs text-gray-400 group-hover:text-secondary transition-colors">
                        <span className="text-[11px] font-medium text-gray-400">
                          {totalSessions > 0 ? `${totalSessions} Sesi Terkait` : "Profil Lengkap"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary">
                          Lihat Detail
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                  pageSizeOptions={[4, 8, 12, 16]}
                />
              )}
            </div>
          ) : (
            <div className="py-14 px-6 rounded-3xl border border-gray-100 bg-gray-50/50 text-center max-w-xl mx-auto">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-800">Tidak Ada Pembicara Ditemukan</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Kata kunci &ldquo;{search}&rdquo; tidak cocok dengan daftar nama atau topik pembicara.
              </p>
            </div>
          )
        ) : (
          <div className="py-14 px-6 rounded-3xl border border-gray-100 bg-gray-50/50 text-center max-w-xl mx-auto">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-800">Belum Ada Pembicara Terdaftar</p>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Daftar pembicara resmi untuk event ini akan segera diumumkan oleh pihak penyelenggara.
            </p>
          </div>
        )}
      </div>

      {/* Speaker Full Profile Modal */}
      {selectedSpeaker && activeDetails && (
        <Modal
          isOpen={!!selectedSpeaker}
          onClose={() => setSelectedSpeaker(null)}
          title="Profil Pembicara"
          subtitle="Informasi lengkap dan agenda sesi narasumber"
          maxWidth="max-w-xl"
        >
          <div className="p-6 space-y-6">
            {/* Top Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-xs shrink-0">
                <Image
                  src={selectedSpeaker.photo || `/images/user/user-01.jpg`}
                  alt={selectedSpeaker.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg sm:text-xl font-outfit">
                  {selectedSpeaker.name}
                </h3>
                <p className="text-sm text-gray-600 font-medium">{activeDetails.role}</p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-secondary border border-blue-100">
                    <Sparkles className="w-3.5 h-3.5" />
                    {activeDetails.topic}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Tentang &amp; Pengalaman
              </h4>
              <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {activeDetails.fullBio}
              </div>
            </div>

            {/* Linked Sessions (Workshops / Rundowns) */}
            {((selectedSpeaker.workshopSpeakers && selectedSpeaker.workshopSpeakers.length > 0) ||
              (selectedSpeaker.eventRundownSpeakers && selectedSpeaker.eventRundownSpeakers.length > 0)) && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Sesi &amp; Lokakarya yang Dibawakan
                </h4>
                <div className="space-y-2.5">
                  {selectedSpeaker.workshopSpeakers?.map((ws, i) => (
                    <div
                      key={ws.uuid || i}
                      className="p-3.5 rounded-xl border border-blue-100 bg-blue-50/40 flex items-start gap-3"
                    >
                      <BookOpen className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary text-white uppercase">
                            Workshop
                          </span>
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {ws.workshop?.title || "Workshop Sesi"}
                          </span>
                        </div>
                        {(ws.workshop?.location || ws.workshop?.start_time) && (
                          <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
                            {ws.workshop.location && (
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {ws.workshop.location}
                              </span>
                            )}
                            {ws.workshop.start_time && (
                              <span className="inline-flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                {ws.workshop.start_time} - {ws.workshop.end_time || ""}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {selectedSpeaker.eventRundownSpeakers?.map((rs, i) => (
                    <div
                      key={rs.uuid || i}
                      className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 flex items-start gap-3"
                    >
                      <Calendar className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 uppercase">
                            Agenda
                          </span>
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {rs.event_rundown?.title || "Sesi Rundown"}
                          </span>
                        </div>
                        {rs.event_rundown?.start_time && (
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {rs.event_rundown.start_time} - {rs.event_rundown.end_time || ""}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </section>
  );
}
