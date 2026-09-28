import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { profile } from "@/data/profile";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gabrielemenghi.is-a.dev"),
  title: `${profile.name} — ${profile.role}`,
  description: profile.headline,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.headline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#07080c" },
  ],
};

// Statistiche con l'Umami di Razor, senza cookie: partono solo se la build conosce
// indirizzo e sito (variabili della CI), quindi mai in locale.
const umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
const umamiSite = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

// Applica il tema prima del rendering per evitare il lampo di colore sbagliato.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t)t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full font-sans">
        {children}
        {umamiUrl && umamiSite && (
          <Script src={`${umamiUrl}/script.js`} data-website-id={umamiSite} data-exclude-search="true" />
        )}
      </body>
    </html>
  );
}
