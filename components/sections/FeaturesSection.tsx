"use client";

import SectionLabel from "../ui/SectionLabel";
import FeatureCard from "../ui/FeatureCard";
import AnimatedText from "../ui/AnimatedText";
import AnimatedFlashcards from "../ui/AnimatedFlashcards";
import AITutorInput from "../ui/AITutorInput";
import AdaptiveQuizUI from "../ui/AdaptiveQuizUI";
import AccuracyPredictor from "../ui/AccuracyPredictor";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useRef } from "react";

export default function FeaturesSection() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        // Force a refresh after a small delay to ensure layout is settled
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        gsap.fromTo(".feature-card-item",
            {
                y: 60,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".features-grid",
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                duration: 0.8,
                stagger: 0.15,
                ease: "power2.out",
            }
        );

        return () => clearTimeout(timer);
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative z-20 bg-[#FFFCF4] pt-12 pb-32 lg:pt-16 lg:pb-48 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 lg:mb-20 cursor-default">
                    <SectionLabel>02 FEATURES</SectionLabel>
                    <h2 className="text-black mt-8 heading-large">
                        <AnimatedText tag="div">
                            Master your exams with
                        </AnimatedText>
                        <AnimatedText tag="div" className="text-[#FF4D00]">
                            superpowers.
                        </AnimatedText>
                    </h2>
                </div>

                <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    <FeatureCard
                        className="feature-card-item rounded-[2.5rem] min-h-[240px]"
                        number="01 PREDICT"
                        title="Exam Predictor"
                        description="AI predicts your exam questions with high accuracy."
                        variant="light"
                    >
                        <AccuracyPredictor />
                    </FeatureCard>

                    <FeatureCard
                        className="feature-card-item lg:col-span-2 bg-[#111827] rounded-[3rem] min-h-[240px]"
                        number="02 LEARN"
                        title="Study Podcasts"
                        description="Turn any material into audio. Listen while you walk, gym or commute."
                        image="/features/podcasts.webp"
                        variant="dark"
                    />

                    <FeatureCard
                        className="feature-card-item rounded-[2.5rem] min-h-[240px]"
                        number="03 MEMORIZE"
                        title="Smart Flashcards"
                        description="Spaced repetition ensuring you never forget a concept."
                        variant="light"
                    >
                        <AnimatedFlashcards />
                    </FeatureCard>

                    <FeatureCard
                        className="feature-card-item rounded-[2.5rem] min-h-[240px]"
                        number="04 ASK"
                        title="24/7 AI Tutor"
                        description="Get instant answers, explanations, and step-by-step guides."
                        variant="light"
                    >
                        <AITutorInput />
                    </FeatureCard>

                    <FeatureCard
                        className="feature-card-item rounded-[2.5rem] min-h-[240px]"
                        number="05 TEST"
                        title="Adaptive Quizzes"
                        description="Practice tests that adapt to your knowledge level."
                        variant="light"
                    >
                        <AdaptiveQuizUI />
                    </FeatureCard>
                </div>
            </div>
        </section>
    );
}
