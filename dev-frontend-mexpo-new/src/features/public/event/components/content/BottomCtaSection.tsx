"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Event } from "@/entities/event/event.entity";

interface BottomCtaSectionProps {
  eventData: Event;
}

export default function BottomCtaSection({ eventData }: BottomCtaSectionProps) {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F3F7FF] border border-blue-100 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">
                Tertarik mengikuti {eventData.name}?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Daftar sekarang dan jadilah bagian dari rangkaian pameran serta seminar inovasi terbesar kami.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href={`/event/${eventData.uuid}/register`}
                className="inline-flex items-center gap-2 bg-secondary hover:bg-brand-600 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all group"
              >
                <span>Daftar Sekarang</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

