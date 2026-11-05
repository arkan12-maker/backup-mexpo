import React from 'react';
import { Event } from '@/entities/event/event.entity';
import { SITE_URL } from '@/global';

export default function EventJsonLd({ event }: { event: Event }) {
  if (!event) return null;

  const eventUrl = `${SITE_URL}/event/${event.slug || event.uuid}`;
  const imageUrl = event.photo
    ? event.photo.startsWith('http')
      ? event.photo
      : `${SITE_URL}${event.photo.startsWith('/') ? '' : '/'}${event.photo}`
    : `${SITE_URL}/images/cards/card-e.png`;

  // ISO Dates fallback
  const startDate = event.start_date
    ? new Date(event.start_date).toISOString()
    : new Date().toISOString();
  const endDate = event.end_date
    ? new Date(event.end_date).toISOString()
    : startDate;

  // Performers / Speakers
  const performers = (event.eventSpeakers || []).map((speaker) => ({
    '@type': 'Person',
    name: speaker.name,
    jobTitle: speaker.bio || 'Speaker',
    image: speaker.photo || undefined,
  }));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description || `Ikuti event ${event.name} di Mexpo.`,
    url: eventUrl,
    image: [imageUrl],
    startDate,
    endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode:
      event.location && event.location.toLowerCase().includes('online')
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location || 'Lokasi Acara',
      address: {
        '@type': 'PostalAddress',
        addressLocality: event.location || 'Indonesia',
        addressCountry: 'ID',
      },
    },
    offers: {
      '@type': 'Offer',
      price: event.ticket_mode === 'FREE' ? '0' : '0',
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
      url: `${eventUrl}/register`,
      validFrom: event.registration_start
        ? new Date(event.registration_start).toISOString()
        : event.created_at
          ? new Date(event.created_at).toISOString()
          : undefined,
    },
    organizer: {
      '@type': 'Organization',
      name: 'Mexpo',
      url: SITE_URL,
    },
    ...(performers.length > 0 && { performer: performers }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

