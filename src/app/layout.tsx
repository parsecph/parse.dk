import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Parse Copenhagen — We make software people use";
const description =
  "Parse is a small studio in Copenhagen. We build and ship our own products: AI website builders, developer tools, launch trackers and more. Fifteen so far.";

export const metadata: Metadata = {
  metadataBase: new URL("https://parse.dk"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://parse.dk",
    siteName: "Parse Copenhagen",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#050507",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-fog">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
