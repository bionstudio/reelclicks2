import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist_Mono, Instrument_Serif, Manrope } from "next/font/google";
import { PRELOADER_KEY, siteConfig } from "@/lib/config";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "REELCLICKS.IN | Cinematic Wedding & Brand Films in Maharashtra",
    template: "%s | REELCLICKS.IN",
  },
  description: siteConfig.description,
  openGraph: { images: [{ url: "/og", width: 1200, height: 630 }] },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  colorScheme: "dark",
};

// Runs before paint:
//  - data-js: enables reveal styles
//  - data-preloaded: skips the preloader on repeat visits this session
//  - data-lite: low-end device or Data Saver → lighter motion, no background video
const bootScript = `(function(){var d=document.documentElement,n=navigator;d.setAttribute('data-js','');try{if(sessionStorage.getItem('${PRELOADER_KEY}'))d.setAttribute('data-preloaded','')}catch(e){}try{var c=n.connection;if((c&&c.saveData)||(n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2))d.setAttribute('data-lite','')}catch(e){}})();`;

/** Root shell shared by the website and the embedded Studio. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bricolage.variable} ${instrument.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-ink text-paper">{children}</body>
    </html>
  );
}
