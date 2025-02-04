"use client"
import { ThemeProvider } from "@/components//theme-provider";
import { siteConfig } from "@/config//site";
import { cn } from "@/utils/cn";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("pk_test_51NdqE3IY0qE25NdyxTXob1eiY7tdkTRM3SFHj9MF4wvrlLPYmDjlhOSkD60kBr5BC3xWOhXF19RPYzsAWKYAw3xm000IXpDhCC");
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className)}>
        <Elements stripe={stripePromise}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>

          <Toaster position="top-center" reverseOrder={false} />
        </Elements>
      </body>
    </html>
  );
}
