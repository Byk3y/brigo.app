"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export default function AccuracyPredictor() {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
                if (!entry.isIntersecting) {
                    setCount(0); // Reset for re-animation
                }
            },
            { threshold: 0.2 } // Start a bit earlier
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible && !isHovered) return;

        const duration = isHovered ? 800 : 2000; // Faster on hover
        const target = 98;
        const startTime = performance.now();
        const startCount = isHovered ? Math.floor(target * 0.8) : 0; // "Jitter" from 80% on hover

        const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easeOutQuad = (t: number) => t * (2 - t);
            const currentCount = Math.floor(startCount + (easeOutQuad(progress) * (target - startCount)));

            setCount(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        const animationId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationId);
    }, [isVisible, isHovered]);

    return (
        <div
            ref={containerRef}
            className="relative w-full flex flex-col items-center justify-center mt-6 group/accuracy"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Background Track */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="38"
                        className="fill-none stroke-gray-100/50"
                        strokeWidth="4"
                    />
                    {/* Animated Progress Circle */}
                    <circle
                        cx="48"
                        cy="48"
                        r="38"
                        className="fill-none stroke-[#FF4D00] transition-all duration-300 ease-out"
                        strokeWidth="5"
                        strokeDasharray={238.76}
                        strokeDashoffset={238.76 - (238.76 * count) / 100}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Counter Text */}
                <div className="relative flex flex-col items-center justify-center">
                    <div className="flex items-baseline">
                        <span className="text-3xl font-black text-[#FF4D00] tracking-tighter font-quicksand">
                            {count}
                        </span>
                        <span className="text-sm font-bold text-[#FF4D00]/60 ml-0.5">%</span>
                    </div>
                </div>

                {/* Decorative scanning beams */}
                <div className="absolute inset-0 border-[0.5px] border-[#FF4D00]/5 rounded-full scale-125 group-hover/accuracy:scale-150 group-hover/accuracy:opacity-0 transition-all duration-1000" />
            </div>

            {/* "Verified" Badge */}
            <div className="mt-4 flex items-center gap-1.5 bg-[#FF4D00]/5 px-3 py-1 rounded-full group-hover/accuracy:bg-[#FF4D00]/10 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Expert Verified</span>
            </div>
        </div>
    );
}
