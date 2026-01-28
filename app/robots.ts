import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/api',
                    '/_next',
                    '/static',
                ],
            },
            {
                // Explicitly allow AI bots but restrict them from admin
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'PerplexityBot',
                    'Google-Extended',
                    'Anthropic-ai',
                ],
                disallow: ['/admin'],
            }
        ],
        sitemap: 'https://www.brigo.app/sitemap.xml',
        host: 'https://www.brigo.app',
    };
}
