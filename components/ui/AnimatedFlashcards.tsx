"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

export default function AnimatedFlashcards() {
    const [isInView, setIsInView] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardIndices = [0, 1, 2, 3, 4];

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full flex items-center justify-center pointer-events-none mt-2 pb-2"
        >
            <div className="relative w-full max-w-[240px] h-[120px] flex items-center justify-center">
                {cardIndices.map((i) => {
                    const offset = i - 2;
                    return (
                        <div
                            key={i}
                            className={cn(
                                "absolute w-[70px] h-[95px] rounded-lg shadow-xl flex flex-col p-2 transition-all duration-700 ease-out border border-white/10",
                                // Dark and Premium
                                i === 2 ? "bg-[#3D3E45] z-30 scale-100" : "bg-[#2D2E35] opacity-40 scale-90",
                                i === 1 || i === 3 ? "z-20 opacity-60" : "",
                                i === 0 || i === 4 ? "z-10 opacity-30" : "",

                                // Desktop Hover
                                offset === -2 && "md:group-hover:-translate-x-16 md:group-hover:-rotate-12",
                                offset === -1 && "md:group-hover:-translate-x-8 md:group-hover:-rotate-6",
                                offset === 1 && "md:group-hover:translate-x-8 md:group-hover:rotate-6",
                                offset === 2 && "md:group-hover:translate-x-16 md:group-hover:rotate-12",
                                offset === 0 && "md:group-hover:-translate-y-2 md:group-hover:scale-105",

                                // Mobile Scroll
                                isInView && offset === -2 && "max-md:-translate-x-12 max-md:-rotate-12",
                                isInView && offset === -1 && "max-md:-translate-x-6 max-md:-rotate-6",
                                isInView && offset === 1 && "max-md:translate-x-6 max-md:rotate-6",
                                isInView && offset === 2 && "max-md:translate-x-12 max-md:rotate-12",
                                isInView && offset === 0 && "max-md:-translate-y-1 max-md:scale-105"
                            )}
                            style={{
                                transform: `translateX(${offset * 12}px) rotate(${offset * 2}deg)`,
                            }}
                        >
                            {i === 2 && (
                                <div className="flex-1 flex flex-col">
                                    <p className="text-white text-[7px] font-bold text-center leading-tight mt-1">What's ecology?</p>
                                    <div className="mt-auto pb-1 text-center">
                                        <span className="text-white/20 text-[5px] font-medium tracking-tighter uppercase transition-colors group-hover:text-white/40">See answer</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
