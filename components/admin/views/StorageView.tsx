"use client";

import { ImageIcon, Loader2, Copy, ExternalLink, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface StorageViewProps {
    images: any[];
    isImagesLoading: boolean;
    onRefresh: () => void;
    onDeleteImage: (image: any) => void;
    posts: any[];
}

export default function StorageView({ images, isImagesLoading, onRefresh, onDeleteImage, posts }: StorageViewProps) {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Cloud Storage</h1>
                    <p className="text-gray-500 font-medium">Manage and reuse your uploaded assets</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onRefresh}
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
                                            onClick={() => onDeleteImage(img)}
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
    );
}
