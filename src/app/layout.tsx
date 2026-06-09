import type { Metadata, Viewport } from "next";
import { Tajawal, Amiri } from "next/font/google";
import "@/styles/globals.css";
import BottomNav from "@/components/BottomNav";
import {
  generateLocalBusinessSchema,
  generateWebSiteSchema,
  generateOrganizationSchema, jsonLd } from "@/lib/schema";

const SITE_URL = "https://asoulaldiafa.com";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
  variable: "--font-tajawal",
  preload: true,
});

// Switched secondary font from Cairo → Amiri for a fresh, more traditional/serif feel
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-amiri",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "أصول الضيافة | خدمات الضيافة الفاخرة في المملكة العربية السعودية",
    template: "%s | أصول الضيافة",
  },
  description:
    "أصول الضيافة - نُحيي أصول الضيافة العربية بفريق صبّابين بزي تراثي، قهوة عربية، شاي وتمور فاخرة. خدمة شاملة لجميع مناطق المملكة العربية السعودية.",
  keywords: [
    "أصول الضيافة",
    "خدمات الضيافة",
    "ضيافة فاخرة",
    "قهوة عربية",
    "صبابين قهوة",
    "ضيافة سعودية",
    "قهوجية ومباشرين",
    "ضيافة المملكة",
    "ضيافة مناسبات VIP",
    "تجهيز طاولات استقبال",
    "تقديمات فاخرة",
    "Asoul Al-Diafa",
    "Saudi hospitality",
    "luxury catering",
  ],
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      "ar-SA": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    siteName: "أصول الضيافة",
    locale: "ar_SA",
    title: "أصول الضيافة | خدمات الضيافة الفاخرة في المملكة",
    description:
      "نحيي أصول الضيافة العربية الأصيلة بفريق صبّابين بزي تراثي وقهوة عربية وتمور فاخرة في جميع مناطق المملكة.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/logo.webp`,
        width: 1200,
        height: 630,
        alt: "أصول الضيافة - خدمات الضيافة الفاخرة",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "أصول الضيافة | خدمات الضيافة الفاخرة",
    description:
      "نحيي أصول الضيافة العربية الأصيلة في جميع مناطق المملكة",
    images: [`${SITE_URL}/logo.webp`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "أصول الضيافة",
    "mobile-web-app-capable": "yes",
    "application-name": "أصول الضيافة",
    "format-detection": "telephone=no",
  },
  category: "hospitality",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`scroll-smooth ${tajawal.variable} ${amiri.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(generateLocalBusinessSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: jsonLd(generateWebSiteSchema()),
          }}
        />
      </head>
      <body className="bg-noir text-pearl antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:px-6 focus:py-3 focus:rounded-full focus:text-noir focus:font-bold focus:outline-none"
          style={{ background: "linear-gradient(135deg, #C5A059, #E2C68E)" }}
        >
          تخطي إلى المحتوى الرئيسي
        </a>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
