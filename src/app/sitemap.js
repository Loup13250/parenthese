import { SITE_URL } from '@/lib/site';

export default function sitemap() {
  const lastMod = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/carte-des-soins`,
      lastModified: lastMod,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/mon-approche`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/carte-cadeau`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: lastMod,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: lastMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/politique-de-confidentialite`,
      lastModified: lastMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/conditions-generales-de-ventes`,
      lastModified: lastMod,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}
