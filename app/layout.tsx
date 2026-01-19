import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Brigo - The AI-Powered Study Companion",
  description: "Stop struggling. Start studying smarter. Brigo transforms your notes into interactive study tools.",
  icons: {
    icon: [
      { url: "/app-icon.png" },
      { url: "/app-icon.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/app-icon.png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${quicksand.variable} antialiased bg-[#FFFCF4] text-gray-900 text-base font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
