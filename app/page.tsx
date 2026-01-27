import HomeClient from "@/components/HomeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brigo | The AI-Powered Study Platform (Exam Prep & Podcasts)",
  description: "Brigo is the all-in-one AI study platform. Predict exam questions, generate smart flashcards, and turn your lecture notes into study podcasts instantly.",
  openGraph: {
    title: "Brigo | AI-Powered Exam Prediction & Study Podcasts",
    description: "The definitive AI study platform for students. Predict your next exam and turn any material into audio summaries.",
  }
};

export default function Home() {
  return <HomeClient />;
}
