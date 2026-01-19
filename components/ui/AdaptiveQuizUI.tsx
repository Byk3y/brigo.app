"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

export default function AdaptiveQuizUI() {
    const options = [
        { label: "Oxidation", correct: false },
        { label: "Photosynthesis", correct: true },
        { label: "Respiration", correct: false },
    ];

    return (
        <div className="relative w-full mt-4 group/quiz transition-all duration-500">
            {/* Question - Integrated directly into the card flow */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-[#FF4D00]/60 tracking-wider">QUIZ #24</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#FF4D00]/20 to-transparent" />
                </div>
                <p className="text-xs font-bold text-gray-800 leading-tight font-quicksand">
                    Which process converts light into energy?
                </p>
            </div>

            {/* Options - More streamlined, less "cardy" */}
            <div className="space-y-1.5">
                {options.map((option, i) => (
                    <div
                        key={i}
                        className={cn(
                            "flex items-center justify-between py-2 px-3 rounded-full border transition-all duration-300",
                            option.correct
                                ? "border-[#FF4D00]/30 bg-[#FF4D00]/5 text-[#FF4D00]"
                                : "border-gray-50 text-gray-500 group-hover/quiz:border-gray-100"
                        )}
                    >
                        <span className="text-[10px] font-bold">{option.label}</span>
                        {option.correct ? (
                            <CheckCircle2 size={12} className="text-[#FF4D00]" />
                        ) : (
                            <Circle size={12} className="text-gray-200" />
                        )}
                    </div>
                ))}
            </div>

            {/* Subdued Background Effect */}
            <div className="absolute -z-10 -inset-4 bg-[#FF4D00]/5 rounded-3xl blur-3xl opacity-0 group-hover/quiz:opacity-100 transition-opacity duration-1000" />
        </div>
    );
}
