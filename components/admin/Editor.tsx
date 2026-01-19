"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import {
    Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3,
    Link as LinkIcon, Image as ImageIcon, Save, ArrowLeft, Loader2,
    Check, X
} from 'lucide-react';
import { uploadImage } from '@/lib/supabase-posts';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface EditorProps {
    initialContent: string;
    onChange?: (content: string) => void;
    onStatsChange?: (stats: { words: number; readTime: number }) => void;
    onSave?: (content: string) => void;
    isSaving: boolean;
}

const MenuBar = ({ editor, onUpload, isUploading }: { editor: any, onUpload: (file: File) => Promise<void>, isUploading: boolean }) => {
    const [isLinkOpen, setIsLinkOpen] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    if (!editor) return null;

    const toggleLink = () => {
        if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run();
            return;
        }
        const previousUrl = editor.getAttributes('link').href;
        setLinkUrl(previousUrl || '');
        setIsLinkOpen(true);
    };

    const setLink = () => {
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            // Ensure URL has a protocol
            let formattedUrl = linkUrl;
            if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith('mailto:') && !formattedUrl.startsWith('tel:')) {
                formattedUrl = `https://${formattedUrl}`;
            }

            const { from, to } = editor.state.selection;
            if (from === to) {
                // If no selection, insert the URL as text and link it
                editor.chain().focus().insertContent({
                    type: 'text',
                    text: linkUrl,
                    marks: [{ type: 'link', attrs: { href: formattedUrl } }]
                }).run();
            } else {
                // If text is selected, link the selection
                editor.chain().focus().extendMarkRange('link').setLink({ href: formattedUrl }).run();
            }
        }
        setIsLinkOpen(false);
        setLinkUrl('');
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset the input value so the same file can be selected again
        event.target.value = '';

        await onUpload(file);
    };

    return (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50 rounded-t-xl relative">
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
                onClick={toggleLink}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${editor.isActive('link') ? 'bg-gray-200 text-[#FF4D00]' : 'text-gray-600'}`}
                title="Add Link"
            >
                <LinkIcon className="w-4 h-4" />
            </button>
            <label className={`p-2 rounded hover:bg-gray-200 transition-colors cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : 'text-gray-600'}`} title="Add Image">
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-[#FF4D00]" /> : <ImageIcon className="w-4 h-4" />}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileSelect} disabled={isUploading} />
            </label>

            {/* Premium Link Input Popover */}
            {isLinkOpen && (
                <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-gray-200 shadow-xl rounded-2xl z-[60] flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                    <input
                        type="url"
                        placeholder="Paste link..."
                        className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm outline-none w-64 focus:border-[#FF4D00]"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') setLink();
                            if (e.key === 'Escape') setIsLinkOpen(false);
                        }}
                    />
                    <button
                        onClick={setLink}
                        className="p-1.5 bg-[#FF4D00] text-white rounded-lg hover:scale-105 transition-transform"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setIsLinkOpen(false)}
                        className="p-1.5 bg-gray-100 text-gray-500 rounded-lg hover:scale-105 transition-transform"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

const CustomImage = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            'data-loading': {
                default: null,
                parseHTML: element => element.getAttribute('data-loading'),
                renderHTML: attributes => {
                    if (!attributes['data-loading']) {
                        return {}
                    }
                    return {
                        'data-loading': attributes['data-loading'],
                    }
                },
            },
        }
    },
});

export default function Editor({ initialContent, onChange, onStatsChange, onSave, isSaving }: EditorProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const processImageUpload = async (file: File, editorInstance: any) => {
        if (!file || isUploading) return;

        // 1. Create a local preview URL immediately
        const localUrl = URL.createObjectURL(file);

        setIsUploading(true);
        toast.loading('Optimizing & uploading...', { id: 'upload' });

        try {
            // 2. Insert the image with the local URL
            editorInstance.chain()
                .focus()
                .setImage({ src: localUrl })
                .updateAttributes('image', { 'data-loading': 'true' })
                .run();

            // 3. Upload to Supabase (optimization happens inside uploadImage)
            const publicUrl = await uploadImage(file);

            // 4. Update the image src in the editor
            const doc = editorInstance.state.doc;
            let pos = -1;
            doc.descendants((node: any, p: number) => {
                if (node.type.name === 'image' && node.attrs.src === localUrl) {
                    pos = p;
                }
            });

            if (pos !== -1) {
                editorInstance.chain().focus().setNodeSelection(pos).updateAttributes('image', {
                    src: publicUrl,
                    'data-loading': null
                }).run();

                if (onChange) {
                    onChange(editorInstance.getHTML());
                }
            }

            toast.success('Image ready!', { id: 'upload' });
        } catch (error: any) {
            console.error('Upload error:', error);
            // Cleanup on fix
            const doc = editorInstance.state.doc;
            let pos = -1;
            doc.descendants((node: any, p: number) => {
                if (node.type.name === 'image' && node.attrs.src === localUrl) {
                    pos = p;
                }
            });
            if (pos !== -1) {
                editorInstance.chain().focus().setNodeSelection(pos).deleteSelection().run();
            }
            toast.error(`Upload failed: ${error.message || 'Error'}`, { id: 'upload' });
        } finally {
            setIsUploading(false);
            URL.revokeObjectURL(localUrl);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                HTMLAttributes: {
                    class: 'text-[#0044FF] underline decoration-1 underline-offset-4 font-semibold',
                },
            }),
            CustomImage.configure({
                HTMLAttributes: {
                    class: 'rounded-2xl mx-auto h-auto my-12 border border-black/5 shadow-2xl block transition-all duration-300 w-full md:max-w-[600px]',
                },
            }),
            Placeholder.configure({
                placeholder: 'Start writing your next insight...',
                emptyEditorClass: 'is-editor-empty',
            }),
            CharacterCount.configure({
                mode: 'nodeSize',
            }),
        ],
        content: initialContent,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'focus:outline-none',
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || []);
                const imageItem = items.find(item => item.type.startsWith('image'));

                if (imageItem) {
                    const file = imageItem.getAsFile();
                    if (file) {
                        processImageUpload(file, editor);
                        return true; // Handle it
                    }
                }
                return false;
            },
            transformPastedHTML(html) {
                return html.replace(/<span style="[^"]*">/g, '<span>')
                    .replace(/<p style="[^"]*">/g, '<p>')
                    .replace(/<h[1-6] style="[^"]*">/g, (match) => match.split(' ')[0] + '>');
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
            if (onStatsChange) {
                const words = editor.storage.characterCount.words();
                const readTime = Math.max(1, Math.ceil(words / 200));
                onStatsChange({ words, readTime });
            }
        },
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
    });

    return (
        <div className={`w-full bg-white rounded-xl border transition-all duration-300 shadow-sm overflow-hidden ${isFocused ? 'border-[#FF4D00] shadow-md shadow-[#FF4D00]/5' : 'border-gray-200'}`}>
            <MenuBar editor={editor} onUpload={(file) => processImageUpload(file, editor)} isUploading={isUploading} />
            <div className="p-5 min-h-[500px] prose prose-gray max-w-none 
                prose-p:font-quicksand prose-p:text-gray-700
                prose-headings:font-quicksand prose-headings:text-black blog-editor">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}
