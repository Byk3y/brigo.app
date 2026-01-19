"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface AuthViewProps {
    onLogin: (email: string, pass: string) => Promise<void>;
    isAuthenticating: boolean;
}

export default function AuthView({ onLogin, isAuthenticating }: AuthViewProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-[#FFFCF4] flex items-center justify-center p-4 font-quicksand">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-black/5">
                <div className="flex justify-center mb-6">
                    <Image src="/app-icon.webp" alt="Brigo" width={60} height={60} className="rounded-xl" />
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Access</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
