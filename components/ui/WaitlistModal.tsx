"use client";

import { useState } from "react";
import { X, CheckCircle2, Loader2, Mail, Smartphone } from "lucide-react";
import { joinWaitlist } from "@/app/actions/waitlist";
import { toast } from "react-hot-toast";

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("email", email);

        const result = await joinWaitlist(formData);

        if (result.error) {
            toast.error(result.error);
            setIsLoading(false);
        } else {
            setIsSuccess(true);
            setIsLoading(false);
            setTimeout(() => {
                onClose();
                // Reset after closing
                setTimeout(() => {
                    setIsSuccess(false);
                    setEmail("");
                }, 300);
            }, 3000);
        }
    };

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-3xl border border-gray-100 animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-50"
                >
                    <X className="w-6 h-6" />
                </button>

                {!isSuccess ? (
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-[#FF4D00]/10 rounded-2xl flex items-center justify-center mb-6">
                            <Smartphone className="w-8 h-8 text-[#FF4D00]" />
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Android Coming Soon</h2>
                        <p className="text-gray-500 font-medium mb-8 leading-relaxed">
                            Join 1,000+ students on the waitlist to be the first to know when we launch on the Play Store.
                        </p>

                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    required
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-[#FF4D00] focus:bg-white px-12 py-4 rounded-2xl outline-none transition-all font-medium text-gray-900"
                                />
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-[#FF4D00] text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-[#FF4D00]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    "Join Waitlist"
                                )}
                            </button>
                        </form>

                        <p className="mt-6 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                            Exclusive Early Access Benefits Included
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center py-8">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">You're in!</h2>
                        <p className="text-gray-500 font-medium leading-relaxed">
                            We've added you to the waitlist. <br /> Check your inbox for a confirmation.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
