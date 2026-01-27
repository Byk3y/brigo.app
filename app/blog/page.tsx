import Image from "next/image";
import Link from "next/link";
import BlogSection from "@/components/sections/BlogSection";
import { getPostBySlug, getPublishedPosts } from "@/lib/supabase-posts";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Calendar, User, ChevronLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: "AI Study Tips & Exam Prep Guides | Brigo Blog",
    description: "Master your courses with AI. Expert guides on exam prediction, active recall, and turning notes into study podcasts with Brigo.",
};

export default async function BlogPage() {
    const posts = await getPublishedPosts();

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Brigo Blog - Insights on AI and Study Productivity",
        "description": "The latest articles and guides on how to use AI to improve your study habits and ace your exams.",
        "url": "https://brigo.app/blog",
        "hasPart": posts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "url": `https://brigo.app/blog/${post.slug}`,
            "datePublished": post.date
        }))
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <main className="min-h-screen bg-[#FFFCF4] flex flex-col items-center px-4 pt-3 lg:pt-4 overflow-x-hidden">
                {/* Header / Nav */}
                <header className="w-full flex items-center justify-between py-6 px-6 lg:px-12 bg-transparent sticky top-0 z-50">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image
                            src="/app-icon.webp"
                            alt="Brigo Icon"
                            width={36}
                            height={36}
                            className="rounded-xl shadow-sm"
                        />
                        <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            brigo
                        </span>
                    </Link>

                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-black transition-colors"
                    >
                        <ChevronLeft className="w-3 h-3" />
                        Back to home
                    </Link>
                </header>

                {/* Blog Content */}
                <div className="w-full max-w-6xl mx-auto flex flex-col items-start px-4 md:px-8 mt-4 lg:mt-8">
                    <BlogSection posts={posts} />
                </div>

                {/* Simple Footer for Blog Page */}
                <footer className="w-full py-12 text-center text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-gray-100">
                    <div className="flex justify-center gap-6 mb-4">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
                        <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
                    </div>
                    <p>© 2026 Brigo. All rights reserved.</p>
                </footer>
            </main>
        </>
    );
}
