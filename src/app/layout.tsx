import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { Toaster } from "react-hot-toast";
import OfflineDetector from "@/components/OfflineDetector";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Supermercado - Sistema de Gerenciamento",
  description: "Sistema de gerenciamento de produtos para o Supermercado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <div className="flex-grow">
          {children} <Toaster position="top-right" />
          <OfflineDetector children={undefined} />
        </div>
        <footer className="bg-[var(--blue)] text-white py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p>
              © {new Date().getFullYear()} Supermercado - Todos os direitos
              reservados
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
