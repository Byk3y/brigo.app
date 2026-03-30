import { getPostBySlug, getPublishedPosts } from "@/lib/supabase-posts";
export const dynamic = 'force-dynamic';
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";

function extractFirstImageUrl(content: string): string | null {
    // Handle both normal quotes and escaped quotes (from Tiptap serialization)
    const match = content.match(/<img[^>]+src=(?:\\\\)?["']?([^"'>\s\\]+)/);
    return match ? match[1] : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };

    const baseUrl = 'https://brigo.app';
    const postUrl = `${baseUrl}/blog/${slug}`;

    // 1. Check explicit cover image
    // 2. Fallback to first image in content
    // 3. Last fallback to generic mockup
    const socialImage = post.cover_image || extractFirstImageUrl(post.content) || `${baseUrl}/app-mockup.webp`;

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: postUrl,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            url: postUrl,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author_name],
            images: [
                {
                    url: socialImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [socialImage],
        },
    };
}

export async function generateStaticParams() {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [post, allPosts] = await Promise.all([
        getPostBySlug(slug),
        getPublishedPosts(),
    ]);

    if (!post) {
        notFound();
    }

    const relatedPosts = allPosts
        .filter((p) => p.slug !== slug)
        .slice(0, 3);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "author": {
            "@type": "Person",
            "name": post.author_name,
            "image": post.author_avatar
        },
        "datePublished": post.date,
        "url": `https://brigo.app/blog/${post.slug}`,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://brigo.app/blog/${post.slug}`
        },
        "publisher": {
            "@type": "Organization",
            "name": "Brigo",
            "logo": {
                "@type": "ImageObject",
                "url": "https://brigo.app/app-icon.webp"
            }
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="min-h-screen bg-[#FFFCF4] font-quicksand pb-32 overflow-x-hidden">
                {/* Nav */}
                <header className="w-full flex items-center justify-between py-6 px-6 lg:px-12 bg-transparent sticky top-0 z-50">
                    <Link href="/blog" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/app-icon.webp"
                            alt="Brigo Icon"
                            width={36}
                            height={36}
                            className="rounded-xl"
                        />
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            brigo
                        </span>
                    </Link>

                    <Link
                        href="/blog"
                        className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-3 h-3" />
                        Back to blog
                    </Link>
                </header>

                <article className="max-w-3xl mx-auto px-6 pt-6 lg:pt-10">
                    {/* Post Header */}
                    <div className="mb-12">
                        <h1 className="text-[1.75rem] md:text-[2.25rem] lg:text-[2.75rem] font-bold text-[#1A1A1A] mb-6 leading-[1.15] tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[15px] font-bold text-[#A0A0A0]">
                            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span>{post.read_time?.includes('min') ? post.read_time : `${post.read_time} min read`}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <div className="flex items-center gap-3 text-[#1A1A1A]">
                                <img
                                    src={post.author_avatar}
                                    alt={post.author_name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span>by {post.author_name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Post Content */}
                    <div
                        className="prose prose-lg max-w-none prose-p:leading-[1.6] prose-p:mb-5 prose-p:text-gray-700 prose-headings:text-black prose-headings:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:mt-8 prose-h3:mb-3 prose-li:my-2 
                        prose-img:rounded-2xl prose-img:w-full prose-img:md:max-w-[600px] prose-img:mx-auto prose-img:shadow-xl
                        prose-iframe:rounded-2xl prose-iframe:w-full prose-iframe:md:max-w-[600px] prose-iframe:mx-auto prose-iframe:shadow-xl prose-iframe:aspect-video prose-iframe:my-10"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="max-w-3xl mx-auto mt-20 px-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 tracking-tight">
                            Keep reading
                        </h2>
                        <div className="space-y-4">
                            {relatedPosts.map((related) => (
                                <Link
                                    key={related.slug}
                                    href={`/blog/${related.slug}`}
                                    className="block group bg-white rounded-2xl p-6 md:p-7 border border-black/5 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_-1px_rgba(0,0,0,0.04)] transition-all duration-500"
                                >
                                    <h3 className="text-lg md:text-xl font-bold text-black mb-2 leading-tight group-hover:text-[#FF4D00] transition-colors duration-300">
                                        {related.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                                        {related.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                                        <span>{new Date(related.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="opacity-30">·</span>
                                        <span>{related.read_time?.includes('min') ? related.read_time : `${related.read_time} min read`}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="max-w-3xl mx-auto mt-24 px-6 py-12 border-t border-black/5 text-center text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">
                    <div className="flex justify-center gap-6 mb-4">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <Link href="/blog" className="hover:text-black transition-colors">Blog</Link>
                        <Link href="/support" className="hover:text-black transition-colors">Support</Link>
                        <Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-black transition-colors">Terms</Link>
                    </div>
                    <p>© {new Date().getFullYear()} Brigo. All rights reserved.</p>
                </footer>
            </main>
        </>
    );
}
