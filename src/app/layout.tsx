import "./globals.css";
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { cn } from "@/lib/utils";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcastr",
  description: "Generate your podcasts using AI",
  icons: {
    icon: "/icons/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en">
        <AudioProvider>
          <body className={cn(manrope.className)}>{children}</body>
        </AudioProvider>
      </html>
    </ConvexClerkProvider>
  );
}
