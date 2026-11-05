'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Search, LifeBuoy, ArrowRight } from 'lucide-react'
import PageShell from '@/shared/components/ui/PageShell'
import { faqData as fallbackFaqData } from '../faq.data'
import { useApiQuery } from '@/lib/hooks/useApi'
import { keys } from '@/lib/query-keys'
import { FaqItem, FaqListResult, getPublicFaqs } from '@/services/faq.service'

const PRIMARY_CATEGORIES = [
  'Semua',
  'Akun',
  'Event',
  'Pembayaran',
  'Tiket',
  'Lainnya',
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')

  // Fetch dynamic FAQs from database
  const { data: faqResult } = useApiQuery<FaqListResult>(
    keys.faqs.publicList(activeCategory),
    () => getPublicFaqs(activeCategory),
    {
      staleTime: 60 * 1000,
    }
  )

  const dynamicFaqs: Array<FaqItem | { category: string; question: string; answer: string }> =
    faqResult?.items && faqResult.items.length > 0
      ? faqResult.items
      : fallbackFaqData

  const categories: string[] = PRIMARY_CATEGORIES

  const filteredFAQs = dynamicFaqs.filter(
    (faq: FaqItem | { category: string; question: string; answer: string }) => {
      const matchesSearch =
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      
      let matchesCategory = true
      if (activeCategory === 'Semua') {
        matchesCategory = true
      } else if (activeCategory === 'Lainnya') {
        matchesCategory = !['Akun', 'Event', 'Pembayaran', 'Tiket'].includes(faq.category)
      } else if (activeCategory === 'Tiket') {
        matchesCategory =
          faq.category === 'Tiket' ||
          faq.category === 'Kehadiran & Sertifikat' ||
          faq.question.toLowerCase().includes('tiket')
      } else {
        matchesCategory = faq.category.toLowerCase().includes(activeCategory.toLowerCase())
      }

      return matchesSearch && matchesCategory
    }
  )

  return (
    <div className="min-h-screen bg-white">
      <PageShell className="py-6 sm:py-10 max-w-6xl">
        {/* ── 1. Geometric Blue Hero Banner ── */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-12 mb-8 bg-gradient-to-r from-[#3c85f3] via-[#357af0] to-[#2563eb] text-white shadow-lg border border-blue-400/20">
          {/* Subtle Ambient & Geometric Vector Shapes */}
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-white/10 blur-sm pointer-events-none" />
          <div className="absolute right-36 -bottom-8 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
          
          {/* Watermark Question Mark */}
          <div className="hidden md:flex absolute right-10 top-1/2 -translate-y-1/2 w-28 h-28 lg:w-32 lg:h-32 rounded-full bg-white/15 border border-white/20 items-center justify-center text-white/35 font-extrabold text-5xl lg:text-6xl select-none pointer-events-none">
            ?
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white border border-white/25 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm shadow-2xs">
                Pusat Bantuan
              </span>

              <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight font-outfit text-white">
                Pertanyaan yang Sering Diajukan
              </h1>

              <p className="text-blue-50/90 text-sm sm:text-base leading-relaxed">
                Temukan jawaban untuk pertanyaan yang sering diajukan tentang Mexpo.
              </p>
            </div>

            {/* Integrated Search Input */}
            <div className="relative w-full lg:max-w-md shrink-0">
              <input
                type="text"
                placeholder="Cari pertanyaan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-gray-900 placeholder:text-gray-400 py-3.5 pl-5 pr-12 rounded-full shadow-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── 2. Category Filter Pills ── */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2 mb-6">
          {categories.map((category: string) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-secondary text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-2xs'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>

        {/* ── 3. FAQ Accordion List ── */}
        <div className="space-y-3">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index: number) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:border-gray-200 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left p-5 sm:p-6 gap-4 hover:bg-gray-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <span className="bg-blue-50 text-secondary border border-blue-100 px-3 py-1 rounded-full font-bold text-xs shrink-0">
                        {faq.category}
                      </span>
                      <span className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-secondary transition-colors truncate sm:whitespace-normal">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 group-hover:text-secondary shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pt-2 pb-5 border-t border-gray-50 text-gray-600 leading-relaxed text-sm sm:text-base">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          ) : (
            <div className="bg-white py-14 border border-gray-200 rounded-2xl text-center shadow-xs">
              <HelpCircle className="mx-auto mb-3 w-10 h-10 text-gray-300" />
              <p className="font-bold text-gray-700 text-base">Tidak ada pertanyaan yang cocok</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
                Coba gunakan kata kunci pencarian yang lain atau ubah kategori filter.
              </p>
            </div>
          )}
        </div>

        {/* ── 4. Bottom Support CTA Banner ── */}
        <div className="mt-12 rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-r from-blue-50/90 via-white to-blue-100/60 border border-blue-100 shadow-xs relative overflow-hidden">
          {/* Subtle Corner Vector Shapes */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-200/20 rounded-bl-full pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-16 h-16 bg-blue-200/20 rounded-tr-full pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-100/80 text-secondary flex items-center justify-center shrink-0 shadow-2xs">
                <LifeBuoy className="w-8 h-8 text-secondary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-gray-900 text-lg sm:text-xl font-outfit">
                  Masih Butuh Bantuan?
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm max-w-md leading-relaxed">
                  Hubungi tim support kami untuk mendapatkan bantuan lebih lanjut seputar Mexpo.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-secondary hover:bg-brand-600 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all group"
              >
                <span>Hubungi Kami</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  )
}
