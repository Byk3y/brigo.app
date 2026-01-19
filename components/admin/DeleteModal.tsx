"use client";

import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: React.ReactNode;
    isDeleting: boolean;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title, description, isDeleting }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => !isDeleting && onClose()}
            />
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 border border-gray-100 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">{title}</h2>
                <div className="text-center text-gray-500 font-medium mb-8">
                    {description}
                </div>

                <div className="flex gap-3 mt-4">
                    <button
                        disabled={isDeleting}
                        onClick={onClose}
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors border border-transparent"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isDeleting}
                        onClick={onConfirm}
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
    );
}
