import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Configuração da fonte moderna e minimalista
const outfit = Outfit({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Cinco Filmes",
  description: "Prove seu conhecimento cinematográfico com estilo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${outfit.variable}`}>
      {/* O antialiased deixa a fonte mais suave e nítida em telas modernas */}
      <body className={`${outfit.className} antialiased bg-[#050505] text-slate-200`}>
        {children}
      </body>
    </html>
  );
}