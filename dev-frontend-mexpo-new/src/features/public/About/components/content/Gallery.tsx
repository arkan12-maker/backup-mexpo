import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface GalleryProps {
  data?: Array<{
    id: number | string;
    src: string;
    label: string;
  }>;
}

const DEFAULT_GALLERY = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    label: "Konferensi Panggung Utama",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    label: "Panel Diskusi Pembicara",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    label: "Area Booth & Pameran",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=800&q=80",
    label: "Networking & Interaksi Peserta",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
    label: "Sesi Presentasi & Lokakarya",
  },
];

const resolveImgSrc = (src: string) => {
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("/")
  ) {
    return src;
  }
  return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=800&q=80`;
};

const Gallery: React.FC<GalleryProps> = ({ data }) => {
  const galleryItems = data && data.length > 0 ? data.slice(0, 5) : DEFAULT_GALLERY;

  return (
    <motion.section
      id="galeri"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-16 sm:my-20 lg:my-24 relative"
    >
      {/* Decorative soft blue triangle accents */}
      <div className="absolute -left-6 top-1/3 w-8 h-8 pointer-events-none select-none text-secondary/30">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      </div>
      <div className="absolute -right-6 top-1/2 w-10 h-10 pointer-events-none select-none text-secondary/25">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12,2 22,22 2,22" />
        </svg>
      </div>

      {/* Centered Heading */}
      <div className="text-center space-y-2 mb-8 sm:mb-10 max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 bg-blue-50 text-secondary border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
          Galeri Kegiatan
        </span>
        <h2 className="font-public-sans font-extrabold text-2xl sm:text-3xl lg:text-4xl text-gray-900 tracking-tight">
          Momen Berharga dari Mexpo
        </h2>
        <p className="font-jakarta text-gray-600 text-xs sm:text-sm leading-relaxed">
          Lihat keseruan dan antusiasme dari berbagai event yang telah kami
          selenggarakan.
        </p>
      </div>

      {/* 5-Column Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {galleryItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="group relative h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <Image
              src={resolveImgSrc(item.src)}
              alt={item.label}
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
            <span className="absolute bottom-2.5 left-2.5 right-2.5 text-white font-public-sans font-semibold text-[11px] sm:text-xs line-clamp-2">
              {item.label}
            </span>
          </motion.div>
        ))}
      </div>

   
    </motion.section>
  );
};

export default Gallery;
