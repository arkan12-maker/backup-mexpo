import { MetadataRoute } from 'next';
import { SITE_URL } from '@/global';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/event/*',
          '/about',
          '/contact',
          '/faq',
          '/privacy-policy',
          '/terms',
        ],
        disallow: [
          '/dashboard/',
          '/dashboard/*',
          '/profile',
          '/profile/*',
          '/auth/',
          '/auth/*',
          '/verify-email',
          '/forgot-passwords',
          '/payment/success',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

