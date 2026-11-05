import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Handshake, QrCode, Zap } from "lucide-react";

interface FeatureItem {
  title: string;
  description: string;
  icon: React.ElementType;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    icon: QrCode,
    title: "Check-in QR",
    description: "Proses masuk event lebih cepat dan aman.",
  },
  {
    icon: BarChart3,
    title: "Analitik Real-Time",
    description: "Pantau performa event secara langsung.",
  },
  {
    icon: Handshake,
    title: "Jaringan Mitra",
    description: "Terhubung dengan mitra terpercaya.",
  },
  {
    icon: Zap,
    title: "Akses Mudah",
    description: "Kelola event kapan saja dan di mana saja.",
  },
];

export const CoreFeature = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-16 sm:my-20 lg:my-24 relative"
    >
      {/* Decorative triangle */}
      <div className="absolute -right-4 top-1/4 w-8 h-8 pointer-events-none select-none text-secondary/25">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      </div>

      {/* Centered Heading */}
      <div className="text-center space-y-2 mb-8 sm:mb-10 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-secondary border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
          Fitur Utama
        </span>
        <h2 className="font-public-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 tracking-tight">
          Solusi Lengkap untuk Dunia Event
        </h2>
        <p className="font-jakarta text-gray-600 text-xs sm:text-sm leading-relaxed">
          Nikmati berbagai fitur unggulan yang dirancang untuk memudahkan setiap
          kebutuhan event Anda.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {DEFAULT_FEATURES.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-secondary/30 transition-all duration-300 flex flex-col items-start gap-3.5"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-secondary flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-public-sans font-bold text-gray-900 text-base">
                  {item.title}
                </h3>
                <p className="font-jakarta text-gray-500 text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
};
