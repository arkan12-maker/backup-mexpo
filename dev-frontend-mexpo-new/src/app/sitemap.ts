import { MetadataRoute } from 'next';
import { getEvents } from '@/services/public.service';
import { SITE_URL } from '@/global';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static public pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic published events
  try {
    const eventsRes = await getEvents({ quantity: '100' });
    const events = eventsRes?.data || [];

    const eventRoutes: MetadataRoute.Sitemap = events.flatMap((event) => {
      const slugOrId = event.slug || event.uuid;
      const lastMod = event.updated_at ? new Date(event.updated_at) : currentDate;

      return [
        {
          url: `${SITE_URL}/event/${slugOrId}`,
          lastModified: lastMod,
          changeFrequency: 'daily' as const,
          priority: 0.9,
        },
        {
          url: `${SITE_URL}/event/${slugOrId}/register`,
          lastModified: lastMod,
          changeFrequency: 'daily' as const,
          priority: 0.8,
        },
      ];
    });

    return [...staticRoutes, ...eventRoutes];
  } catch (err) {
    console.error('Failed to generate dynamic sitemap entries:', err);
    return staticRoutes;
  }
}

