import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Support Center | Brigo Help & Documentation",
    description: "Get help with Brigo's AI Exam Prediction, Study Podcasts, and Smart Flashcards. Find guides on billing, troubleshooting, and more.",
    openGraph: {
        title: "Brigo Support Center",
        description: "Official guides and help documentation for Brigo, the AI study companion.",
    }
};

export default function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
