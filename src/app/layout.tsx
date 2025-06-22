import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'sonner';
import SiteHeader from "@/app/components/SiteHeader";

export const metadata: Metadata = {
  title: 'Shelf Life',
  description: 'Track your books effortlessly',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SiteHeader />
          <main className="min-h-screen py-6">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}