import { cn } from "@/lib/utils";
import Image from "next/image";

interface FeatureCardProps {
    number: string;
    title: string;
    description: string;
    variant?: "light" | "dark";
    className?: string;
    image?: string;
    children?: React.ReactNode;
}

export default function FeatureCard({
    number,
    title,
    description,
    variant = "light",
    className,
    image,
    children,
}: FeatureCardProps) {
    const isDark = variant === "dark";

    return (
        <div
            className={cn(
                "feature-card flex flex-col justify-between relative overflow-hidden group p-6 lg:p-8 transition-all duration-500 rounded-[2rem] hover:-translate-y-2 hover:scale-[1.01]",
                isDark ? "bg-[#111827] text-white shadow-2xl hover:shadow-[#FF4D00]/5" : "bg-white text-gray-900 border border-black/[0.04] shadow-sm hover:shadow-2xl hover:border-black/[0.08]",
                className
            )}
        >
            <div className="relative z-20">
                <div
                    className={cn(
                        "feature-card-label font-bold tracking-widest text-[10px] mb-4 lg:mb-6 uppercase",
                        isDark ? "text-[#FF4D00]" : "text-[#FF4D00]/60"
                    )}
                    style={{ fontFamily: 'var(--font-quicksand)' }}
                >
                    {number}
                </div>
                <h3
                    className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight leading-[1.1] max-w-[90%]"
                    style={{ fontFamily: 'var(--font-quicksand)' }}
                >
                    {title}
                </h3>
                <p
                    className={cn(
                        "text-sm font-medium leading-relaxed max-w-[85%]",
                        isDark ? "text-gray-400" : "text-gray-500"
                    )}
                    style={{ fontFamily: 'var(--font-quicksand)' }}
                >
                    {description}
                </p>
            </div>

            {/* Feature Illustration */}
            {image && (
                <div
                    className={cn(
                        "absolute -right-8 -bottom-8 w-64 h-64 lg:w-80 lg:h-80 transition-all duration-1000 ease-out transform group-hover:-translate-y-8 group-hover:-translate-x-4 group-hover:rotate-3 group-hover:scale-110",
                        !isDark && "mix-blend-multiply opacity-70 group-hover:opacity-100",
                        isDark && "mix-blend-screen invert hue-rotate-180 brightness-[1.2] opacity-40 group-hover:opacity-80"
                    )}
                >
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-contain"
                    />
                </div>
            )}

            {children && (
                <div className="relative z-20 mt-2">
                    {children}
                </div>
            )}
        </div>
    );
}
