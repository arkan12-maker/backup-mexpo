import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/shared/components/button/Button";

interface HeroProps {
  data?: {
    tagline?: string;
    headline?: string;
    highlightText?: string;
    description?: string;
    backgroundImage?: string;
  };
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const tagline = data?.tagline || "Tentang Mexpo";
  const headline = data?.headline || "Platform Event & Expo untuk Masa Depan";
  const highlightText = data?.highlightText || "Indonesia";
  const description =
    data?.description ||
    "Mexpo hadir sebagai solusi digital untuk mengelola dan menemukan berbagai event dan expo di seluruh Indonesia, lebih mudah, lebih terintegrasi.";
  const heroImage = data?.backgroundImage || "/images/about/about-hero.png";

  return (
    <section className="relative pt-2 pb-12 sm:pb-16 lg:pb-20 overflow-hidden">
    

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Text & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-5 text-left"
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-secondary border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
            {tagline}
          </span>

          {/* Heading */}
          <h1 className="font-public-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gray-900 leading-[1.15] tracking-tight">
            {headline} <span className="text-secondary">{highlightText}</span>
          </h1>

          {/* Description */}
          <p className="font-jakarta text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              href="/"
              variant="primary"
              endIcon={<ArrowRight className="w-4 h-4" />}
              className="px-6 py-3 text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              Jelajahi Event
            </Button>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              Hubungi Kami
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Hero Illustration Artwork */}
        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-7 flex justify-center items-center relative"
        >
          <div className="relative w-full max-w-[580px] aspect-[16/10] sm:aspect-[16/9] lg:aspect-[16/10] drop-shadow-2xl">
            <Image
              src={heroImage}
              alt="Mexpo Event Platform Showcase"
              fill
              priority
              sizes="(min-width: 1024px) 580px, 100vw"
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
