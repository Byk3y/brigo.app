import Image from "next/image";
import Link from "next/link";
import BlogSection from "@/components/sections/BlogSection";
import { getPublishedPosts } from "@/lib/supabase-posts";

export const metadata = {
    title: "Blog - brigo | Insights on digital wellness",
    description: "Insights on digital wellness and breaking free from endless scrolling",
};

export default async function BlogPage() {
    const posts = await getPublishedPosts();

    return (
        <main className="min-h-screen bg-[#FFFCF4] flex flex-col items-center px-4 pt-3 lg:pt-4 overflow-x-hidden">
            {/* Header / Nav */}
            <header className="w-full flex items-center justify-start py-1 px-1 lg:px-2 mb-2 lg:mb-4 gap-3">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Image
                        src="/app-icon.png"
                        alt="Brigo Icon"
                        width={40}
                        height={40}
                        className="rounded-xl shadow-sm"
                    />
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                        brigo
                    </span>
                </Link>
            </header>

            {/* Blog Content */}
            <div className="w-full max-w-6xl mx-auto flex flex-col items-start px-4 md:px-8 mt-4 lg:mt-8">
                <BlogSection posts={posts} />
            </div>

            {/* Simple Footer for Blog Page */}
            <footer className="w-full py-12 text-center text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] border-t border-gray-100">
                <div className="flex justify-center gap-6 mb-4">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <span className="hover:text-black cursor-pointer transition-colors">Privacy</span>
                    <span className="hover:text-black cursor-pointer transition-colors">Terms</span>
                </div>
                <p>© 2025 Brigo. All rights reserved.</p>
            </footer>
        </main>
    );
}
