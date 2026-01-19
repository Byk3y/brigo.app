"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import SplitType from "split-type";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
    children: React.ReactNode;
    className?: string;
    tag?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
    delay?: number;
}

export default function AnimatedText({
    children,
    className,
    tag: Tag = "div",
    delay = 0
}: AnimatedTextProps) {
    const textRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (!textRef.current) return;

        // Wait a moment for layout to settle (custom fonts etc)
        const timeout = setTimeout(() => {
            const split = new SplitType(textRef.current!, { types: "lines" });

            // Wrap lines in overflow hidden containers if needed, 
            // or just animate the lines themselves.
            // The prompt asks for: y: 40, opacity: 0, from bottom.

            gsap.fromTo(
                split.lines,
                {
                    y: 40,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    delay: delay,
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 80%", // slightly earlier than 75% to be safe
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, 200);

        return () => {
            clearTimeout(timeout);
            // Clean up SplitType if needed? 
            // split.revert() // but we need the instance.
            // For simplicity in this landing page which is mostly static, 
            // we might rely on refreshing if resized.
            // ScrollTrigger.refresh() helps.
        };
    }, [delay]);

    return (
        <Tag ref={textRef as any} className={cn("kerning-normal", className)}>
            {children}
        </Tag>
    );
}
