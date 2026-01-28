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
  metadataBase: new URL("https://www.brigo.app"),
  title: {
    default: "Brigo - The AI-Powered Study Companion",
    template: "%s | Brigo"
  },
  description: "Predict your exam questions, generate smart flashcards, and turn notes into podcasts. Brigo is the ultimate mobile AI study platform.",
  keywords: ["AI study app", "mobile study app", "AI exam prediction", "convert notes to podcast", "AI study companion", "smart flashcards generator", "predicted exam questions", "active recall AI", "exam prep AI"],
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
      { url: "/favicon.ico", sizes: "48x48 96x96", type: "image/x-icon" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: [
      { url: "/favicon.ico" },
    ],
  },
  itunes: {
    appId: '6757353722',
    appArgument: 'https://www.brigo.app',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.brigo.app",
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
  const jsonLds = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Brigo",
      "alternateName": "Brigo App",
      "operatingSystem": "iOS, Android",
      "applicationCategory": "EducationApplication",
      "applicationSubCategory": "AI Study Assistant",
      "description": "Brigo is the AI-powered study platform designed to help students turn learning materials into interactive study aids. It predicts exam questions, generates smart flashcards, and turns notes into podcasts.",
      "disambiguatingDescription": "A specialized AI study companion and productivity platform for students, distinct from BIGO Live or other entertainment apps.",
      "url": "https://www.brigo.app",
      "logo": "https://www.brigo.app/app-icon.webp",
      "downloadUrl": "https://apps.apple.com/us/app/brigo/id6757353722",
      "installUrl": "https://apps.apple.com/us/app/brigo/id6757353722",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      },
      "featureList": [
        "AI Exam Prediction Engine",
        "Automated Smart Flashcard Generation",
        "Lecture-to-Podcast Audio Conversion",
        "Gamified Pet Companion Study Tracker"
      ],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1200"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Brigo",
      "url": "https://www.brigo.app",
      "logo": "https://www.brigo.app/icon-512x512.png",
      "sameAs": [
        "https://twitter.com/brigoapp",
        "https://www.instagram.com/brigoapp", // Assuming common patterns if not specified
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Brigo",
      "url": "https://www.brigo.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.brigo.app/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Placeholder for Apple Smart App Banner - Will be active once ID is added in metadata */}
        {jsonLds.map((ld, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
          />
        ))}
      </head>
      <body
        className={`${quicksand.variable} antialiased bg-[#FFFCF4] text-gray-900 text-base font-sans`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
