import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kristine Fung | Full Stack Software Developer",
  description:
    "Personal website of Kristine Fung, a full stack software developer. Experienced in TypeScript, React, Node.js, GoLang, Flutter, AWS, and more.",
  keywords: [
    "Kristine Fung", "Full Stack Developer", "Software Engineer", "Programmer", "TypeScript", "React", "Node.js", "GoLang", "Flutter", "AWS", "Portfolio"
  ],
  authors: [{ name: "Kristine Fung", url: "https://kristinefung.com" }],
  creator: "Kristine Fung",
  robots: "index, follow",
  themeColor: "#0a1628",
  openGraph: {
    title: "Kristine Fung | Full Stack Software Developer",
    description: "Personal website of Kristine Fung, a full stack software developer.",
    url: "https://kristinefung.com",
    siteName: "Kristine Fung Portfolio",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Kristine Fung Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="canonical" href="https://kristinefung.com" />
        <meta httpEquiv="Content-Language" content="en" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
