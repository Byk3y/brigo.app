"use client";

import { FileText, Globe, ImageIcon, Edit3, TrendingUp, RefreshCw, Loader2 } from 'lucide-react';
import { Post } from '@/lib/supabase-posts';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface DashboardViewProps {
    posts: Post[];
    imagesCount: number;
    onNewPost: () => void;
    onEditPost: (post: Post) => void;
    onViewAllPosts: () => void;
}

export default function DashboardView({ posts, imagesCount, onNewPost, onEditPost, onViewAllPosts }: DashboardViewProps) {
    const [isIndexing, setIsIndexing] = useState(false);

    const stats = [
        { label: 'Total Posts', value: posts.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Live Posts', value: posts.filter(p => p.published).length, icon: Globe, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Asset Count', value: imagesCount || '-', icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Drafts', value: posts.filter(p => !p.published).length, icon: Edit3, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    const urgentPosts = [...posts]
        .sort((a, b) => (a.published === b.published ? 0 : a.published ? 1 : -1))
        .slice(0, 5);

    const handleIndexAll = async () => {
        const livePosts = posts.filter(p => p.published);
        if (livePosts.length === 0) {
            toast.error("No live posts to index.");
            return;
        }

        setIsIndexing(true);
        const toastId = toast.loading("Submitting all posts to IndexNow...");

        try {
            const urls = livePosts.map(p => `${window.location.origin}/blog/${p.slug}`);

            const response = await fetch('/api/indexnow', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ urls })
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(`Successfully submitted ${livePosts.length} posts!`, { id: toastId });
            } else {
                throw new Error(result.error || "Failed to index posts");
            }
        } catch (error: any) {
            console.error("Indexing error:", error);
            toast.error(error.message || "An error occurred", { id: toastId });
        } finally {
            setIsIndexing(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Francis</h1>
                <p className="text-gray-500 font-medium">Here's what's happening with Brigo</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:border-[#FF4D00]/20">
                        <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shrink-0`}>
                            <stat.icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight truncate mb-0.5">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900 leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                        <h2 className="text-base font-bold text-gray-900">Recent Editorials</h2>
                        <button
                            onClick={onViewAllPosts}
                            className="text-[#FF4D00] text-sm font-bold hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {urgentPosts.map((post) => (
                            <div key={post.id} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <div>
                                        <p className="font-bold text-gray-900 line-clamp-1">{post.title || 'Untitled Draft'}</p>
                                        <p className="text-xs text-gray-400 font-medium">{post.date}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => onEditPost(post)}
                                    className="p-2 text-gray-300 group-hover:text-[#FF4D00] transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-[#FF4D00] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                    <div className="relative z-10">
                        <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
                        <h2 className="text-xl font-bold mb-1">Content Strategy</h2>
                        <p className="text-white/80 text-xs leading-relaxed mb-6">
                            Your published posts are reaching users worldwide. Keep sharing insights to grow the Brigo community.
                        </p>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <button
                            onClick={onNewPost}
                            className="w-full bg-white text-[#FF4D00] font-bold py-2.5 px-6 rounded-full text-sm hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
                        >
                            Write New Post
                        </button>

                        <button
                            onClick={handleIndexAll}
                            disabled={isIndexing}
                            className="w-full bg-black/10 text-white font-bold py-2.5 px-6 rounded-full text-sm hover:bg-black/20 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/10"
                            title="Send all live posts to IndexNow for immediate crawl"
                        >
                            {isIndexing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <RefreshCw className="w-4 h-4" />
                            )}
                            {isIndexing ? 'Indexing...' : 'Index All Posts'}
                        </button>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                </div>
            </div>
        </div>
    );
}
