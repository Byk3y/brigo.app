"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import TransformSection from "@/components/sections/TransformSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import WaitlistModal from "@/components/ui/WaitlistModal";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function HomeClient() {
    const [activeMockup, setActiveMockup] = useState(0);
    const [showFloatingCTA, setShowFloatingCTA] = useState(false);
    const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
    const mockups = ["/app-mockup.webp", "/app-mockup-2.webp"];
    const peekingRightRef = useRef<HTMLDivElement>(null);
    const peekingLeftRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!peekingRightRef.current || !peekingLeftRef.current) return;

        const mm = gsap.matchMedia();

        mm.add({
            isMobile: "(max-width: 1023px)",
            isDesktop: "(min-width: 1024px)"
        }, (context) => {
            const { isMobile } = context.conditions as { isMobile: boolean };
            const peekDist = isMobile ? 40 : 80;

            // --- Phase 0: Entry Animation (Cinematic Reveal) ---
            const entryTl = gsap.timeline({
                defaults: { ease: "power3.out", duration: 1 }
            });

            entryTl
                .from(".entry-header", {
                    y: -20,
                    opacity: 0,
                    duration: 0.8
                })
                .from(".entry-badge", {
                    scale: 0.8,
                    opacity: 0,
                    ease: "back.out(1.7)",
                    duration: 0.8
                }, "-=0.4")
                .from(".entry-headline", {
                    y: 30,
                    opacity: 0,
                    duration: 1
                }, "-=0.6")
                .from(".entry-subheadline", {
                    y: 20,
                    opacity: 0,
                    duration: 1
                }, "-=0.8")
                .from(".entry-buttons", {
                    y: 20,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.8
                }, "-=0.8")
                .from(".entry-mockup", {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                    duration: 1.2
                }, "-=1");

            // --- Phase 1: Scroll Animations (Peeking Mascots) ---
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: isMobile ? "600px top" : "800px top",
                    scrub: 1,
                }
            });

            // Phase 1: Top Right Peeks Out
            tl.to(peekingRightRef.current, {
                x: -peekDist,
                duration: 1,
            });

            // Phase 2: Top Right Hides while Bottom Left Appears
            tl.to(peekingRightRef.current, {
                x: 0,
                duration: 1,
            }, "+=0.2");

            tl.to(peekingLeftRef.current, {
                x: peekDist,
                duration: 1,
            }, "<");

            return () => {
                // Cleanup if needed, but GSAP matchMedia handles most of it
            };
        });
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollThreshold = 800; // Show after hero
            setShowFloatingCTA(window.scrollY > scrollThreshold);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveMockup((prev) => (prev + 1) % mockups.length);
        }, 4000); // Change image every 4 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="min-h-screen bg-[#FFFCF4] flex flex-col items-center px-4 pt-3 lg:pt-4 overflow-x-hidden">

            {/* Header */}
            <header className="entry-header w-full flex items-center justify-start py-1 px-1 lg:px-2 mb-2 lg:mb-4 gap-3">
                <Image
                    src="/app-icon.webp"
                    alt="Brigo Icon"
                    width={40}
                    height={40}
                    className="rounded-xl shadow-sm"
                />
                <span
                    className="text-2xl font-bold text-gray-900 tracking-tight"
                >
                    brigo
                </span>
            </header>

            {/* Main Content */}
            <div className="w-full max-w-[150rem] mx-auto text-center flex flex-col items-center">

                {/* Content Section (Heads-up) */}
                <div className="w-full max-w-6xl mx-auto flex flex-col items-center px-4 -mt-2 lg:-mt-4">
                    {/* Social Proof Badge */}
                    <div className="entry-badge mb-0 lg:mb-0 -mt-2 lg:-mt-6">
                        <Image
                            src="/1000-users.webp"
                            alt="4.8 Stars, 1,000+ students"
                            width={240}
                            height={150}
                            className="w-40 lg:w-64 h-auto object-contain"
                            priority
                        />
                    </div>

                    {/* Headline */}
                    <div className="space-y-2 mb-6 lg:mb-10 w-full px-2 -mt-4 lg:-mt-8">
                        <h1
                            className="entry-headline text-black text-center whitespace-nowrap"
                            style={{
                                fontSize: 'clamp(38px, 10vw, 64px)',
                                fontWeight: 700,
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em'
                            }}
                        >
                            Ace Every Exam
                        </h1>
                        <p
                            className="entry-subheadline text-[#FF4D00]"
                            style={{
                                fontSize: 'clamp(18px, 4vw, 32px)',
                                fontWeight: 600,
                                lineHeight: 1.2,
                                letterSpacing: '-0.01em'
                            }}
                        >
                            Predict your exam questions, generate smart flashcards, and turn notes into podcasts.
                        </p>
                    </div>

                    {/* Download Buttons - Side by Side */}
                    <div className="flex flex-row items-center justify-center gap-2 lg:gap-3 mb-10 lg:mb-14 w-full lg:w-auto">
                        {/* App Store Button */}
                        <a
                            href="https://apps.apple.com/us/app/brigo/id6757353722"
                            className="entry-buttons transition-transform hover:scale-105 active:scale-95 flex-1 lg:flex-none max-w-[140px] lg:max-w-[160px]"
                        >
                            <Image
                                src="/app-store-badge.webp"
                                alt="Download on the App Store"
                                width={160}
                                height={48}
                                className="h-10 lg:h-12 w-full lg:w-auto object-contain"
                            />
                        </a>

                        {/* Google Play Button */}
                        <button
                            onClick={() => setIsWaitlistOpen(true)}
                            className="entry-buttons transition-transform hover:scale-105 active:scale-95 flex-1 lg:flex-none max-w-[155px] lg:max-w-[180px] appearance-none"
                        >
                            <Image
                                src="/google-play-badge.webp"
                                alt="Get it on Google Play"
                                width={180}
                                height={48}
                                className="h-10 lg:h-12 w-full lg:w-auto object-contain cursor-pointer"
                            />
                        </button>
                    </div>
                </div>

                {/* App Mockups with Fade Transition */}
                <div className="entry-mockup w-full flex justify-center px-4 -mt-2 lg:mt-0 relative z-30">
                    <div className="relative w-full max-w-[320px] lg:max-w-[310px] mb-10 lg:mb-20 transition-all duration-700">
                        {mockups.map((src, index) => (
                            <div
                                key={src}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeMockup === index ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                <Image
                                    src={src}
                                    alt={index === 0
                                        ? "Brigo AI Exam Prediction Engine - Accuracy Forecasting Interface"
                                        : "Brigo Study Podcasts - Multimodal Learning for Auditory Retention using Dual Coding Theory"
                                    }
                                    width={1000}
                                    height={2023}
                                    className="w-full h-auto drop-shadow-2xl"
                                    priority={true}
                                />
                            </div>
                        ))}
                        {/* Invisible spacer to maintain proportional layout height */}
                        <Image
                            src={mockups[0]}
                            alt="spacer"
                            width={1000}
                            height={2023}
                            className="w-full h-auto opacity-0 pointer-events-none"
                        />
                    </div>
                </div>

            </div>

            {/* High-Impact Features Section */}
            <TransformSection />
            <FeaturesSection />


            {/* Footer */}
            <footer className="w-full mt-24 py-12 text-center text-gray-600 text-[13px] font-bold uppercase tracking-[0.2em] border-t border-gray-100">
                <div className="flex justify-center gap-6 mb-8">
                    <Link href="/blog" className="hover:text-black cursor-pointer transition-colors">Blog</Link>
                    <Link href="/privacy" className="hover:text-black cursor-pointer transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-black cursor-pointer transition-colors">Terms</Link>
                    <Link href="/support" className="hover:text-black cursor-pointer transition-colors">Support</Link>
                    <Link href="/science" className="hover:text-black cursor-pointer transition-colors">Science</Link>
                </div>
                <div className="mb-10 max-w-2xl mx-auto opacity-40 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] lowercase leading-relaxed mb-1">Built on peer-reviewed research in cognitive psychology:</p>
                    <p className="text-[9px] italic lowercase leading-tight">
                        dual coding theory (paivio, 1971) • the testing effect (roediger & karpicke, 2006) • cognitive load theory (sweller, 1988)
                    </p>
                </div>
                <p>© 2026 Brigo. All rights reserved.</p>
            </footer>

            {/* Brigo Peeking Mascot - Top Right */}
            <div
                ref={peekingRightRef}
                className="fixed right-0 top-[25%] lg:top-[30%] z-[100] pointer-events-none"
                style={{
                    transform: 'rotate(-90deg) translateX(100%)',
                    transformOrigin: 'right center'
                }}
            >
                <Image
                    src="/brigo-peeking.webp"
                    alt="Brigo Mascot Peeking"
                    width={400}
                    height={266}
                    className="w-auto h-24 lg:h-52 drop-shadow-xl"
                />
            </div>

            {/* Brigo Peeking Mascot - Bottom Left */}
            <div
                ref={peekingLeftRef}
                className="fixed left-0 bottom-[15%] lg:bottom-[20%] z-[100] pointer-events-none"
                style={{
                    transform: 'rotate(90deg) translateX(-100%)',
                    transformOrigin: 'left center'
                }}
            >
                <Image
                    src="/brigo-peeking.webp"
                    alt="Brigo Mascot Peeking"
                    width={400}
                    height={266}
                    className="w-auto h-24 lg:h-52 drop-shadow-xl"
                />
            </div>

            {/* Floating CTA */}
            <div
                className={`fixed bottom-8 right-8 z-[200] transition-all duration-500 transform ${showFloatingCTA ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-90 pointer-events-none"
                    }`}
            >
                <a
                    href="https://apps.apple.com/us/app/brigo/id6757353722"
                    className="flex items-center gap-3 bg-white/90 backdrop-blur-xl border border-black/5 px-4 py-3 rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all group"
                >
                    <Image
                        src="/app-icon.webp"
                        alt="Brigo"
                        width={32}
                        height={32}
                        className="rounded-lg shadow-sm"
                    />
                    <div className="flex flex-col items-start pr-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF4D00]">Get brigo</span>
                        <span className="text-xs font-bold text-gray-900">App Store</span>
                    </div>
                </a>
            </div>

            <WaitlistModal
                isOpen={isWaitlistOpen}
                onClose={() => setIsWaitlistOpen(false)}
            />

        </main >
    );
}
