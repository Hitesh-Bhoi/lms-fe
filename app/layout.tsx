import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { AxiosInterceptor } from "@/intercepters/AxiosInterceptor";
import "./globals.css";

interface LayoutProps {
  children: React.ReactNode;
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Leads management system",
  description: "Leads management system",
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AxiosInterceptor>
          <AppLayoutWrapper>{children}</AppLayoutWrapper>
        </AxiosInterceptor>
      </body>
    </html>
  );
}
