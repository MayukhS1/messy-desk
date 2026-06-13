import type { Metadata } from "next";
import { DynaPuff, Nunito } from "next/font/google";
import { Providers } from "@/components/Providers";
import { SketchyFilters } from "@/components/ui/SketchyFilters";
import { getSiteUrl } from "@/lib/env/public";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dynaPuff = DynaPuff({
  variable: "--font-dynapuff",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Messy Desk",
  description: "A playful shared space for couples to hide messages and hunt for hidden notes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${dynaPuff.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col font-sans bg-paper-texture text-foreground"
        suppressHydrationWarning
      >
        <SketchyFilters />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
