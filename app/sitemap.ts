import { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/supabase-posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.brigo.app';

    // Static Routes
    const staticRoutes = [
        '',
        '/blog',
        '/privacy',
        '/terms',
        '/science',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Blog Routes
    let blogRoutes: any[] = [];
    try {
        const posts = await getPublishedPosts();
        blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }));
    } catch (error) {
        console.error('Error generating sitemap for blog posts:', error);
    }

    return [...staticRoutes, ...blogRoutes];
}
