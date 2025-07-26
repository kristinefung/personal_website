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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-0B9M8WWTGP"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0B9M8WWTGP');
        ` }} />

        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{
          __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-P6BMDBXW');
        ` }} />
        {/* End Google Tag Manager */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P6BMDBXW"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {children}
      </body>
    </html>
  );
}