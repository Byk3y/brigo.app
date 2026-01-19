"use client";

import SectionLabel from "../ui/SectionLabel";
import AnimatedText from "../ui/AnimatedText";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useRef } from "react";

const inputs = [
    { icon: "📄", label: "PDFs" },
    { icon: "🎥", label: "YouTube" },
    { icon: "🔗", label: "Links" },
    { icon: "📝", label: "Notes" },
];

export default function TransformSection() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        // Force a refresh after a small delay to ensure layout is settled
        const timer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

        gsap.fromTo(".input-pill",
            {
                y: 40,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                scrollTrigger: {
                    trigger: ".input-grid",
                    start: "top 85%",
                    toggleActions: "play none none none",
                },
                duration: 0.6,
                stagger: 0.1,
                ease: "back.out(1.5)",
            }
        );

        return () => clearTimeout(timer);
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative z-10 bg-[#FFFCF4] pt-24 pb-12 lg:pt-32 lg:pb-16 px-4 md:px-8">
            <div className="max-w-7xl mx-auto text-left">
                <SectionLabel>01 THE MAGIC</SectionLabel>

                <div className="max-w-4xl mb-12 lg:mb-32">
                    <h2 className="text-black mt-8 heading-large">
                        <AnimatedText tag="div">
                            Upload your notes, PDFs, or YouTube links.
                        </AnimatedText>
                        <AnimatedText tag="div" className="text-gray-400 mt-2">
                            Brigo transforms them into everything you need to ace your exams.
                        </AnimatedText>
                    </h2>
                </div>

                <div className="input-grid flex flex-wrap gap-3 md:gap-8">
                    {inputs.map((item, i) => (
                        <div
                            key={i}
                            className="input-pill flex flex-col items-center justify-center w-[calc(50%-12px)] h-24 md:w-40 md:h-40 bg-white/50 rounded-2xl border border-black/5 hover:border-[#FF4D00]/20 hover:bg-white transition-all duration-300 shadow-sm group"
                        >
                            <span className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{item.icon}</span>
                            <span className="font-semibold text-gray-700" style={{ fontFamily: 'var(--font-quicksand)' }}>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
