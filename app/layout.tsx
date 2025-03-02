import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Ultimate Todo App",
  description: "A sophisticated Todo application built with Next.js and React",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
