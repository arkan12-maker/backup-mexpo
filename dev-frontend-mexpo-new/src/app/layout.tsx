// src/app/layout.tsx
// Root layout Mexpo — fonts, metadata, dan globals

import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, Public_Sans } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import QueryProvider from '@/lib/providers/QueryProvider';
import { Toaster } from 'sonner';

import { SITE_URL } from '@/global';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Mexpo — Platform Event & Expo Management',
    template: '%s | Mexpo',
  },
  description:
    'Platform manajemen event, pameran, seminar, dan expo modern berbasis QR Code. Kelola pendaftaran tiket, check-in pengunjung, tenant, dan sertifikat digital dalam satu ekosistem.',
  keywords: [
    'Mexpo',
    'Event Management',
    'Expo SMK Telkom Malang',
    'Pameran Digital',
    'Tiket Event',
    'QR Code Check-in',
    'Sertifikat Digital',
    'Seminar & Workshop',
  ],
  authors: [{ name: 'Mexpo Team' }],
  creator: 'Mexpo',
  publisher: 'SMK Telkom Malang',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Mexpo — Platform Event & Expo Management',
    description:
      'Platform manajemen event, pameran, seminar, dan expo modern berbasis QR Code. Kelola pendaftaran tiket, check-in, dan sertifikat digital.',
    url: SITE_URL,
    siteName: 'Mexpo',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/images/cards/card-e.png',
        width: 1200,
        height: 630,
        alt: 'Mexpo Event Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mexpo — Platform Event & Expo Management',
    description:
      'Platform manajemen event, pameran, seminar, dan expo modern berbasis QR Code.',
    images: ['/images/cards/card-e.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${publicSans.variable} h-full antialiased`}
    >
      <QueryProvider>
        <AuthProvider>
          <body className="flex flex-col min-h-full">
            <ThemeProvider>
              {children}
              {/* Global toasts (FIX-15) — mounted once here, not per template. */}
              <Toaster richColors position="top-left" />
            </ThemeProvider>
          </body>
        </AuthProvider>
      </QueryProvider>
    </html>
  );
}
