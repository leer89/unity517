import type { Metadata } from "next";
import "./globals.css";
import SiteFooter from "@/components/SiteFooter";

// Fonts: using a system stack for the visual MVP so the build has no external
// font-fetch dependency. Swap to next/font/google (Bebas Neue + Inter) before
// production — globals.css already references --font-display / --font-body,
// so the only change needed there will be re-adding the next/font imports.

export const metadata: Metadata = {
  title: "Unity n Music 517",
  description: "Underground music + events out of Lansing, MI. Run by Unity n Music 517.",
  metadataBase: new URL("https://unity.makotechs.com"),
  openGraph: {
    title: "Unity n Music 517",
    description: "Underground music + events out of Lansing, MI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
