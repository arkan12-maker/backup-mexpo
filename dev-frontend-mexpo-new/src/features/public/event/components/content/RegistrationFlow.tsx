"use client";

import React from "react";
import { UserPlus, QrCode, Ticket, ArrowRight } from "lucide-react";
import ContentTitle2 from "@/shared/components/ui/ContentTitle2";

const STEPS = [
  {
    step: "01.",
    title: "Daftar & Masuk",
    description: "Buat akun atau masuk untuk mengakses formulir pendaftaran dan memesan tiket event.",
    icon: UserPlus,
  },
  {
    step: "02.",
    title: "Dapatkan QR Code",
    description: "Terima tiket digital berisikan QR Code pribadi untuk verifikasi kehadiran dan akses stand.",
    icon: QrCode,
  },
  {
    step: "03.",
    title: "Hadir & Berpartisipasi",
    description: "Tunjukkan QR Code saat tiba di lokasi untuk check-in instan dan menikmati seluruh rangkaian acara.",
    icon: Ticket,
  },
];

export default function RegistrationFlow() {
  return (
    <section className="py-12 sm:py-16 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ContentTitle2
          category="Alur Pendaftaran"
          title="Cara Mendaftar Event Ini"
        />

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm hover:border-secondary hover:shadow-md transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-extrabold text-secondary font-outfit">
                      {step.step}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-base mb-1.5 group-hover:text-secondary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow indicator between steps for desktop */}
                {index < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 items-center justify-center shadow-xs z-10">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
