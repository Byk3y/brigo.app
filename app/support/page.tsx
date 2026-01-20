"use client";

import React, { useRef, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Search, X } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

// Support Content Data
const SUPPORT_SECTIONS = [
    {
        id: "prediction",
        title: "🏆 Featured: Exam Prediction",
        keywords: "ai, exam, prediction, syllabus, model, marking, notes",
        content: (
            <>
                <p><strong>&quot;How does Brigo know what will be on my exam?&quot;</strong></p>
                <p>Brigo&apos;s Exam Prediction is our most advanced feature. It doesn&apos;t just &quot;guess&quot;—it analyzes.</p>
                <ul>
                    <li><strong>Frequency Analysis:</strong> Brigo identifies recurring themes, vocabulary density, and core concepts within your notes and past papers.</li>
                    <li><strong>Trend Detection:</strong> If you upload papers from multiple years, Brigo identifies &quot;Rising&quot; topics (appearing more recently) and &quot;Stable&quot; foundational topics.</li>
                    <li><strong>Model Marking Schemes:</strong> For essay-style predictions, we provide answers structured as marking schemes so you know exactly how to earn the most points.</li>
                </ul>
                <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 text-orange-900 mt-6">
                    <strong>Pro Tip:</strong> For the most accurate predictions, upload your <strong>Course Syllabus</strong> alongside your <strong>Lecture Notes</strong>. This gives the AI the &quot;blueprint&quot; and the &quot;content&quot; to compare.
                </div>
            </>
        )
    },
    {
        id: "pet",
        title: "🐾 The Study Pet & Streaks",
        keywords: "pet, companion, habit, streaks, freeze, missions, tasks, focus points",
        content: (
            <>
                <p>Your study journey is powered by your companion.</p>
                <ul>
                    <li><strong>Growth Stages:</strong> Your pet grows through 3 stages based on your &quot;Focus Points.&quot; Earn points by completing quizzes and reviewing flashcards.</li>
                    <li><strong>Missions &amp; Tasks:</strong> Check your Pet Sheet for &quot;Foundational&quot; and &quot;Daily&quot; tasks. These are designed to keep your study habit consistent.</li>
                    <li><strong>The &quot;Dying&quot; State:</strong> If you miss a study day without a <strong>Streak Freeze</strong>, your pet will enter a weakened state.</li>
                    <li><strong>Salvaging a Streak:</strong> If you lose your streak, you can use a Streak Freeze within 24 hours to restore it and &quot;revive&quot; your pet.</li>
                    <li><strong>Streak Freezes:</strong> You earn these through consistent study or milestones. They are your safety net for busy days!</li>
                </ul>
            </>
        )
    },
    {
        id: "science",
        title: "🧬 The Brigo Methodology",
        keywords: "science, methodology, psychology, active recall, spaced repetition, mastery",
        content: (
            <>
                <p>Brigo isn&apos;t just an app; it&apos;s a scientific study tool built on two pillars of educational psychology:</p>
                <ul>
                    <li><strong>Active Recall:</strong> Instead of passively re-reading your notes (which is often ineffective), Brigo’s quizzes and flashcards force your brain to retrieve information. Research shows that <strong>Active Recall is up to 3x more effective</strong> than traditional reviewing.</li>
                    <li><strong>Spaced Repetition:</strong> Our Study Pet and streak mechanics are designed to bring you back to your materials at the optimal intervals. By reviewing content just as you are about to forget it, you move information from short-term memory to long-term mastery.</li>
                </ul>
            </>
        )
    },
    {
        id: "studio",
        title: "🎙️ AI Studio Tools",
        keywords: "audio, podcast, studio, quizzes, flashcards, limits, pro, generation",
        content: (
            <>
                <p>Transform your materials into active study aids.</p>
                <ul>
                    <li><strong>Audio Overviews:</strong> Brigo creates high-quality, podcast-style summaries of your notebooks. Perfect for listening during commutes or at the gym.</li>
                    <li><strong>Smart Quizzes:</strong> We generate multiple-choice, short-answer, and essay questions tailored to your education level.</li>
                    <li><strong>Flashcard Decks:</strong> Automatically extracted key terms and concepts for quick active recall sessions.</li>
                    <li><strong>Daily Limits:</strong> To ensure a high-quality experience for everyone, we have daily limits on how many high-level resources (Audio, Quizzes, Predictions) can be generated.</li>
                    <li><strong>Unlimited with Brigo Pro:</strong> Upgrading to Pro removes these limits, giving you infinite generations for all your study materials.</li>
                </ul>
            </>
        )
    },
    {
        id: "troubleshooting",
        title: "🧪 Troubleshooting Tips",
        keywords: "bad, outputs, hallucination, results, quality, context, handwritten, blurred",
        content: (
            <>
                <p>Because Brigo uses Large Language Models (LLMs), there is a small chance the AI may &quot;hallucinate&quot; or provide a prediction that feels slightly off.</p>
                <p><strong>How to get better results:</strong></p>
                <ul>
                    <li><strong>Provide More Context:</strong> If a prediction is vague, try uploading more specific materials (e.g., your actual past exam papers instead of just general notes).</li>
                    <li><strong>Clear &amp; Legible Uploads:</strong> If your handwritten notes are blurry, the AI might misinterpret key terms. Ensure high-contrast, well-lit photos.</li>
                </ul>
            </>
        )
    },
    {
        id: "billing",
        title: "💳 Billing & Subscriptions",
        keywords: "billing, sub, apple, google, pay, settings, cancel, refunds, ios, android",
        content: (
            <>
                <p>Subscriptions are managed through your device settings since Brigo uses the Apple App Store and Google Play Store for all transactions.</p>
                <h3>On iPhone/iPad (iOS):</h3>
                <p>1. Open the <strong>Settings</strong> app {">"} Tap your <strong>Name</strong> {">"} <strong>Subscriptions</strong>.</p>
                <h3>On Android:</h3>
                <p>1. Open the <strong>Play Store</strong> app {">"} Tap your <strong>Profile Icon</strong> {">"} <strong>Payments &amp; Subscriptions</strong>.</p>
                <p><strong>Refunds:</strong> Handled entirely by Apple and Google. Visit <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a> for Apple or <a href="https://support.google.com/googleplay/workflow/9813544">Google Play</a> for Android.</p>
            </>
        )
    },
    {
        id: "availability",
        title: "🌏 Platform Availability",
        keywords: "availability, platforms, ios, android, web, desktop, coming soon, iPad",
        content: (
            <>
                <ul>
                    <li><strong>iPhone &amp; iPad:</strong> Fully supported. Requires iOS 15.0 or later.</li>
                    <li><strong>Android:</strong> Coming Soon.</li>
                    <li><strong>Desktop &amp; Web:</strong> Coming Soon.</li>
                </ul>
            </>
        )
    },
    {
        id: "contact",
        title: "📧 Contact Us",
        keywords: "email, contact, support, instagram, twitter, social, help, stuck",
        content: (
            <>
                <p>Still stuck? We&apos;re here. Our team usually responds within 24 hours.</p>
                <ul>
                    <li><strong>Support Email:</strong> <a href="mailto:support@brigo.app">support@brigo.app</a></li>
                    <li><strong>Socials:</strong> DM us on Instagram or Twitter <strong>@BrigoApp</strong></li>
                </ul>
            </>
        )
    }
];

export default function SupportPage() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useGSAP(() => {
        gsap.from(".animate-content", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
        });
    }, { scope: containerRef });

    const filteredSections = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return SUPPORT_SECTIONS;

        return SUPPORT_SECTIONS.filter(section =>
            section.title.toLowerCase().includes(query) ||
            section.keywords.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <main ref={containerRef} className="min-h-screen bg-[#FFFCF4] font-quicksand pb-32 overflow-x-hidden">
            {/* Nav */}
            <header className="w-full flex items-center justify-between py-6 px-6 lg:px-12 bg-transparent sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Image
                        src="/app-icon.webp"
                        alt="Brigo Icon"
                        width={36}
                        height={36}
                        className="rounded-xl shadow-sm"
                    />
                    <span className="text-2xl font-bold text-gray-900 tracking-tight">
                        brigo
                    </span>
                </Link>

                <Link
                    href="/"
                    className="flex items-center gap-2 text-[11px] font-bold text-gray-600 uppercase tracking-[0.2em] hover:text-black transition-colors"
                >
                    <ChevronLeft className="w-3 h-3" />
                    Back to home
                </Link>
            </header>

            <article className="max-w-3xl mx-auto px-6 pt-4 lg:pt-8">
                {/* Header */}
                <header className="mb-10 animate-content text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#1A1A1A] mb-4 leading-[1.1] tracking-tight">
                        support center
                    </h1>
                    <p className="text-lg text-gray-500 font-medium mb-10">
                        How can we help you study better? Explore our guides below.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-lg mx-auto group mb-8">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for a topic..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 rounded-xl bg-white border border-black/5 shadow-lg shadow-orange-900/5 outline-none transition-all text-base placeholder:text-gray-300 focus:border-orange-500/20"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Minimalist Horizontal Categories */}
                    {!searchQuery && (
                        <div className="relative -mx-6 mb-4">
                            <div className="flex items-center justify-start lg:justify-center gap-2 overflow-x-auto px-6 pb-2 no-scrollbar">
                                {SUPPORT_SECTIONS.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => {
                                            const el = document.getElementById(section.id);
                                            if (el) {
                                                const offset = 100; // Adjust for sticky header
                                                const bodyRect = document.body.getBoundingClientRect().top;
                                                const elementRect = el.getBoundingClientRect().top;
                                                const elementPosition = elementRect - bodyRect;
                                                const offsetPosition = elementPosition - offset;

                                                window.scrollTo({
                                                    top: offsetPosition,
                                                    behavior: 'smooth'
                                                });
                                            }
                                        }}
                                        className="whitespace-nowrap px-3 py-1.5 rounded-full border border-black/5 bg-white text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:border-orange-200 hover:text-orange-600 transition-all shadow-sm active:scale-95"
                                    >
                                        {section.id === 'prediction' ? 'Prediction' :
                                            section.id === 'pet' ? 'Study Pet' :
                                                section.id === 'science' ? 'Science' :
                                                    section.id === 'studio' ? 'Tools' :
                                                        section.id === 'troubleshooting' ? 'Help' :
                                                            section.id === 'billing' ? 'Billing' :
                                                                section.id === 'availability' ? 'Platforms' : 'Contact'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </header>

                {/* Content */}
                <div className="animate-content prose prose-base max-w-none prose-p:leading-[1.6] prose-p:mb-4 prose-p:text-gray-700 prose-headings:text-black prose-headings:font-bold prose-h2:scroll-mt-24 prose-h2:mb-4 prose-h2:mt-12 prose-h2:text-2xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-lg prose-ul:list-disc prose-ul:pl-5 prose-ul:marker:text-gray-900 prose-li:my-1 prose-img:rounded-xl prose-img:w-full prose-img:md:max-w-[500px] prose-img:mx-auto prose-strong:text-black prose-a:text-orange-600 hover:prose-a:text-orange-700">

                    {filteredSections.length > 0 ? (
                        filteredSections.map((section, idx) => (
                            <div key={section.id} className="animate-section">
                                <h2 id={section.id}>{section.title}</h2>
                                {section.content}
                                {idx < filteredSections.length - 1 && (
                                    <hr className="my-16 border-black/5" />
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <div className="inline-flex p-4 bg-gray-50 rounded-full mb-6 text-gray-400">
                                <Search className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No guides found</h3>
                            <p className="text-gray-500">We couldn&apos;t find any guide for &quot;{searchQuery}&quot;. <br />Try using different keywords or scroll down for our categories.</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="mt-8 px-6 py-2 bg-black text-white rounded-full font-bold hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest"
                            >
                                Show all guides
                            </button>
                        </div>
                    )}

                </div>
            </article>

            {/* Footer */}
            <footer className="max-w-3xl mx-auto mt-24 px-6 py-12 border-t border-black/5 text-center text-gray-600 text-xs font-bold uppercase tracking-[0.2em]">
                <p>© 2026 Brigo. All rights reserved.</p>
            </footer>
        </main>
    );
}
