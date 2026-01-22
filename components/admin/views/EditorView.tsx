"use client";

import { ArrowLeft, Loader2, Check, Globe, Save as SaveIcon } from 'lucide-react';
import Editor from '@/components/admin/Editor';
import { Post } from '@/lib/supabase-posts';

interface EditorViewProps {
    editingPost: Post | null;
    saveStatus: 'saved' | 'saving' | 'error';
    hasChanges: boolean;
    isSaving: boolean;
    onBack: () => void;
    onUpdateTitle: (title: string, slug: string) => void;
    onUpdateSlug: (slug: string) => void;
    onUpdateExcerpt: (excerpt: string) => void;
    onTogglePublish: () => void;
    onUpdateContent: (content: string) => void;
    onUpdateStats: (stats: { readTime: number }) => void;
    onSave: (content?: string) => void;
}

export default function EditorView({
    editingPost,
    saveStatus,
    hasChanges,
    isSaving,
    onBack,
    onUpdateTitle,
    onUpdateSlug,
    onUpdateExcerpt,
    onTogglePublish,
    onUpdateContent,
    onUpdateStats,
    onSave
}: EditorViewProps) {
    if (!editingPost) {
        return (
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF4D00] mb-4" />
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading Post...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors font-bold text-sm lg:text-base"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                    {editingPost.published && (
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
                            {editingPost.published ? 'Current Live Version' : 'Saved'}
                        </span>
                    )}
                    {saveStatus === 'error' && (
                        <span className="text-red-500">Save Failed</span>
                    )}
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-6">
                <input
                    type="text"
                    value={editingPost.title || ''}
                    onChange={(e) => {
                        const newTitle = e.target.value;
                        const newSlug = newTitle
                            .toLowerCase()
                            .replace(/[^\w ]+/g, '')
                            .replace(/ +/g, '-');
                        onUpdateTitle(newTitle, newSlug);
                    }}
                    placeholder="Post Title"
                    className="w-full text-4xl font-bold text-gray-900 outline-none mb-6 placeholder:text-gray-200"
                />

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Slug</label>
                        <input
                            type="text"
                            value={editingPost.slug || ''}
                            onChange={(e) => onUpdateSlug(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium border border-transparent focus:border-gray-200 outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Read Time</label>
                        <div className="w-full px-4 py-2 bg-gray-50 rounded-lg text-sm font-bold text-gray-700 border border-transparent">
                            {editingPost.read_time || '1 min read'}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <div className="flex justify-between items-end mb-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Excerpt</label>
                        <span className={`text-[10px] font-bold ${(editingPost.excerpt?.length || 0) >= 150 ? 'text-orange-500' : 'text-gray-400'}`}>
                            {editingPost.excerpt?.length || 0}/160
                        </span>
                    </div>
                    <textarea
                        value={editingPost.excerpt || ''}
                        onChange={(e) => onUpdateExcerpt(e.target.value)}
                        rows={3}
                        maxLength={160}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm font-medium border border-transparent focus:border-gray-200 outline-none resize-none"
                        placeholder="Write a catchy 160-character summary for Google and your blog cards..."
                    />
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-50">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onTogglePublish}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm ${editingPost.published ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-[#FF4D00] text-white hover:scale-105 shadow-lg shadow-[#FF4D00]/20'}`}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                            {editingPost.published ? 'Take Offline (Draft)' : 'Go Live (Publish)'}
                        </button>
                        <div className="flex flex-col">
                            <p className="text-[11px] text-gray-900 font-bold uppercase tracking-tight">
                                Status: {editingPost.published ? 'Live' : 'Draft'}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">
                                {editingPost.published ? 'Visible to the public' : 'Only visible to you'}
                            </p>
                        </div>
                    </div>

                    {editingPost.published && hasChanges && (
                        <button
                            onClick={() => onSave()}
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
                initialContent={editingPost.content || ''}
                onChange={onUpdateContent}
                onStatsChange={onUpdateStats}
                onSave={onSave}
                isSaving={isSaving}
            />
        </div>
    );
}
