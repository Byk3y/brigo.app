import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
    title: "Privacy Policy - Brigo",
    description: "Privacy Policy for Brigo, the AI-powered study platform.",
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#FFFCF4] px-6 py-20 pb-40">
            <div className="max-w-3xl mx-auto">
                {/* Back Link */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to home
                    </Link>
                </div>

                {/* Header */}
                <header className="text-center mb-24">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 lowercase mb-6">
                        privacy policy
                    </h1>
                    <p className="text-gray-500 italic text-sm">
                        Last Updated: January 9, 2026
                    </p>
                </header>

                {/* Content */}
                <div className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-headings:lowercase prose-strong:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700">
                    <p>
                        Welcome to <strong>Brigo</strong> (referred to as &quot;the App&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We are committed to protecting your privacy and providing a secure environment for your study and exam preparation. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
                    </p>
                    <p>
                        By using Brigo, you agree to the collection and use of information in accordance with this policy.
                    </p>

                    <hr className="my-12 border-gray-200" />

                    <h2>1. Information We Collect</h2>

                    <h3>A. Personal Identification Information</h3>
                    <p>When you create an account or use our service, we may collect:</p>
                    <ul>
                        <li><strong>Account Data:</strong> Email address, first name, and last name.</li>
                        <li><strong>Profile Data:</strong> Profile picture (avatar) and username.</li>
                        <li><strong>Authentication Data:</strong> We use third-party providers (Google and Apple) to facilitate secure sign-ins. These providers may share your name, email, and profile picture with us.</li>
                    </ul>

                    <h3>B. User-Generated Content</h3>
                    <p>Brigo is designed to help you study. We store the following content you provide:</p>
                    <ul>
                        <li><strong>Study Materials:</strong> Uploaded PDFs, images, text notes, and URLs to external resources (e.g., YouTube).</li>
                        <li><strong>AI-Generated Content:</strong> Flashcards, quizzes, and audio overviews generated from your materials.</li>
                        <li><strong>Study Progress:</strong> Quiz scores, flashcard completion status, study session duration, and study streaks.</li>
                        <li><strong>Pet Companion Data:</strong> Your study pet’s name, growth stage, and points.</li>
                    </ul>

                    <h3>C. Device and Usage Data</h3>
                    <ul>
                        <li><strong>Device Information:</strong> We collect information about your mobile device (e.g., model, OS version).</li>
                        <li><strong>Analytics:</strong> We use Mixpanel to understand how you interact with the app so we can improve the experience. This includes tracking feature usage and performance.</li>
                        <li><strong>Error Reporting:</strong> We use Sentry to collect crash reports and error logs to help us fix bugs and improve stability.</li>
                        <li><strong>Notifications:</strong> If you opt-in, we store an Expo Push Token to send you study reminders and updates.</li>
                    </ul>

                    <hr className="my-12 border-gray-200" />

                    <h2>2. How We Use Your Information</h2>
                    <p>We use the collected data for the following purposes:</p>
                    <ul>
                        <li><strong>To Provide the Service:</strong> Managing your account and providing study tools.</li>
                        <li><strong>AI Processing:</strong> Using Artificial Intelligence to extract text from your materials and generate study aids (Flashcards, Quizzes, Audio).</li>
                        <li><strong>Personalization:</strong> Customizing your experience, including your study pet’s growth and personalized study reminders.</li>
                        <li><strong>App Improvement:</strong> Analysing usage trends and fixing technical issues.</li>
                        <li><strong>Communication:</strong> Sending essential service updates and responding to support requests.</li>
                    </ul>

                    <hr className="my-12 border-gray-200" />

                    <h2>3. Data Sharing and Third-Party Services</h2>
                    <p>We do not sell your personal data. To provide our core features, we share certain data with trusted service providers:</p>
                    <ul>
                        <li><strong>Supabase:</strong> Our primary backend provider. All your account data, study materials, and database records are securely hosted on Supabase.</li>
                        <li><strong>Google AI (Gemini):</strong> We send your study materials (PDFs, images, text) to Google Gemini to perform OCR (Text Extraction), generate study scripts, and convert text to speech for audio overviews.</li>
                        <li><strong>OpenRouter (Anthropic/OpenAI):</strong> We use these models to generate high-quality flashcards and quiz questions from your study content.</li>
                        <li><strong>Mixpanel & Sentry:</strong> Used for analytics and error tracking respectively.</li>
                        <li><strong>Apple/Google Identity:</strong> Used for secure authentication.</li>
                    </ul>

                    <hr className="my-12 border-gray-200" />

                    <h2>4. Permissions We Request</h2>
                    <p>To provide a full experience, the App may request access to:</p>
                    <ul>
                        <li><strong>Camera:</strong> To take photos of physical study materials and notes.</li>
                        <li><strong>Photo Library:</strong> To upload existing documents or images.</li>
                        <li><strong>Microphone/Audio:</strong> To allow audio playback of study overviews, including in the background.</li>
                        <li><strong>Notifications:</strong> To send you study reminders.</li>
                    </ul>
                    <p>You can manage these permissions at any time through your device settings.</p>

                    <hr className="my-12 border-gray-200" />

                    <h2>5. Local Storage</h2>
                    <p>We use local storage (AsyncStorage and SecureStore) on your device to:</p>
                    <ul>
                        <li>Keep you logged in (Auth tokens).</li>
                        <li>Cache your study materials and pet progress for faster loading.</li>
                        <li>Remember your playback position in audio overviews.</li>
                        <li>Store your theme preferences (Light/Dark mode).</li>
                    </ul>

                    <hr className="my-12 border-gray-200" />

                    <h2>6. Data Retention and Deletion</h2>
                    <ul>
                        <li><strong>Retention:</strong> We retain your data as long as your account is active.</li>
                        <li><strong>Deletion:</strong> You have the right to delete your account at any time. You can perform this action directly within the Brigo app by navigating to <strong>Settings &gt; Account Management &gt; Delete My Account</strong>. When you confirm deletion, all your personal data, study materials, and records are permanently and immediately removed from our databases.</li>
                        <li><strong>Soft Deletion:</strong> Some items, like notebooks, may be &quot;soft-deleted&quot; (hidden from your view) initially but can be permanently removed upon request or account deletion.</li>
                    </ul>

                    <hr className="my-12 border-gray-200" />

                    <h2>7. Security</h2>
                    <p>
                        We take the security of your data seriously. We use Supabase’s Row-Level Security (RLS) to ensure that only you can access your private study materials. While we strive to use commercially acceptable means to protect your information, no method of transmission over the internet is 100% secure.
                    </p>

                    <hr className="my-12 border-gray-200" />

                    <h2>8. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
                    </p>

                    <hr className="my-12 border-gray-200" />

                    <h2>9. Contact Us</h2>
                    <p> If you have any questions about this Privacy Policy, please contact us at: </p>
                    <p>
                        <strong>Email:</strong> <a href="mailto:support@brigo.app">support@brigo.app</a><br />
                        <strong>Website:</strong> <a href="https://brigo.app">https://brigo.app</a>
                    </p>
                </div>
            </div>
        </main>
    );
}
