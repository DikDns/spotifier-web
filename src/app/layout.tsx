import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { GeistSans } from "geist/font/sans";

import { PHProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "SPOTifier",
  description:
    "SPOTifier takes SPOT to the modern era. SPOTifier or 'Sistem Pembelajaran Online Terpadu' Modifier is a web application that modifies SPOT-UPI User Interface to be more modern and user-friendly, adapting modern tech-stack.",
  icons: [{ rel: "icon", url: "/favicon.png" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <TRPCReactProvider>
        <PHProvider>
          <body>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </PHProvider>
      </TRPCReactProvider>
    </html>
  );
}
