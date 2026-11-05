import type { Metadata } from 'next';
import ContactPage from '@/features/public/contact/components/Contact';
import React from 'react';

export const metadata: Metadata = {
  title: 'Hubungi Kami',
  description:
    'Punya pertanyaan, tawaran kerja sama, atau kendala teknis terkait event di Mexpo? Hubungi tim support Mexpo sekarang.',
  openGraph: {
    title: 'Hubungi Kami — Mexpo Support',
    description:
      'Pusat bantuan dan kontak resmi tim penyelenggara event Mexpo.',
  },
};

const Page = () => {
  return <ContactPage />;
};

export default Page;
