import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import InviteRedirect from "@/components/InviteRedirect";

const VALID_CODE = /^[A-Z0-9]{8}$/;

type Props = {
  params: Promise<{ code: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;

  return {
    title: "Join me on Brigo!",
    description: "Study together and keep each other accountable",
    alternates: {
      canonical: `https://brigo.app/invite/${code}`,
    },
    openGraph: {
      title: "Join me on Brigo!",
      description: "Study together and keep each other accountable",
      url: `https://brigo.app/invite/${code}`,
      siteName: "Brigo",
      images: [
        {
          url: "/icon-512x512.png",
          width: 512,
          height: 512,
          alt: "Brigo App Icon",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "Join me on Brigo!",
      description: "Study together and keep each other accountable",
      images: ["/icon-512x512.png"],
    },
  };
}

export default async function InvitePage({ params }: Props) {
  const { code } = await params;
  const isValid = VALID_CODE.test(code);

  return (
    <main className="min-h-screen bg-[#FFFCF4] flex items-center justify-center px-5 py-12">
      {isValid && <InviteRedirect code={code} />}

      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <Image
            src="/app-icon.webp"
            alt="Brigo"
            width={48}
            height={48}
            className="rounded-xl"
          />
          <span className="text-2xl font-bold tracking-tight text-gray-900 font-[family-name:var(--font-quicksand)]">
            brigo
          </span>
        </div>

        {isValid ? (
          <>
            {/* Invite message */}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4 font-[family-name:var(--font-quicksand)]">
              You&apos;ve been invited to study together on{" "}
              <span className="text-[#FF4D00]">Brigo!</span>
            </h1>

            <p className="text-gray-500 text-lg mb-8 font-medium font-[family-name:var(--font-quicksand)]">
              Keep each other accountable and ace your exams together.
            </p>

            {/* Invite code */}
            <div className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                Your invite code
              </p>
              <div className="inline-block bg-white border-2 border-dashed border-[#FF4D00]/30 rounded-2xl px-8 py-4">
                <span className="text-3xl font-bold tracking-[0.25em] text-gray-900 font-mono">
                  {code}
                </span>
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="https://apps.apple.com/us/app/brigo/id6757353722"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/app-store-badge.webp"
                  alt="Download on the App Store"
                  width={160}
                  height={48}
                  className="h-12 w-auto"
                />
              </Link>
              <Link
                href="https://play.google.com/store/apps/details?id=com.brigo.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/google-play-badge.webp"
                  alt="Get it on Google Play"
                  width={180}
                  height={48}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Already have the app */}
            <p className="text-sm text-gray-400 font-medium">
              Already have Brigo? This link should open automatically.
            </p>
          </>
        ) : (
          <>
            {/* Invalid code */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-quicksand)]">
              Invalid invite code
            </h1>
            <p className="text-gray-500 text-lg mb-8 font-medium font-[family-name:var(--font-quicksand)]">
              This invite link doesn&apos;t look right. Ask your friend to send you a new one.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#FF4D00] text-white font-semibold rounded-full px-8 py-3 text-sm hover:opacity-90 transition-opacity"
            >
              Go to Brigo
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
