import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title: "Terms of Service - Brigo",
    description: "Terms of Service for Brigo, the AI-powered study platform.",
};

export default function TermsPage() {
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
                        terms of service
                    </h1>
                    <p className="text-gray-500 italic text-sm">
                        Last Updated: January 9, 2026
                    </p>
                </header>

                {/* Content */}
                <div className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-headings:lowercase prose-strong:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700">
                    <p>
                        Welcome to <strong>Brigo</strong>! These Terms of Service (&quot;Terms&quot;) govern your use of the Brigo mobile application and related services (the &quot;Service&quot;). By using Brigo, you agree to these Terms. If you do not agree, please do not use the Service.
                    </p>

                    <hr className="my-12 border-gray-200" />

                    <h2>1. Description of Service</h2>
                    <p>
                        Brigo is an AI-powered study platform that allows users to upload materials (PDFs, images, text) to generate study aids such as flashcards, quizzes, and audio overviews. The Service also includes a gamified &quot;Pet Companion&quot; system to track study progress.
                    </p>

                    <h2>2. Eligibility</h2>
                    <p>
                        You must be at least 13 years old to use Brigo. If you are under the age of majority in your jurisdiction, you must have the consent of a parent or legal guardian to use the Service.
                    </p>

                    <h2>3. User Accounts</h2>
                    <ul>
                        <li><strong>Registration:</strong> You must provide accurate information when creating an account (via Email OTP, Google, or Apple Sign-In).</li>
                        <li><strong>Security:</strong> You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.</li>
                        <li><strong>Termination:</strong> We reserve the right to suspend or terminate your account at our discretion, without notice, for conduct that violates these Terms.</li>
                    </ul>

                    <h2>4. User Content</h2>
                    <ul>
                        <li><strong>Ownership:</strong> You retain ownership of any study materials and content you upload to Brigo (&quot;User Content&quot;).</li>
                        <li><strong>License to Brigo:</strong> By uploading User Content, you grant Brigo a world-wide, non-exclusive, royalty-free license to process, store, and use your content solely for the purpose of providing and improving the Service (e.g., generating AI study aids).</li>
                        <li><strong>Prohibited Content:</strong> You agree not to upload content that is illegal, infringing on intellectual property rights, or contains malicious code.</li>
                    </ul>

                    <h2>5. AI-Generated Content & Disclaimers</h2>
                    <ul>
                        <li><strong>Nature of AI:</strong> Brigo uses Artificial Intelligence (including Google Gemini and OpenAI models) to generate study aids. AI can make mistakes and may occasionally produce inaccurate, incomplete, or biased information.</li>
                        <li><strong>User Responsibility:</strong> You are solely responsible for verifying the accuracy of all AI-generated content (Flashcards, Quizzes, Audio) before using it for exams or academic purposes. Brigo is a study <em>aid</em> and should not be the sole source of truth for your learning.</li>
                    </ul>

                    <h2>6. Subscription and Payments</h2>
                    <ul>
                        <li><strong>Trial Period:</strong> We may offer a free trial period for premium features. At the end of the trial, access to certain features may be limited unless a subscription is purchased.</li>
                        <li><strong>Payments:</strong> If you choose to purchase a subscription, payments will be processed through third-party providers (Apple App Store or Google Play Store). All fees are non-refundable except where required by law.</li>
                        <li><strong>Changes:</strong> We reserve the right to modify our pricing and subscription tiers at any time.</li>
                    </ul>

                    <h2>7. Prohibited Conduct</h2>
                    <p>You agree not to:</p>
                    <ul>
                        <li>Use the Service for any illegal purpose.</li>
                        <li>Attempt to reverse engineer or &quot;scrape&quot; the Service.</li>
                        <li>Circumvent any usage limits or quota systems (e.g., AI job limits).</li>
                        <li>Share your account credentials with others.</li>
                    </ul>

                    <h2>8. Limitation of Liability</h2>
                    <p>
                        To the maximum extent permitted by law, Brigo shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Service or the inaccuracy of AI-generated content. Brigo is provided &quot;AS IS&quot; without warranties of any kind.
                    </p>

                    <h2>9. Intellectual Property</h2>
                    <p>
                        All rights, title, and interest in the App, including the UI design, the Pet Companion characters, and the &quot;Brigo&quot; brand, are the exclusive property of Brigo.
                    </p>

                    <h2>10. Changes to Terms</h2>
                    <p>
                        We may update these Terms from time to time. We will notify you of any major changes via the app or email. Your continued use of the Service after changes are posted constitutes your acceptance of the new Terms.
                    </p>

                    <h2>11. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p>
                        <strong>Email:</strong> <a href="mailto:support@brigo.app">support@brigo.app</a><br />
                        <strong>Website:</strong> <a href="https://brigo.app">https://brigo.app</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
