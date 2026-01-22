"use client";

import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Post } from '@/lib/supabase-posts';

interface EditorialListViewProps {
    posts: Post[];
    onNewPost: () => void;
    onEditPost: (post: Post) => void;
    onDeletePost: (post: Post) => void;
}

export default function EditorialListView({ posts, onNewPost, onEditPost, onDeletePost }: EditorialListViewProps) {
    const sortedPosts = [...posts].sort((a, b) => (a.published === b.published ? 0 : a.published ? 1 : -1));

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-6 mb-10">
                <div className="flex flex-col w-full sm:w-auto">
                    <div className="flex items-center justify-between sm:mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">Editorials</h1>
                        <button
                            onClick={onNewPost}
                            className="sm:hidden flex items-center justify-center gap-2 bg-[#FF4D00] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-[#FF4D00]/20 whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" />
                            New Blog
                        </button>
                    </div>
                    <p className="text-gray-500 font-medium">Manage your thoughts and insights</p>
                </div>
                <button
                    onClick={onNewPost}
                    className="hidden sm:flex items-center justify-center gap-2 bg-[#FF4D00] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-[#FF4D00]/20 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    New Blog
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
                        {post.cover_image && (
                            <div className="w-full h-40 overflow-hidden border-b border-gray-100">
                                <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                        )}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.published ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => onDeletePost(post)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title || 'Untitled Draft'}</h3>
                            <p className="text-gray-500 text-sm line-clamp-3 mb-6">{post.excerpt || 'No excerpt yet...'}</p>

                            <button
                                onClick={() => onEditPost(post)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 font-bold text-gray-700 hover:border-[#FF4D00] hover:text-[#FF4D00] transition-colors"
                            >
                                <Edit3 className="w-4 h-4" />
                                Edit Post
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
