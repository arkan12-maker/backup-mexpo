import type { Metadata } from 'next';
import FAQPage from '@/features/public/faq/components/faq';
import React from 'react';

export const metadata: Metadata = {
  title: 'Pertanyaan Umum (FAQ)',
  description:
    'Temukan jawaban atas pertanyaan seputar pendaftaran event, e-ticket, sistem QR Code check-in, tenant booth, dan sertifikat di Mexpo.',
  openGraph: {
    title: 'Pertanyaan Umum (FAQ) — Mexpo',
    description:
      'Panduan dan tanya jawab seputar alur pendaftaran dan penggunaan platform Mexpo.',
  },
};

const Page = () => {
  return <FAQPage />;
};

export default Page;
