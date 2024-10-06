import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Chaikh - Location Tracker Platform",
  description: "Track your location and share it with your friends and family.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${montserrat.variable} ${montserrat.variable} antialiased`}
      >
        <Toaster />

        {children}
      </body>
    </html>
  );
}
