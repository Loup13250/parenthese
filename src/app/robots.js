import { SITE_URL } from '@/lib/site';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/media/', '/llms.txt'],
        disallow: ['/admin/', '/api/admin/'],
      },
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'Amazonbot',
          'cohere-ai',
          'Diffbot',
        ],
        allow: ['/', '/api/media/', '/llms.txt'],
        disallow: ['/admin/', '/api/admin/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
