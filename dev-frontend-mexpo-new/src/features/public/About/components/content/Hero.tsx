import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/shared/components/button/Button";

interface HeroProps {
  data?: {
    headline?: string;
    highlightText?: string;
    description?: string;
    backgroundImage?: string;
  };
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const headline = data?.headline || "Platform Event & Expo untuk Masa Depan";
  const highlightText = data?.highlightText || "Indonesia";
  const description =
    data?.description ||
    "Mexpo hadir sebagai solusi digital untuk mengelola dan menemukan berbagai event dan expo di seluruh Indonesia, lebih mudah, lebih terintegrasi.";
  const heroImage = data?.backgroundImage || "/images/about/about-hero.png";

  return (
    <section className="relative pt-6 pb-16 sm:pb-20 lg:pb-24 overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/40 via-white to-white px-6 sm:px-10 lg:px-14 border border-blue-100/50 shadow-xs">
      {/* ── Geometric Shape Decorations (Background) ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-200/35 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 w-[450px] h-[450px] rounded-full bg-blue-100/40 blur-3xl" />

        {/* Mexpo Grid Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3c85f3_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)]" />

        {/* Mexpo Shape Asset: Pattern 5 on Top Right */}
        <div className="absolute -top-16 -right-20 w-[420px] h-[380px] opacity-25">
          <Image
            src="/images/shape/Pattern 5.svg"
            alt=""
            width={420}
            height={380}
            className="object-contain"
          />
        </div>

        {/* Mexpo Shape Asset: Pattern 4 on Bottom Left */}
        <div className="absolute -bottom-16 -left-16 w-[360px] h-[300px] opacity-20">
          <Image
            src="/images/shape/Pattern 4.svg"
            alt=""
            width={360}
            height={300}
            className="object-contain rotate-12"
          />
        </div>

        {/* Floating Geometric Elements */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-secondary/30" />
        <div className="absolute top-28 right-1/4 w-3 h-3 rotate-45 border-2 border-secondary/25" />
        <div className="absolute bottom-16 left-1/3 w-3 h-3 rotate-12 bg-secondary/15 rounded-xs" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Text & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 space-y-6 text-left"
        >
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
