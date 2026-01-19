"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import TransformSection from "@/components/sections/TransformSection";
import FeaturesSection from "@/components/sections/FeaturesSection";

import { gsap } from "@/lib/gsap";
import { useGSAP } from "@gsap/react";

export default function HomeClient() {
    const [activeMockup, setActiveMockup] = useState(0);
    const mockups = ["/app-mockup.png", "/app-mockup-2.png"];
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
        const timer = setInterval(() => {
            setActiveMockup((prev) => (prev + 1) % mockups.length);
        }, 4000); // Change image every 4 seconds
        return () => clearInterval(timer);
    }, []);

    return (
        <main className="min-h-screen bg-[#FFFCF4] flex flex-col items-center px-4 pt-3 lg:pt-4 overflow-x-hidden">

            {/* Header */}
            <header className="w-full flex items-center justify-start py-1 px-1 lg:px-2 mb-2 lg:mb-4 gap-3">
                <Image
                    src="/app-icon.png"
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
                    <div className="mb-0 lg:mb-0 -mt-2 lg:-mt-6">
                        <Image
                            src="/1000-users.png"
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
                            className="text-black text-center whitespace-nowrap"
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
                            className="text-[#FF4D00]"
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
                            href="#"
                            className="transition-transform hover:scale-105 active:scale-95 flex-1 lg:flex-none max-w-[140px] lg:max-w-[160px]"
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
                        <a
                            href="#"
                            className="transition-transform hover:scale-105 active:scale-95 flex-1 lg:flex-none max-w-[155px] lg:max-w-[180px]"
                        >
                            <Image
                                src="/google-play-badge.png"
                                alt="Get it on Google Play"
                                width={180}
                                height={48}
                                className="h-10 lg:h-12 w-full lg:w-auto object-contain"
                            />
                        </a>
                    </div>
                </div>

                {/* App Mockups with Fade Transition */}
                <div className="w-full flex justify-center px-4 -mt-2 lg:mt-0 relative z-30">
                    <div className="relative w-full max-w-[320px] lg:max-w-[310px] mb-10 lg:mb-20 transition-all duration-700">
                        {mockups.map((src, index) => (
                            <div
                                key={src}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeMockup === index ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                <Image
                                    src={src}
                                    alt={`Brigo App Mockup ${index + 1}`}
                                    width={1000}
                                    height={2023}
                                    className="w-full h-auto drop-shadow-2xl"
                                    priority={index === 0}
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
            <footer className="w-full mt-24 py-12 text-center text-gray-400 text-[13px] font-bold uppercase tracking-[0.2em] border-t border-gray-100">
                <div className="flex justify-center gap-6 mb-4">
                    <Link href="/blog" className="hover:text-black cursor-pointer transition-colors">Blog</Link>
                    <Link href="/privacy" className="hover:text-black cursor-pointer transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-black cursor-pointer transition-colors">Terms</Link>
                    <span className="hover:text-black cursor-pointer transition-colors">Contact</span>
                    <span className="hover:text-black cursor-pointer transition-colors">FAQ</span>
                </div>
                <p>© 2025 Brigo. All rights reserved.</p>
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
                    src="/brigo-peeking.png"
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
                    src="/brigo-peeking.png"
                    alt="Brigo Mascot Peeking"
                    width={400}
                    height={266}
                    className="w-auto h-24 lg:h-52 drop-shadow-xl"
                />
            </div>

        </main>
    );
}
