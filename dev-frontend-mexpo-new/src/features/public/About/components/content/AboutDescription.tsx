import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRight, Calendar, Store, Users } from "lucide-react";
import Button from "@/shared/components/button/Button";
import { useQuery } from "@tanstack/react-query";
import { getPlatformStats } from "@/services/public.service";
import { keys } from "@/lib/query-keys";

interface AboutDescriptionProps {
  data?: {
    heading?: string;
    paragraphs?: string[];
  };
}

const DEFAULT_PARAGRAPHS = [
  "Mexpo adalah platform teknologi yang dirancang untuk mempermudah penyelenggaraan, penemuan, dan pengelolaan event serta expo di Indonesia.",
  "Dengan fitur lengkap dan pengalaman pengguna yang intuitif, Mexpo menghubungkan penyelenggara dengan peserta, membuka peluang kolaborasi, dan mendorong pertumbuhan industri event di tanah air.",
];

function formatCount(val: number): string {
  if (val >= 1000000) {
    return `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}M+`;
  }
  if (val >= 1000) {
    return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}K+`;
  }
  return `${val}+`;
}

const AboutDescription: React.FC<AboutDescriptionProps> = ({ data }) => {
  const { data: statsResponse } = useQuery({
    queryKey: keys.platform.stats,
    queryFn: () => getPlatformStats(),
    staleTime: 60 * 1000,
  });

  const statsData = statsResponse?.data;
  const heading =
    data?.heading || "Membangun Ekosistem Event yang Lebih Terhubung";
  const paragraphs =
    data?.paragraphs && data.paragraphs.length > 0
      ? data.paragraphs
      : DEFAULT_PARAGRAPHS;

  // Real live numbers directly from API fetch
  const eventCount = statsData?.events ?? 0;
  const participantCount = statsData?.users ?? 0;
  const partnerCount = statsData?.tenants ?? 0;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-12 sm:my-16 lg:my-20"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* ── Left Column: Story Text & Action ── */}
        <div className="lg:col-span-5 space-y-5 text-left">
          <h2 className="font-public-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-snug tracking-tight">
            {heading}
          </h2>

          <div className="space-y-3.5">
            {paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="font-jakarta text-gray-600 text-sm sm:text-base leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>

          <div className="pt-2">
            <Button
              href="/about#galeri"
              variant="primary"
              endIcon={<ArrowRight className="w-4 h-4" />}
              className="px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md"
            >
              Pelajari Lebih Lanjut
            </Button>
          </div>
        </div>

        {/* ── Center Column: Large Event Photo ── */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full h-72 sm:h-80 lg:h-96 rounded-3xl overflow-hidden shadow-lg border border-gray-100 group">
            <Image
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80"
              alt="Suasana Konferensi dan Expo Mexpo"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* ── Right Column: 3 Vertical Stat Cards (Real Fetched Stats) ── */}
        <div className="lg:col-span-3 flex flex-col gap-3.5">
          {/* Stat 1: Event Terselenggara */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900 leading-tight">
                {eventCount < 1000 ? (
                  <>
                    <CountUp
                      end={eventCount}
                      duration={2}
                      separator="."
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    +
                  </>
                ) : (
                  <span>{formatCount(eventCount)}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Event Terselenggara
              </p>
            </div>
          </div>

          {/* Stat 2: Peserta Terdaftar */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900 leading-tight">
                {participantCount < 1000 ? (
                  <>
                    <CountUp
                      end={participantCount}
                      duration={2}
                      separator="."
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    +
                  </>
                ) : (
                  <span>{formatCount(participantCount)}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Peserta
              </p>
            </div>
          </div>

          {/* Stat 3: Mitra & Exhibitor */}
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900 leading-tight">
                {partnerCount < 1000 ? (
                  <>
                    <CountUp
                      end={partnerCount}
                      duration={2}
                      separator="."
                      enableScrollSpy
                      scrollSpyOnce
                    />
                    +
                  </>
                ) : (
                  <span>{formatCount(partnerCount)}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Mitra &amp; Exhibitor
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutDescription;
