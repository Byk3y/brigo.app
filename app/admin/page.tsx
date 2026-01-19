"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, getAllPosts, createPost, updatePost, deletePost } from '@/lib/supabase-posts';
import Editor from '@/components/admin/Editor';
import {
    Plus, Trash2, Edit3, Check, X, LogOut, LayoutDashboard,
    FileText, Globe, ArrowLeft
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

export default function AdminPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [view, setView] = useState<'list' | 'edit'>('list');

    // Simple password check using env var
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'brigo2026'; // Fallback for demo
        if (password === adminPass) {
            setIsLoggedIn(true);
            toast.success('Welcome back, Francis!');
        } else {
            toast.error('Incorrect password');
        }
    };

    useEffect(() => {
        if (isLoggedIn) fetchPosts();
    }, [isLoggedIn]);

    const fetchPosts = async () => {
        const data = await getAllPosts();
        setPosts(data);
    };

    const handleNewPost = async () => {
        const newPost: Omit<Post, 'id' | 'created_at'> = {
            title: 'Untitled Post',
            slug: `post-${Date.now()}`,
            excerpt: 'New post excerpt...',
            content: '<p>Start writing...</p>',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            read_time: '5 min read',
            author_name: 'Francis',
            author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Francis',
            published: false
        };

        try {
            const created = await createPost(newPost);
            setEditingPost(created);
            setView('edit');
            toast.success('New draft created!');
        } catch (error) {
            toast.error('Error creating post');
        }
    };

    const handleSave = async (content: string) => {
        if (!editingPost?.id) return;
        setIsSaving(true);
        try {
            await updatePost(editingPost.id, { ...editingPost, content });
            toast.success('Post saved successfully!');
            fetchPosts();
        } catch (error) {
            toast.error('Error saving post');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await deletePost(id);
            toast.success('Post deleted');
            fetchPosts();
        } catch (error) {
            toast.error('Error deleting post');
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center p-4 font-quicksand">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-black/5">
                    <div className="flex justify-center mb-6">
                        <Image src="/app-icon.png" alt="Brigo" width={60} height={60} className="rounded-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all"
                        />
                        <button className="w-full bg-[#FF4D00] text-white py-3 rounded-xl font-bold text-lg hover:scale-[1.02] transition-transform shadow-lg shadow-[#FF4D00]/20">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-quicksand">
            <Toaster position="top-right" />

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 z-50 hidden lg:block">
                <div className="flex items-center gap-3 mb-10">
                    <Image src="/app-icon.png" alt="Brigo" width={32} height={32} className="rounded-lg" />
                    <span className="text-xl font-bold text-gray-900 tracking-tight">brigo admin</span>
                </div>

                <nav className="space-y-2">
                    <button
                        onClick={() => setView('list')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${view === 'list' ? 'bg-[#FF4D00]/10 text-[#FF4D00]' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </button>
                    <button
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                        <Globe className="w-5 h-5" />
                        Storage
                    </button>
                </nav>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="lg:ml-64 p-4 lg:p-10">
                {view === 'list' ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Editorials</h1>
                                <p className="text-gray-500 font-medium">Manage your thoughts and insights</p>
                            </div>
                            <button
                                onClick={handleNewPost}
                                className="flex items-center gap-2 bg-[#FF4D00] text-white px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg shadow-[#FF4D00]/20"
                            >
                                <Plus className="w-5 h-5" />
                                New Blog
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <div key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.published ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDelete(post.id!)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                                        <p className="text-gray-500 text-sm line-clamp-3 mb-6">{post.excerpt}</p>

                                        <button
                                            onClick={() => {
                                                setEditingPost(post);
                                                setView('edit');
                                            }}
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
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => setView('list')}
                            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-6">
                            <input
                                type="text"
                                value={editingPost?.title || ''}
                                onChange={(e) => setEditingPost(prev => prev ? { ...prev, title: e.target.value } : null)}
                                placeholder="Post Title"
                                className="w-full text-4xl font-bold text-gray-900 outline-none mb-6 placeholder:text-gray-200"
                            />

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Slug</label>
                                    <input
                                        type="text"
                                        value={editingPost?.slug || ''}
                                        onChange={(e) => setEditingPost(prev => prev ? { ...prev, slug: e.target.value } : null)}
                                        className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium border border-transparent focus:border-gray-200 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Read Time</label>
                                    <input
                                        type="text"
                                        value={editingPost?.read_time || ''}
                                        onChange={(e) => setEditingPost(prev => prev ? { ...prev, read_time: e.target.value } : null)}
                                        className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium border border-transparent focus:border-gray-200 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Excerpt</label>
                                <textarea
                                    value={editingPost?.excerpt || ''}
                                    onChange={(e) => setEditingPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium border border-transparent focus:border-gray-200 outline-none resize-none"
                                />
                            </div>

                            <div className="flex items-center gap-4 py-4 border-t border-gray-50">
                                <button
                                    onClick={() => setEditingPost(prev => prev ? { ...prev, published: !prev.published } : null)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${editingPost?.published ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                >
                                    {editingPost?.published ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                    {editingPost?.published ? 'Published' : 'Draft'}
                                </button>
                                <p className="text-[11px] text-gray-400 font-medium">Visible to search engines and visitors</p>
                            </div>
                        </div>

                        <Editor
                            initialContent={editingPost?.content || ''}
                            onSave={handleSave}
                            isSaving={isSaving}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
