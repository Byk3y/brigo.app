"use client";

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, getAllPosts, createPost, updatePost, deletePost } from '@/lib/supabase-posts';
import Editor from '@/components/admin/Editor';
import {
    Plus, Trash2, Edit3, Check, X, LogOut, LayoutDashboard,
    FileText, Globe, ArrowLeft, Loader2, Save as SaveIcon,
    AlertTriangle, Image as ImageIcon, Copy, ExternalLink,
    TrendingUp, Eye, Hash
} from 'lucide-react';
import { listImages, deleteImage } from '@/lib/supabase-posts';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';

function AdminPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get('edit');

    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [originalPost, setOriginalPost] = useState<Post | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
    const [showStickyBack, setShowStickyBack] = useState(false);
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const hasChanges = editingPost && originalPost && (
        editingPost.content !== originalPost.content ||
        editingPost.title !== originalPost.title ||
        editingPost.excerpt !== originalPost.excerpt ||
        editingPost.slug !== originalPost.slug
    );
    const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'storage'>('dashboard');
    const [images, setImages] = useState<any[]>([]);
    const [isImagesLoading, setIsImagesLoading] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<any | null>(null);

    // We'll determine view based on query/state
    const view = editId ? 'edit' : currentView;

    // Track scroll for sticky button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setShowStickyBack(true);
            } else {
                setShowStickyBack(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check for persisted login on mount
    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
            setIsCheckingAuth(false);
        };

        checkSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
            if (!session) {
                // Clear state on logout
                setPosts([]);
                setImages([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthenticating(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success('Welcome back!');
            }
        } catch (err) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsAuthenticating(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) fetchPosts();
    }, [isLoggedIn]);

    const fetchPosts = async () => {
        try {
            const data = await getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        }
    };

    const fetchImages = async () => {
        setIsImagesLoading(true);
        try {
            const data = await listImages();
            setImages(data);
        } catch (error) {
            toast.error('Failed to load storage');
        } finally {
            setIsImagesLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn && currentView === 'storage') {
            fetchImages();
        }
    }, [isLoggedIn, currentView]);

    const handleDeleteImage = async () => {
        if (!imageToDelete) return;

        setIsDeleting(true);
        try {
            await deleteImage(imageToDelete.name);
            toast.success('Image deleted');
            setImageToDelete(null);
            fetchImages();
        } catch (error) {
            toast.error('Error deleting image');
        } finally {
            setIsDeleting(false);
        }
    };

    // Load post if editing via URL
    useEffect(() => {
        if (editId && isLoggedIn && (!editingPost || editingPost.id !== editId)) {
            const loadPost = async () => {
                const data = await getAllPosts();
                const post = data.find(p => p.id === editId);
                if (post) {
                    setEditingPost(post);
                    setOriginalPost(JSON.parse(JSON.stringify(post))); // Deep copy
                } else {
                    router.push('/admin');
                    toast.error('Post not found');
                }
            };
            loadPost();
        }
    }, [editId, isLoggedIn, editingPost, router]);

    const handleNewPost = async () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        const newPost: Omit<Post, 'id' | 'created_at'> = {
            title: '',
            slug: `post-${Date.now()}`,
            excerpt: '',
            content: '',
            date: dateStr,
            read_time: '1 min read',
            author_name: 'Francis',
            author_avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Francis',
            published: false
        };

        try {
            const created = await createPost(newPost);
            router.push(`/admin?edit=${created.id}`);
            setEditingPost(created);
            toast.success('New draft created!');
        } catch (error) {
            toast.error('Error creating post');
        }
    };

    // Debounced Auto-save logic (Now ONLY for Drafts)
    useEffect(() => {
        if (!editingPost?.id || view !== 'edit' || editingPost.published) return;

        setSaveStatus('saving');
        const timer = setTimeout(async () => {
            try {
                await updatePost(editingPost.id!, editingPost);
                setSaveStatus('saved');
                setOriginalPost(JSON.parse(JSON.stringify(editingPost)));
                fetchPosts(); // Refresh list in background
            } catch (error) {
                setSaveStatus('error');
                toast.error('Auto-save failed');
            }
        }, 1500); // 1.5s debounce

        return () => clearTimeout(timer);
    }, [editingPost, view]);

    const handleSave = async (content?: string) => {
        if (!editingPost?.id) return;
        const postToSave = content ? { ...editingPost, content } : editingPost;

        setIsSaving(true);
        setSaveStatus('saving');
        try {
            await updatePost(postToSave.id!, postToSave);
            setSaveStatus('saved');
            setOriginalPost(JSON.parse(JSON.stringify(postToSave)));
            toast.success('Changes updated live!');
            fetchPosts();
        } catch (error) {
            setSaveStatus('error');
            toast.error('Error saving changes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!postToDelete?.id) return;

        setIsDeleting(true);
        try {
            await deletePost(postToDelete.id);
            toast.success('Post deleted forever');
            setPostToDelete(null);
            fetchPosts();
        } catch (error) {
            toast.error('Error deleting post');
        } finally {
            setIsDeleting(false);
        }
    };

    if (isCheckingAuth) {
        return <div className="min-h-screen bg-[#FFFCF4]" />; // Loading state to prevent flash
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center p-4 font-quicksand">
                <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-black/5">
                    <div className="flex justify-center mb-6">
                        <Image src="/app-icon.webp" alt="Brigo" width={60} height={60} className="rounded-xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Access</h1>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="email"
                            placeholder="Admin Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#FF4D00] outline-none transition-all"
                        />
                        <button
                            disabled={isAuthenticating}
                            className="w-full bg-[#FF4D00] text-white py-3 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#FF4D00]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAuthenticating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                'Login'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-quicksand">
            <Toaster position="top-right" />

            {/* Universal Top Navigation */}
            <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-[100] border-b border-gray-100 px-4 lg:px-10 py-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center justify-between w-full md:w-auto">
                        <div className="flex items-center gap-3">
                            <Image src="/app-icon.webp" alt="Brigo" width={32} height={32} className="rounded-xl" />
                            <span className="text-xl font-bold text-gray-900 tracking-tight">brigo admin</span>
                        </div>

                        {/* Mobile Sign Out */}
                        <button
                            onClick={async () => {
                                await supabase.auth.signOut();
                            }}
                            className="md:hidden p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                            { id: 'list', label: 'Editorial', icon: FileText },
                            { id: 'storage', label: 'Storage', icon: Globe },
                        ].map((nav) => (
                            <button
                                key={nav.id}
                                onClick={() => {
                                    setEditingPost(null);
                                    setCurrentView(nav.id as any);
                                    router.push('/admin');
                                }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${view === nav.id ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                            >
                                <nav.icon className="w-4 h-4" />
                                {nav.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Sign Out / Mobile Sign Out fix */}
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                        }}
                        className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-500 font-bold text-sm transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="p-4 lg:p-10 min-h-screen">
                {/* Floating Back Button (for mobile scroll) */}
                {view === 'edit' && (
                    <button
                        onClick={() => {
                            setEditingPost(null);
                            router.push('/admin');
                        }}
                        className={`fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-2 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-200 shadow-2xl text-gray-500 hover:text-black hover:scale-105 transition-all duration-500 ease-out font-bold whitespace-nowrap ${showStickyBack ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                )}

                {view === 'dashboard' ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Francis</h1>
                            <p className="text-gray-500 font-medium">Here's what's happening with Brigo</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                            {[
                                { label: 'Total Posts', value: posts.length, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
                                { label: 'Live Posts', value: posts.filter(p => p.published).length, icon: Globe, color: 'text-green-500', bg: 'bg-green-50' },
                                { label: 'Asset Count', value: images.length || '-', icon: ImageIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
                                { label: 'Drafts', value: posts.filter(p => !p.published).length, icon: Edit3, color: 'text-orange-500', bg: 'bg-orange-50' },
                            ].map((stat, i) => (
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
                                        onClick={() => setCurrentView('list')}
                                        className="text-[#FF4D00] text-sm font-bold hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {[...posts].sort((a, b) => (a.published === b.published ? 0 : a.published ? 1 : -1)).slice(0, 5).map((post) => (
                                        <div key={post.id} className="p-3 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-2 h-2 rounded-full ${post.published ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                                <div>
                                                    <p className="font-bold text-gray-900 line-clamp-1">{post.title || 'Untitled Draft'}</p>
                                                    <p className="text-xs text-gray-400 font-medium">{post.date}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setEditingPost(post);
                                                    router.push(`/admin?edit=${post.id}`);
                                                }}
                                                className="p-2 text-gray-300 group-hover:text-[#FF4D00] transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Info Card */}
                            <div className="bg-[#FF4D00] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between min-h-[240px]">
                                <div className="relative z-10">
                                    <TrendingUp className="w-8 h-8 mb-4 opacity-50" />
                                    <h2 className="text-xl font-bold mb-1">Content Strategy</h2>
                                    <p className="text-white/80 text-xs leading-relaxed mb-6">
                                        Your published posts are reaching users worldwide. Keep sharing insights to grow the Brigo community.
                                    </p>
                                </div>
                                <button
                                    onClick={handleNewPost}
                                    className="bg-white text-[#FF4D00] font-bold py-2.5 px-6 rounded-full text-sm hover:scale-105 transition-all relative z-10 whitespace-nowrap"
                                >
                                    Write New Post
                                </button>
                                {/* Decorative circle */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                            </div>
                        </div>
                    </div>
                ) : view === 'list' ? (
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-6 mb-10">
                            <div className="flex flex-col w-full sm:w-auto">
                                <div className="flex items-center justify-between sm:mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">Editorials</h1>
                                    <button
                                        onClick={handleNewPost}
                                        className="sm:hidden flex items-center justify-center gap-2 bg-[#FF4D00] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-[#FF4D00]/20 whitespace-nowrap"
                                    >
                                        <Plus className="w-4 h-4" />
                                        New Blog
                                    </button>
                                </div>
                                <p className="text-gray-500 font-medium">Manage your thoughts and insights</p>
                            </div>
                            <button
                                onClick={handleNewPost}
                                className="hidden sm:flex items-center justify-center gap-2 bg-[#FF4D00] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-all shadow-lg shadow-[#FF4D00]/20 whitespace-nowrap"
                            >
                                <Plus className="w-4 h-4" />
                                New Blog
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...posts].sort((a, b) => (a.published === b.published ? 0 : a.published ? 1 : -1)).map((post) => (
                                <div key={post.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all group">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${post.published ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                {post.published ? 'Published' : 'Draft'}
                                            </span>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setPostToDelete(post)}
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
                                                router.push(`/admin?edit=${post.id}`);
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
                ) : view === 'storage' ? (
                    <div className="max-w-6xl mx-auto">
                        <div className="flex justify-between items-end mb-10">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">Cloud Storage</h1>
                                <p className="text-gray-500 font-medium">Manage and reuse your uploaded assets</p>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={fetchImages}
                                    className="p-3 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-[#FF4D00] transition-colors shadow-sm"
                                    title="Refresh"
                                >
                                    <Loader2 className={`w-5 h-5 ${isImagesLoading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {isImagesLoading && images.length === 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-white rounded-2xl border border-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : images.length === 0 ? (
                            <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ImageIcon className="w-10 h-10 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No assets yet</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">Upload images in the blog editor to see them appear here.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                {images.map((img) => {
                                    const isUsed = posts.some(p => p.content.includes(img.url));
                                    return (
                                        <div key={img.name} className={`group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all ${!isUsed ? 'opacity-80' : ''}`}>
                                            <div className="aspect-square relative flex items-center justify-center p-2 bg-gray-50">
                                                <img
                                                    src={img.url}
                                                    alt={img.name}
                                                    className={`max-w-full max-h-full object-contain mix-blend-multiply ${!isUsed ? 'grayscale-[0.5]' : ''}`}
                                                    loading="lazy"
                                                />
                                                {!isUsed && (
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900/10 backdrop-blur-md rounded-md">
                                                        <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Unused</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(img.url);
                                                        toast.success('URL copied to clipboard');
                                                    }}
                                                    className="w-full flex items-center justify-center gap-2 bg-white text-black py-1.5 rounded-lg text-xs font-bold hover:bg-[#FF4D00] hover:text-white transition-colors"
                                                >
                                                    <Copy className="w-3 h-3" />
                                                    Copy URL
                                                </button>
                                                <div className="flex gap-2 w-full">
                                                    <a
                                                        href={img.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                    <button
                                                        onClick={() => setImageToDelete(img)}
                                                        className="flex-1 flex items-center justify-center bg-red-500/20 hover:bg-red-500 text-white py-1.5 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-3 bg-white border-t border-gray-50">
                                                <p className="text-[10px] font-bold text-gray-400 truncate uppercase tracking-widest">{img.name}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <button
                                onClick={() => {
                                    setEditingPost(null);
                                    router.push('/admin');
                                }}
                                className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm lg:text-base"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Dashboard
                            </button>

                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                {editingPost?.published && (
                                    <span className="text-gray-400 mr-2 italic lowercase font-medium">Staged Mode: Manual update required</span>
                                )}
                                {saveStatus === 'saving' && (
                                    <span className="text-[#FF4D00] flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Saving...
                                    </span>
                                )}
                                {saveStatus === 'saved' && (
                                    <span className="text-green-500 flex items-center gap-2">
                                        <Check className="w-3 h-3" />
                                        {editingPost?.published ? 'Current Live Version' : 'Saved'}
                                    </span>
                                )}
                                {saveStatus === 'error' && (
                                    <span className="text-red-500">Save Failed</span>
                                )}
                            </div>
                        </div>

                        {editId && !editingPost ? (
                            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm">
                                <Loader2 className="w-8 h-8 animate-spin text-[#FF4D00] mb-4" />
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Post...</p>
                            </div>
                        ) : (
                            <>
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-6">
                                    <input
                                        type="text"
                                        value={editingPost?.title || ''}
                                        onChange={(e) => {
                                            const newTitle = e.target.value;
                                            const newSlug = newTitle
                                                .toLowerCase()
                                                .replace(/[^\w ]+/g, '')
                                                .replace(/ +/g, '-');

                                            setEditingPost(prev => prev ? {
                                                ...prev,
                                                title: newTitle,
                                                slug: newSlug
                                            } : null);
                                        }}
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
                                            <div className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-transparent">
                                                {editingPost?.read_time || '1'} min read
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex justify-between items-end mb-2">
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Excerpt</label>
                                            <span className={`text-[10px] font-bold ${(editingPost?.excerpt?.length || 0) >= 150 ? 'text-orange-500' : 'text-gray-400'}`}>
                                                {editingPost?.excerpt?.length || 0}/160
                                            </span>
                                        </div>
                                        <textarea
                                            value={editingPost?.excerpt || ''}
                                            onChange={(e) => setEditingPost(prev => prev ? { ...prev, excerpt: e.target.value } : null)}
                                            rows={3}
                                            maxLength={160}
                                            className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium border border-transparent focus:border-gray-200 outline-none resize-none"
                                            placeholder="Write a catchy 160-character summary for Google and your blog cards..."
                                        />
                                    </div>

                                    <div className="flex items-center justify-between py-4 border-t border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={async () => {
                                                    const isPublishing = !editingPost?.published;
                                                    const updatedPost = { ...editingPost, published: isPublishing } as Post;
                                                    setEditingPost(updatedPost);

                                                    // Auto-save the status change immediately
                                                    try {
                                                        setIsSaving(true);
                                                        await updatePost(updatedPost.id!, updatedPost);
                                                        setOriginalPost(JSON.parse(JSON.stringify(updatedPost)));
                                                        if (isPublishing) {
                                                            toast.success('Post is now live!');
                                                        } else {
                                                            toast.success('Post reverted to draft');
                                                        }
                                                        fetchPosts();
                                                    } catch (err) {
                                                        toast.error('Failed to update status');
                                                    } finally {
                                                        setIsSaving(false);
                                                    }
                                                }}
                                                disabled={isSaving}
                                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm ${editingPost?.published ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-[#FF4D00] text-white hover:scale-105 shadow-lg shadow-[#FF4D00]/20'}`}
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                                                {editingPost?.published ? 'Take Offline (Draft)' : 'Go Live (Publish)'}
                                            </button>
                                            <div className="flex flex-col">
                                                <p className="text-[11px] text-gray-900 font-bold uppercase tracking-tight">
                                                    Status: {editingPost?.published ? 'Live' : 'Draft'}
                                                </p>
                                                <p className="text-[10px] text-gray-400 font-medium">
                                                    {editingPost?.published ? 'Visible to the public' : 'Only visible to you'}
                                                </p>
                                            </div>
                                        </div>

                                        {editingPost?.published && hasChanges && (
                                            <button
                                                onClick={() => handleSave()}
                                                disabled={isSaving}
                                                className="flex items-center gap-2 bg-[#FF4D00] text-white px-8 py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-xl shadow-[#FF4D00]/20 animate-in fade-in slide-in-from-right-4"
                                            >
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <SaveIcon className="w-4 h-4" />}
                                                Update Live Post
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <Editor
                                    initialContent={editingPost?.content || ''}
                                    onChange={(content) => {
                                        setEditingPost(prev => prev ? { ...prev, content } : null);
                                    }}
                                    onStatsChange={(stats) => {
                                        setEditingPost(prev => {
                                            if (!prev) return null;
                                            // Only update if it actually changed to prevent loops
                                            const newReadTime = stats.readTime.toString();
                                            if (prev.read_time === newReadTime) return prev;
                                            return { ...prev, read_time: newReadTime };
                                        });
                                    }}
                                    onSave={handleSave}
                                    isSaving={isSaving}
                                />
                            </>
                        )}
                    </div>
                )}
            </main>

            {/* Custom Delete Confirmation Modal */}
            {
                postToDelete && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => !isDeleting && setPostToDelete(null)}
                        />
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 border border-gray-100 animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Delete Post?</h2>
                            <p className="text-center text-gray-500 font-medium mb-8">
                                Are you sure you want to delete <span className="text-gray-900 font-bold">"{postToDelete.title || 'Untitled Post'}"</span>? This action cannot be undone.
                            </p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    disabled={isDeleting}
                                    onClick={() => setPostToDelete(null)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors border border-transparent"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isDeleting}
                                    onClick={handleDelete}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Yes, Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            {/* Custom Image Delete Confirmation Modal */}
            {
                imageToDelete && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                            onClick={() => !isDeleting && setImageToDelete(null)}
                        />
                        <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 border border-gray-100 animate-in zoom-in-95 duration-200">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Delete Image?</h2>
                            <p className="text-center text-gray-500 font-medium mb-8">
                                Are you sure you want to delete <span className="text-gray-900 font-bold">"{imageToDelete.name}"</span>? It will be removed from all posts using it.
                            </p>

                            <div className="flex gap-3 mt-4">
                                <button
                                    disabled={isDeleting}
                                    onClick={() => setImageToDelete(null)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors border border-transparent"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isDeleting}
                                    onClick={handleDeleteImage}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Yes, Delete'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FFFCF4]" />}>
            <AdminPageContent />
        </Suspense>
    );
}
