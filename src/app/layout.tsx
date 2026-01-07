// layout.tsx 
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner"
import { AppProvider } from "@/context/AppContext"; 
import Header from "@/components/Header";
import SplashScreen from "@/components/SplashScreen";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flexy Pay 0.1.3-alpha",
  description: "Offline desktop application for managing modems and USSD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-[100%] flex flex-col bg-gray-50 `}
      >
        <Toaster position="top-center" richColors />
        
        {/* Splash screen shown on app start */}
        <SplashScreen />

        {/* AppProvider wraps everything that needs context */}
        <AppProvider> 
          <Header/>
          <div className="flex-1 overflow-y-auto scrollable">
            {children}
          </div>
        </AppProvider>
        
      </body>
    </html>
  );
}
