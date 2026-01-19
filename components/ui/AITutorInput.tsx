"use client";

import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

export default function AITutorInput() {
    return (
        <div className="relative w-full mt-4 group/input">
            <div className="space-y-3">
                {/* Secondary Suggestion - Smaller/Tighter */}
                <div className="inline-block bg-white/40 border border-gray-50 rounded-full px-3 py-1.5 transition-all duration-500 hover:bg-white active:scale-95 cursor-pointer">
                    <p className="text-gray-400 text-[9px] font-medium leading-none font-quicksand">
                        "How do I balance redox equations?"
                    </p>
                </div>

                {/* Input Area - More compact height */}
                <div className="flex items-center bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm transition-all duration-500 group-hover/input:shadow-md group-hover/input:border-[#FF4D00]/20">
                    <div className="flex-1 px-2">
                        <p className="text-gray-400 text-[10px] md:text-xs font-medium truncate font-quicksand">
                            what exam questions should i expect?
                        </p>
                    </div>

                    <div className="bg-[#FF4D00] p-1.5 rounded-xl text-white">
                        <Send size={12} strokeWidth={2.5} />
                    </div>
                </div>
            </div>
        </div>
    );
}
