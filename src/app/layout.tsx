import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";

const untitledSansRegular = Instrument_Sans({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: "400",
});

const untitledSansMedium = Instrument_Sans({
  variable: "--font-untitled-sans-medium",
  subsets: ["latin"],
  weight: "500",
});

const untitledSansMonoFallback = Instrument_Sans({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Poolside Hero Clone",
  description: "Retro draggable hero section inspired by poolside.ai",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${untitledSansRegular.variable} ${untitledSansMedium.variable} ${untitledSansMonoFallback.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
