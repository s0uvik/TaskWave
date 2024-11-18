import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskWave",
  description: "Project management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} dotted-background`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            variables: {
              colorBackground: "#0a111f",
              colorInputBackground: "#2D3748",
            },
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header />
            <main className=" min-h-screen">{children}</main>
            <Toaster richColors />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
