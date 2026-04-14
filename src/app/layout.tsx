import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SportsSiteJsonLd } from "@/components/JsonLd";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "كورة غول - بث مباشر لمباريات اليوم | Kora Goal",
    template: "%s | كورة غول"
  },
  description: "منصة كورة غول - المكان الأول لمتابعة البث المباشر لأقوى المباريات العالمية والعربية مجاناً. نتائج المباريات لحظة بلحظة، جدول الترتيب، وآخر أخبار كرة القدم.",
  keywords: ["كورة غول", "بث مباشر", "مباريات اليوم", "كرة قدم", "نتائج المباريات", "مشاهدة مباريات", "kora goal", "football live"],
  authors: [{ name: "كورة غول" }],
  creator: "كورة غول",
  publisher: "كورة غول",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kora-goal.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: '/',
    title: "كورة غول - بث مباشر لمباريات اليوم | Kora Goal",
    description: "منصة كورة غول - بث مباشر للمباريات العالمية والعربية، نتائج لحظة بلحظة، جدول الترتيب، وآخر أخبار كرة القدم.",
    siteName: "كورة غول",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: "كورة غول - منصة المباريات",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "كورة غول - بث مباشر لمباريات اليوم",
    description: "منصة كورة غول - بث مباشر للمباريات العالمية والعربية",
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F0F2F5' },
    { media: '(prefers-color-scheme: dark)', color: '#1877F2' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className={cairo.className}>
        <Header />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>
        <Footer />

        {/* Structured Data for SEO */}
        <SportsSiteJsonLd />
      </body>
    </html>
  );
}
