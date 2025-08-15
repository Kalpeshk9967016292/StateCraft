import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import FirebaseAnalytics from '@/components/FirebaseAnalytics';
import Script from 'next/script';
import { Analytics } from "@vercel/analytics/react";

const siteConfig = {
  name: 'StateCraft',
  description: 'StateCraft is a free-to-play political simulation game where you become the Chief Minister of an Indian state. Make policy decisions, manage crises, and navigate the complex world of politics to lead your state to prosperity and get re-elected.',
  url: 'https://statecraft.iamtiksha.com',
  ogImage: 'https://statecraft.iamtiksha.com/og-image.png', // You should create this image
  links: {
    twitter: 'https://twitter.com/your-twitter-handle', // Add your twitter handle
    github: 'https://github.com/your-repo' // Add your github repo
  },
  keywords: [
    'political simulation game',
    'politics game',
    'government simulation',
    'Chief Minister game',
    'Indian politics game',
    'statecraft',
    'strategy game',
    'governance game',
    'free to play',
  ],
}

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: 'Studio',
      url: 'https://firebase.google.com/studio',
    },
  ],
  creator: 'Studio',
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@your-twitter-handle', // Add your twitter handle
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4648414963251970"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-body antialiased h-full">
        <FirebaseAnalytics />
        {children}
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
