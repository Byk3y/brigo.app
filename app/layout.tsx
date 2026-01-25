import type { Metadata, Viewport } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#FFFCF4",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://brigo.app"),
  title: {
    default: "Brigo - The AI-Powered Study Companion",
    template: "%s | Brigo"
  },
  description: "Predict your exam questions, generate smart flashcards, and turn notes into podcasts. Brigo is the ultimate mobile AI study platform.",
  keywords: ["AI exam prediction", "convert notes to podcast", "AI study companion", "smart flashcards generator", "mobile study app for students", "predicted exam questions", "active recall AI", "exam prep AI"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Brigo",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/app-icon.webp" },
      { url: "/app-icon.webp", sizes: "32x32", type: "image/webp" },
    ],
    apple: [
      { url: "/app-icon.webp" },
    ],
  },
  itunes: {
    appId: 'REPLACE_WITH_APP_STORE_ID',
    appArgument: 'https://brigo.app',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://brigo.app",
    siteName: "Brigo",
    title: "Brigo - The AI Mobile Study App",
    description: "The all-in-one mobile AI study platform. Predict exams, generate podcasts, and study anywhere.",
    images: [{
      url: "/app-mockup.webp",
      width: 1200,
      height: 630,
      alt: "Brigo AI Mobile Study Companion"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Brigo - The AI Mobile Study Companion",
    description: "Stop struggling. Start studying smarter on your phone. Predict exams and turn notes into podcasts.",
    images: ["/app-mockup.webp"],
    creator: "@brigoapp",
  },
  verification: {
    google: "c7Lw-quuCUPK_DWf79Yjmp1ukHkKBfsYmFH-fUWTYEA",
    // bing: "REPLACE_WITH_BING_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Brigo",
    "operatingSystem": "iOS, Android",
    "applicationCategory": "EducationApplication",
    "description": "AI-powered mobile study platform that predicts exam questions, generates smart flashcards, and transforms notes into podcasts.",
    "url": "https://brigo.app",
    "logo": "https://brigo.app/app-icon.webp",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Exam Prediction",
      "AI Flashcards",
      "Notes to Podcasts",
      "Smart Study Summaries"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1200"
    }
  };

  return (
    <html lang="en">
      <head>
        {/* Placeholder for Apple Smart App Banner - Will be active once ID is added in metadata */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${quicksand.variable} antialiased bg-[#FFFCF4] text-gray-900 text-base font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
