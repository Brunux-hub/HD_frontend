import type { Metadata } from "next";
import { Geist, Geist_Mono, Alfa_Slab_One } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const alfaSlab = Alfa_Slab_One({
  weight: "400", // Esta fuente usualmente solo tiene peso 400
  subsets: ["latin"],
  variable: "--font-alfa", // Creamos la variable CSS
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistema Web Veterinaria",
  description: "Powered by create NextJS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${alfaSlab.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
