"use client";

import React from "react";
import { motion } from "framer-motion";
import PageShell from "@/shared/components/ui/PageShell";
import Hero from "./content/Hero";
import AboutDescription from "./content/AboutDescription";
import Gallery from "./content/Gallery";
import { CoreFeature } from "./content/CoreFeature";
import CoreValue from "./content/CoreValue";
import { useApiQuery } from "@/lib/hooks/useApi";
import { keys } from "@/lib/query-keys";
import { getAllSiteContents } from "@/services/site-content.service";

const About = () => {
  const { data: contentsResponse } = useApiQuery(
    keys.siteContents.all,
    () => getAllSiteContents(),
    {
      staleTime: 60 * 1000,
    },
  );

  const siteData = contentsResponse?.data || {};

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-white"
    >
      <PageShell className="py-6 sm:py-8 space-y-12 sm:space-y-16">
        {/* ─── 1. Hero Showcase (Reference Image Section 1) ─── */}
        <Hero data={siteData.about_hero} />

        {/* ─── 2. Ekosistem Event & Statistik (Reference Image Section 2) ─── */}
        <AboutDescription data={siteData.about_story} />

        {/* ─── 3. Galeri Momen Berharga 5-Foto (Reference Image Section 3) ─── */}
        <Gallery data={siteData.about_gallery} />

        {/* ─── 4. Solusi Lengkap untuk Dunia Event (Reference Image Section 4) ─── */}
        <CoreFeature />

        {/* ─── 5. Visi & Misi Container (Reference Image Section 5) ─── */}
        <CoreValue data={siteData.about_values} />
      </PageShell>
    </motion.div>
  );
};

export default About;
