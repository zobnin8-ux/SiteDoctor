import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Unbounded } from "next/font/google";

import { ASSETS } from "@/lib/assets";
import { BRAND } from "@/lib/brand";

import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600"],
  variable: "--font-unbounded",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND.name} — узнайте, почему ваш сайт теряет клиентов`,
  description:
    "Бесплатная AI-диагностика сайта за 60 секунд. Покажем, что отпугивает посетителей и что переписать в первую очередь.",
  openGraph: {
    title: `${BRAND.name} — диагностика сайтов`,
    description:
      "Узнайте, почему ваш сайт теряет клиентов. Бесплатно, за 60 секунд.",
    images: [
      {
        url: ASSETS.og.image,
        width: 1200,
        height: 630,
      },
    ],
    locale: "ru_RU",
    type: "website",
    siteName: BRAND.name,
  },
  twitter: {
    card: "summary_large_image",
    images: [ASSETS.og.image],
  },
  icons: {
    icon: [{ url: "/logo/icon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body
        className={`${inter.variable} ${unbounded.variable} ${jetbrainsMono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
