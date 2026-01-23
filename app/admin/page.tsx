"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Post, getAllPosts, createPost, updatePost, deletePost, listImages, deleteImage } from '@/lib/supabase-posts';
import { useSearchParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

// Sub-components
import AdminNav from '@/components/admin/AdminNav';
import AuthView from '@/components/admin/AuthView';
import DeleteModal from '@/components/admin/DeleteModal';

// Views
import DashboardView from '@/components/admin/views/DashboardView';
import EditorialListView from '@/components/admin/views/EditorialListView';
import StorageView from '@/components/admin/views/StorageView';
import EditorView from '@/components/admin/views/EditorView';

function AdminPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get('edit');

    // Data State
    const [posts, setPosts] = useState<Post[]>([]);
    const [images, setImages] = useState<any[]>([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    // View & UI State
    const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'storage'>('dashboard');
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [originalPost, setOriginalPost] = useState<Post | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
    const [showStickyBack, setShowStickyBack] = useState(false);
    const [isImagesLoading, setIsImagesLoading] = useState(false);

    // Modals
    const [postToDelete, setPostToDelete] = useState<Post | null>(null);
    const [imageToDelete, setImageToDelete] = useState<any | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const view = editId ? 'edit' : currentView;

    const hasChanges = useMemo(() => {
        if (!editingPost || !originalPost) return false;
        return (
            editingPost.content !== originalPost.content ||
            editingPost.title !== originalPost.title ||
            editingPost.excerpt !== originalPost.excerpt ||
            editingPost.slug !== originalPost.slug ||
            editingPost.cover_image !== originalPost.cover_image
        );
    }, [editingPost, originalPost]);

    // Effects
    useEffect(() => {
        const handleScroll = () => setShowStickyBack(window.scrollY > 150);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
                setPosts([]);
                setImages([]);
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (isLoggedIn) fetchPosts();
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn && currentView === 'storage') fetchImages();
    }, [isLoggedIn, currentView]);

    useEffect(() => {
        if (editId && isLoggedIn && (!editingPost || editingPost.id !== editId)) {
            const loadPost = async () => {
                const data = await getAllPosts();
                const post = data.find(p => p.id === editId);
                if (post) {
                    setEditingPost(post);
                    setOriginalPost(JSON.parse(JSON.stringify(post)));
                } else {
                    router.push('/admin');
                    toast.error('Post not found');
                }
            };
            loadPost();
        }
    }, [editId, isLoggedIn, editingPost, router]);

    // Draft Auto-save Logic
    useEffect(() => {
        if (!editingPost?.id || view !== 'edit' || editingPost.published) return;

        setSaveStatus('saving');
        const timer = setTimeout(async () => {
            try {
                await updatePost(editingPost.id!, editingPost);
                setSaveStatus('saved');
                setOriginalPost(JSON.parse(JSON.stringify(editingPost)));
                fetchPosts();
            } catch (error) {
                setSaveStatus('error');
                toast.error('Auto-save failed');
            }
        }, 1500);

        return () => clearTimeout(timer);
    }, [editingPost, view]);

    // Handlers
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

    const handleLogin = async (email: string, pass: string) => {
        setIsAuthenticating(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
            if (error) toast.error(error.message);
            else toast.success('Welcome back!');
        } catch (err) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleNewPost = async () => {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
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

    const handleDeletePost = async () => {
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

    if (isCheckingAuth) return <div className="min-h-screen bg-[#FFFCF4]" />;

    if (!isLoggedIn) return <AuthView onLogin={handleLogin} isAuthenticating={isAuthenticating} />;

    return (
        <div className="min-h-screen bg-[#F9F9F9] font-quicksand">
            <Toaster position="top-right" />

            <AdminNav
                currentView={view as any}
                onViewChange={(v) => {
                    setEditingPost(null);
                    setCurrentView(v);
                    router.push('/admin');
                }}
            />

            <main className="p-4 lg:p-10 min-h-screen">
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

                {view === 'dashboard' && (
                    <DashboardView
                        posts={posts}
                        imagesCount={images.length}
                        onNewPost={handleNewPost}
                        onEditPost={(p) => router.push(`/admin?edit=${p.id}`)}
                        onViewAllPosts={() => setCurrentView('list')}
                    />
                )}

                {view === 'list' && (
                    <EditorialListView
                        posts={posts}
                        onNewPost={handleNewPost}
                        onEditPost={(p) => router.push(`/admin?edit=${p.id}`)}
                        onDeletePost={setPostToDelete}
                    />
                )}

                {view === 'storage' && (
                    <StorageView
                        images={images}
                        isImagesLoading={isImagesLoading}
                        onRefresh={fetchImages}
                        onDeleteImage={setImageToDelete}
                        posts={posts}
                    />
                )}

                {view === 'edit' && (
                    <EditorView
                        editingPost={editingPost}
                        saveStatus={saveStatus}
                        hasChanges={hasChanges}
                        isSaving={isSaving}
                        onBack={() => router.push('/admin')}
                        onUpdateTitle={(title, slug) => setEditingPost(prev => prev ? { ...prev, title, slug } : null)}
                        onUpdateSlug={(slug) => setEditingPost(prev => prev ? { ...prev, slug } : null)}
                        onUpdateExcerpt={(excerpt) => setEditingPost(prev => prev ? { ...prev, excerpt } : null)}
                        onUpdateDate={(date) => setEditingPost(prev => prev ? { ...prev, date } : null)}
                        onTogglePublish={async () => {
                            if (!editingPost) return;
                            const isPublishing = !editingPost.published;
                            const now = new Date();
                            const today = now.toISOString().split('T')[0];

                            // Only set published_at and default date if it's the FIRST time publishing
                            const isFirstTimePublishing = isPublishing && !editingPost.published_at;

                            const updated = {
                                ...editingPost,
                                published: isPublishing,
                                published_at: isFirstTimePublishing ? now.toISOString() : editingPost.published_at,
                                // Only update the string date if it's the first time and hasn't been manually set by creation
                                date: isFirstTimePublishing ? today : editingPost.date
                            };

                            setEditingPost(updated);
                            try {
                                setIsSaving(true);
                                await updatePost(updated.id!, updated);
                                setOriginalPost(JSON.parse(JSON.stringify(updated)));
                                toast.success(isPublishing ? 'Post is now live!' : 'Post reverted to draft');
                                fetchPosts();
                            } catch (err) {
                                toast.error('Failed to update status');
                            } finally {
                                setIsSaving(false);
                            }
                        }}
                        onUpdateContent={(content) => setEditingPost(prev => prev ? { ...prev, content } : null)}
                        onUpdateStats={(stats) => {
                            setEditingPost(prev => {
                                if (!prev) return null;
                                const newReadTime = `${stats.readTime} min read`;
                                if (prev.read_time === newReadTime) return prev;
                                return { ...prev, read_time: newReadTime };
                            });
                        }}
                        onSave={handleSave}
                    />
                )}
            </main>

            <DeleteModal
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleDeletePost}
                title="Delete Post?"
                description={<>Are you sure you want to delete <span className="text-gray-900 font-bold">"{postToDelete?.title || 'Untitled Post'}"</span>? This action cannot be undone.</>}
                isDeleting={isDeleting}
            />

            <DeleteModal
                isOpen={!!imageToDelete}
                onClose={() => setImageToDelete(null)}
                onConfirm={handleDeleteImage}
                title="Delete Image?"
                description={<>Are you sure you want to delete <span className="text-gray-900 font-bold">"{imageToDelete?.name}"</span>? It will be removed from all posts using it.</>}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default function AdminPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#FFFCF4]" />}>
            <AdminPageContent />
        </Suspense>
    );
}
