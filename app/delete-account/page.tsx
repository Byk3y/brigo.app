import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title: "Delete your Brigo account - Brigo",
    description:
        "How to delete your Brigo account and all associated data. Delete from inside the app or request deletion by email.",
    alternates: {
        canonical: "https://brigo.app/delete-account",
    },
};

export default function DeleteAccountPage() {
    return (
        <main className="min-h-screen bg-[#FFFCF4] px-6 py-20 pb-40">
            <div className="max-w-3xl mx-auto">
                {/* Back Link */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to home
                    </Link>
                </div>

                {/* Header */}
                <header className="text-center mb-24">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 lowercase mb-6">
                        delete your brigo account
                    </h1>
                    <p className="text-gray-500 italic text-sm">
                        Last Updated: April 14, 2026
                    </p>
                </header>

                {/* Content */}
                <div className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-headings:lowercase prose-strong:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700">
                    <p>
                        We&apos;re sorry to see you go. You can delete your Brigo account and all associated data at any time using the steps below.
                    </p>

                    <hr className="my-12 border-gray-200" />

                    <h2>1. Delete from inside the app (recommended)</h2>
                    <ol>
                        <li>Open Brigo on your phone.</li>
                        <li>Tap your profile or go to <strong>Settings</strong>.</li>
                        <li>Tap <strong>Account</strong> → <strong>Delete Account</strong>.</li>
                        <li>Confirm the deletion. Your account and data will be queued for permanent deletion.</li>
                    </ol>

                    <hr className="my-12 border-gray-200" />

                    <h2>2. Delete by email (if you can&apos;t access the app)</h2>
                    <p>
                        If you don&apos;t have the app installed or can&apos;t sign in, email <a href="mailto:support@brigo.app?subject=Delete%20my%20account">support@brigo.app</a> from the email address tied to your Brigo account with the subject line <strong>&quot;Delete my account&quot;</strong>. We&apos;ll process the request within <strong>7 business days</strong>.
                    </p>

                    <hr className="my-12 border-gray-200" />

                    <h2>3. What gets deleted</h2>
                    <ul>
                        <li>Profile (name, email, avatar, preferences, push token)</li>
                        <li>All notebooks, uploaded materials, and generated content (flashcards, quizzes, podcasts, predictions)</li>
                        <li>Streaks, points, pet state</li>
                        <li>Chat history with study materials</li>
                        <li>Analytics and crash logs tied to your user id</li>
                        <li>Friend streak records (your data is removed; your friend&apos;s data is preserved for their own account)</li>
                    </ul>

                    <hr className="my-12 border-gray-200" />

                    <h2>4. What cannot be deleted by us</h2>
                    <ul>
                        <li>Subscription payment records (handled by Google Play or the Apple App Store — request refunds directly from them)</li>
                        <li>Aggregated, anonymized analytics that can no longer be tied back to your identity</li>
                    </ul>

                    <hr className="my-12 border-gray-200" />

                    <h2>5. Timing</h2>
                    <p>
                        Deletion is queued immediately and completed within <strong>30 days</strong>. After deletion, your account cannot be recovered — you&apos;d need to sign up fresh.
                    </p>

                    <hr className="my-12 border-gray-200" />

                    <h2>Questions?</h2>
                    <p>
                        Contact us at <a href="mailto:support@brigo.app">support@brigo.app</a>.
                    </p>
                </div>
            </div>
        </main>
    );
}
