import type { Metadata } from "next";
import About from "@/features/public/About/components/About";

export const metadata: Metadata = {
  title: "Tentang Mexpo",
  description:
    "Pelajari lebih lanjut tentang platform Mexpo — solusi terintegrasi untuk manajemen event, pameran inovasi, seminar, dan ekosistem expo SMK Telkom Malang.",
  openGraph: {
    title: "Tentang Mexpo — Platform Event & Expo Modern",
    description:
      "Solusi terintegrasi untuk pendaftaran tiket, kehadiran QR Code, pameran tenant, dan sertifikat digital.",
  },
};

const AboutPage = () => {
  return <About />;
};

export default AboutPage;
