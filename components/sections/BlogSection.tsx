"use client";

import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { useRef } from "react";

interface Post {
    id?: string;
    slug: string;
    title: string;
    date: string;
    read_time: string;
    author_name: string;
    author_avatar: string;
    excerpt: string;
    content: string;
    cover_image?: string;
    published?: boolean;
}

export default function BlogSection({ posts }: { posts: Post[] }) {
    const containerRef = useRef<HTMLElement>(null);


    useGSAP(() => {
        gsap.fromTo(".blog-card",
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".blog-grid",
                    start: "top 85%",
                },
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }
        );
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="w-full bg-[#FFFCF4] pt-4 pb-16 lg:pt-8 lg:pb-24">
            <div className="max-w-3xl mx-auto">
                <div className="mb-10 lg:mb-16">
                    <h2 className="text-black text-3xl lg:text-4xl font-bold tracking-tight mb-6 font-quicksand text-left">Blog</h2>
                    <p className="text-gray-600 max-w-2xl text-[16px] md:text-[18px] text-center mx-auto mb-6">
                        Tips, tricks, and insights on mastering your exams with AI.
                    </p>
                </div>

                <div className="blog-grid space-y-6">
                    {posts.map((post, i) => (
                        <Link
                            key={post.id || i}
                            href={`/blog/${post.slug || '#'}`}
                            className="blog-card block group bg-white rounded-2xl p-7 md:p-9 border border-black/5 shadow-[0_4px_20px_-1px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_-1px_rgba(0,0,0,0.04)] transition-all duration-500 cursor-pointer text-left"
                        >
                            <div>
                                <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 leading-tight font-quicksand group-hover:text-[#FF4D00] transition-colors duration-300">
                                    {post.title}
                                </h3>

                                <div className="flex flex-wrap items-center gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-500 text-sm md:text-base font-medium">
                                        <span>{post.date}</span>
                                        <span className="opacity-30">•</span>
                                        <span>{post.read_time?.includes('min') ? post.read_time : `${post.read_time} min read`}</span>
                                        <span className="opacity-30">•</span>
                                        <span className="lowercase font-quicksand">by</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                                            <img
                                                src={post.author_avatar}
                                                alt={post.author_name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className="text-gray-700 text-sm md:text-base font-medium font-quicksand">{post.author_name}</span>
                                    </div>
                                </div>

                                <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-4">
                                    {post.excerpt}
                                </p>
                                <div className="group/link flex items-center gap-1 text-[#FF4D00] text-sm md:text-base font-semibold">
                                    <span className="group-hover:underline decoration-1 underline-offset-4">
                                        Read more
                                    </span>
                                    <span>→</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}


