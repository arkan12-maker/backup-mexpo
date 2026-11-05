import React from 'react';
import type { Metadata } from 'next';
import EventdetailPage from '@/features/public/event/components/Event';
import EventJsonLd from '@/features/public/event/components/EventJsonLd';
import { getEventByUuid } from '@/services/public.service';
import { ErrorPage } from '@/shared/components/fallback/errorMessage';
import { SITE_URL } from '@/global';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const eventRes = await getEventByUuid(slug);
  const event = eventRes?.data;

  if (!event || eventRes.status !== true) {
    return {
      title: 'Event Tidak Ditemukan',
      description: 'Event yang Anda cari tidak tersedia atau telah dihapus di Mexpo.',
    };
  }

  const title = `${event.name} — Pendaftaran & Info Lengkap`;
  const description = event.description
    ? event.description.length > 160
      ? `${event.description.slice(0, 157).trim()}...`
      : event.description
    : `Daftar dan dapatkan tiket ${event.name}. Cek agenda, pembicara, tenant, dan lokasi di Mexpo.`;

  const eventUrl = `${SITE_URL}/event/${event.slug || event.uuid}`;
  const imageUrl = event.photo
    ? event.photo.startsWith('http')
      ? event.photo
      : `${SITE_URL}${event.photo.startsWith('/') ? '' : '/'}${event.photo}`
    : `${SITE_URL}/images/cards/card-e.png`;

  return {
    title,
    description,
    alternates: {
      canonical: eventUrl,
    },
    openGraph: {
      title: event.name,
      description,
      url: eventUrl,
      siteName: 'Mexpo',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: event.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.name,
      description,
      images: [imageUrl],
    },
  };
}

const EventPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const eventData = await getEventByUuid(slug);

  if (eventData.status !== true && eventData.code !== 200) {
    return <ErrorPage code={eventData.code} title={eventData.message} />;
  }

  return (
    <>
      <EventJsonLd event={eventData.data} />
      <EventdetailPage eventData={eventData.data} />
    </>
  );
};

export default EventPage;
