import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Rocket, Target } from "lucide-react";
import Button from "@/shared/components/button/Button";

interface VisionMissionProps {
  data?: {
    heading?: string;
    subheading?: string;
    visionTitle?: string;
    visionText?: string;
    missionTitle?: string;
    missionText?: string;
  };
}

const CoreValue: React.FC<VisionMissionProps> = ({ data }) => {
  const heading =
    data?.heading ||
    "Bersama Mewujudkan Ekosistem Event Digital di Indonesia";
  const subheading =
    data?.subheading ||
    "Menjadi platform event terdepan di Indonesia yang menghubungkan, menginspirasi, dan memberdayakan komunitas melalui teknologi.";
  const visionTitle = data?.visionTitle || "Visi";
  const visionText =
    data?.visionText || "Menjadi platform event terdepan di Indonesia.";
  const missionTitle = data?.missionTitle || "Misi";
  const missionText =
    data?.missionText ||
    "Menghubungkan penyelenggara, peserta, dan industri melalui teknologi inovatif.";

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-16 sm:my-20 lg:my-24"
    >
      {/* ── Soft Blue Container Card ── */}
      <div className="relative bg-gradient-to-br from-blue-50/90 via-sky-50/70 to-indigo-50/80 border border-blue-100/90 rounded-3xl p-8 sm:p-12 lg:p-14 overflow-hidden shadow-sm">
        {/* Decorative Geometric Triangles in Background */}
        <div className="absolute right-6 -bottom-6 w-36 h-36 pointer-events-none select-none text-secondary/15 rotate-12">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,10 90,90 10,90" />
          </svg>
        </div>
        <div className="absolute right-36 bottom-10 w-24 h-24 pointer-events-none select-none text-secondary/20 -rotate-12">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,10 90,90 10,90" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          {/* Left Column: Heading, Subtitle & Action */}
          <div className="lg:col-span-6 space-y-5 text-left">
            <span className="inline-flex items-center gap-1.5 bg-blue-100/80 text-secondary border border-blue-200/80 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
              Visi &amp; Misi
            </span>

            <h2 className="font-public-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-snug tracking-tight">
              {heading}
            </h2>

            <p className="font-jakarta text-gray-600 text-xs sm:text-sm leading-relaxed max-w-lg">
              {subheading}
            </p>

            <div className="pt-2">
              <Button
                href="/about"
                variant="primary"
                endIcon={<ArrowRight className="w-4 h-4" />}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold shadow-md"
              >
                Tentang Kami
              </Button>
            </div>
          </div>

          {/* Right Column: 2 Floating Cards (Visi & Misi) */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Card 1: Visi */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-white/80 shadow-md hover:shadow-xl transition-all duration-300 space-y-3.5 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-public-sans font-extrabold text-gray-900 text-lg">
                  {visionTitle}
                </h3>
                <p className="font-jakarta text-gray-600 text-xs leading-relaxed">
                  {visionText}
                </p>
              </div>
            </div>

            {/* Card 2: Misi */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-white/80 shadow-md hover:shadow-xl transition-all duration-300 space-y-3.5 flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-public-sans font-extrabold text-gray-900 text-lg">
                  {missionTitle}
                </h3>
                <p className="font-jakarta text-gray-600 text-xs leading-relaxed">
                  {missionText}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CoreValue;
