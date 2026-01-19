"use client";

import Image from 'next/image';
import { LogOut, LayoutDashboard, FileText, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdminNavProps {
    currentView: 'dashboard' | 'list' | 'storage' | 'edit';
    onViewChange: (view: 'dashboard' | 'list' | 'storage') => void;
}

export default function AdminNav({ currentView, onViewChange }: AdminNavProps) {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'list', label: 'Editorial', icon: FileText },
        { id: 'storage', label: 'Storage', icon: Globe },
    ];

    return (
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
                    {navItems.map((nav) => (
                        <button
                            key={nav.id}
                            onClick={() => onViewChange(nav.id as any)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${(currentView === nav.id || (currentView === 'edit' && nav.id === 'list')) ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/20' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            <nav.icon className="w-4 h-4" />
                            {nav.label}
                        </button>
                    ))}
                </div>

                {/* Desktop Sign Out */}
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
    );
}
