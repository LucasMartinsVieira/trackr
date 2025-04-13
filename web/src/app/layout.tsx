import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TrackrThemeProvider } from "@/components/providers/theme-provider";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import { UseQueryClientProvider } from "@/components/providers/tanstack-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trackr",
  description: "Track your reading journey",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <TrackrThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <UseQueryClientProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
              </div>
            </UseQueryClientProvider>
          </AuthProvider>
        </TrackrThemeProvider>
      </body>
    </html>
  );
}
