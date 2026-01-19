"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Save, ArrowLeft, Loader2
} from 'lucide-react';
import { uploadImage } from '@/lib/supabase-posts';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface EditorProps {
    initialContent: string;
    onSave: (content: string) => void;
    isSaving: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null;

    const addLink = () => {
        const url = window.prompt('URL');
        if (url) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }
    };

    const addImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            toast.loading('Uploading image...', { id: 'upload' });
            const url = await uploadImage(file);
            editor.chain().focus().setImage({ src: url }).run();
            toast.success('Image uploaded!', { id: 'upload' });
        } catch (error) {
            toast.error('Failed to upload image', { id: 'upload' });
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bold') ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Bold"
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('italic') ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Italic"
            >
                <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Heading 2"
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Heading 3"
            >
                <Heading3 className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('bulletList') ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Bullet List"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('orderedList') ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('blockquote') ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Quote"
            >
                <Quote className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button
                onClick={addLink}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Add Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <label className="p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer text-gray-600" title="Add Image">
                <ImageIcon className="w-4 h-4" />
                <input type="file" className="hidden" accept="image/*" onChange={addImage} />
            </label>
        </div>
    );
};

export default function Editor({ initialContent, onSave, isSaving }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#0044FF] underline decoration-1 underline-offset-4 font-semibold',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl max-w-full h-auto my-8 border border-black/5 shadow-lg',
                },
            }),
            Placeholder.configure({
                placeholder: 'Start writing your masterwork...',
            }),
        ],
        content: initialContent,
    });

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <MenuBar editor={editor} />
            <div className="p-6 min-h-[500px] prose prose-lg prose-gray max-w-none prose-p:font-quicksand prose-p:text-gray-700 prose-headings:font-quicksand prose-headings:text-black blog-editor">
                <EditorContent editor={editor} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                <button
                    onClick={() => onSave(editor?.getHTML() || '')}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-[#FF4D00] text-white px-6 py-2 rounded-lg font-bold hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-[#FF4D00]/20"
                >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Content
                </button>
            </div>

            <style jsx global>{`
                .blog-editor .ProseMirror:focus {
                    outline: none;
                }
                .blog-editor .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    );
}
