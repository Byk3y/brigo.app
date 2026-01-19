import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/supabase-posts";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#FFFCF4] flex flex-col items-center px-4 pt-3 lg:pt-4 overflow-x-hidden">
            {/* Header / Nav */}
            <header className="w-full max-w-6xl mx-auto flex items-center justify-start py-1 px-1 lg:px-2 mb-12 lg:mb-20 gap-3">
                <Link href="/blog" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
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

            {/* Post Layout */}
            <article className="w-full max-w-3xl mx-auto px-4">
                <div className="mb-12">
                    <Link href="/blog" className="text-[#FF4D00] font-bold text-sm mb-8 inline-block hover:gap-2 transition-all">
                        ← Back to blog
                    </Link>

                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold text-black mb-8 leading-tight tracking-tight font-quicksand">
                        {post.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-black/5">
                            <img
                                src={post.author_avatar}
                                alt={post.author_name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-gray-900 font-bold text-sm">{post.author_name}</span>
                            <div className="flex items-center gap-2 text-gray-500 text-xs font-medium">
                                <span>{post.date}</span>
                                <span className="opacity-30">•</span>
                                <span>{post.read_time}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Component with custom styles for Tiptap HTML */}
                    <div className="blog-content-wrapper text-gray-800 leading-relaxed text-lg font-quicksand mt-12 pb-20 prose prose-lg prose-gray max-w-none prose-p:mb-8 prose-p:leading-[1.8] prose-p:text-gray-700 prose-p:font-medium prose-headings:font-bold prose-headings:text-black prose-headings:tracking-tight prose-blockquote:border-l-4 prose-blockquote:border-[#FF4D00] prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:text-xl prose-img:rounded-2xl prose-a:text-[#0044FF] prose-a:underline prose-a:decoration-1 prose-a:underline-offset-4 prose-a:font-semibold">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                </div>
            </article>

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
