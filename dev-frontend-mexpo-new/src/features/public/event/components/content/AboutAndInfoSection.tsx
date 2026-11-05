"use client";

import React from "react";
import { Calendar, Clock, MapPin, Building, Tag, Info, ArrowRight } from "lucide-react";
import { Event } from "@/entities/event/event.entity";
import { dateFormat } from "@/shared/utils/format";
import ContentTitle2 from "@/shared/components/ui/ContentTitle2";

interface AboutAndInfoSectionProps {
  eventData: Event;
}

export default function AboutAndInfoSection({ eventData }: AboutAndInfoSectionProps) {
  const isPaid = eventData.ticket_mode === "PAID";
  const costLabel = isPaid ? "Berbayar" : "Gratis";

  return (
    <section id="informasi" className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Description & Narrative */}
          <div className="lg:col-span-7 space-y-5">
            <ContentTitle2
              category="Tentang Event"
              title={`Tentang ${eventData.name}`}
            />

            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p className="whitespace-pre-line">
                {eventData.description}
              </p>
            </div>

            <div className="pt-2">
              <a
                href="#agenda"
                className="inline-flex items-center gap-2 text-secondary hover:text-brand-600 font-bold text-sm group transition-colors"
              >
                <span>Lihat Jadwal Agenda</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* Right Column: Structured Quick Specs Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-7 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-secondary flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Informasi Event</h3>
                  <p className="text-xs text-gray-400">Ringkasan jadwal dan lokasi pelaksanaan</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                {/* Tanggal */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-gray-500">
                    <Calendar className="w-4 h-4 text-secondary shrink-0" />
                    <span>Tanggal</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-right">
                    {dateFormat(eventData.start_date)}
                    {eventData.end_date && eventData.end_date !== eventData.start_date
                      ? ` – ${dateFormat(eventData.end_date)}`
                      : ""}
                  </span>
                </div>

                {/* Lokasi */}
                {eventData.location && (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <MapPin className="w-4 h-4 text-secondary shrink-0" />
                      <span>Lokasi</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-right max-w-[240px]">
                      {eventData.location}
                    </span>
                  </div>
                )}

                {/* Penyelenggara */}
                {eventData.organizer_name && (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-gray-500">
                      <Building className="w-4 h-4 text-secondary shrink-0" />
                      <span>Penyelenggara</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-right max-w-[240px]">
                      {eventData.organizer_name}
                    </span>
                  </div>
                )}

              
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
