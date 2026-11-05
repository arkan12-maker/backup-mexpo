"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Minus } from "lucide-react";
import ContentTitle2 from "@/shared/components/ui/ContentTitle2";

const FAQ_ITEMS = [
  {
    question: "Bagaimana cara mendaftar event?",
    answer:
      "Klik tombol 'Daftar Event' pada halaman ini, lengkapi formulir identitas peserta yang disediakan panitia, lalu selesaikan reservasi hingga tiket digital Anda terbit.",
  },
  {
    question: "Apakah QR Code bisa digunakan lebih dari satu kali?",
    answer:
      "Ya, tiket QR Code Anda berlaku selama seluruh rangkaian kegiatan berlangsung untuk check-in gerbang masuk, sesi seminar, dan kunjungan stan pameran.",
  },
  {
    question: "Apakah pendaftaran dikenakan biaya?",
    answer:
      "Status biaya tertera pada informasi event. Untuk event gratis tidak dipungut biaya apapun. Jika berbayar, pembayaran didukung secara instan melalui QRIS dan Virtual Account.",
  },
  {
    question: "Bagaimana cara mendapatkan sertifikat?",
    answer:
      "Sertifikat digital otomatis tersedia di menu Dashboard akun peserta Anda setelah kehadiran sesi acara terverifikasi oleh panitia.",
  },
  {
    question: "Bagaimana cara mendapatkan QR Code?",
    answer:
      "Setelah proses pendaftaran selesai, QR Code tiket digital langsung tersimpan di akun Anda dan dapat diakses kapan saja melalui halaman Dashboard.",
  },
  {
    question: "Apakah pendaftaran dapat dibatalkan?",
    answer:
      "Pembatalan pendaftaran dapat dilakukan sebelum batas waktu pendaftaran ditutup melalui pengaturan tiket di halaman Dashboard peserta.",
  },
];

export default function FaqSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleFaq = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <section id="faq" className="py-12 sm:py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <ContentTitle2
            category="Bantuan"
            title="Pertanyaan yang Sering Diajukan"
          />

          <Link
            href="/faq"
            className="text-xs sm:text-sm font-bold text-secondary hover:text-brand-600 inline-flex items-center gap-1 group transition-colors mb-6 sm:mb-8"
          >
            <span>Lihat Semua FAQ</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 2-Column Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div
                key={index}
                className="border-b border-gray-100 py-3.5 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left gap-4 py-1 group"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-secondary transition-colors">
                    {item.question}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-secondary shrink-0 transition-colors">
                    {isOpen ? (
                      <Minus className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed pr-6 animate-in fade-in duration-200">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
