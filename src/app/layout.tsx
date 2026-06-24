import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "Mayank Ray | Premium AI Product Manager & Builder Portfolio",
  description: "Mayank Ray's premium Product Management portfolio. Explore GenAI wellness companions, recommendation flow architectures, and product teardowns.",
  keywords: "Product Manager Portfolio, AI Product Manager, Product Builder, Product Case Studies, Product Strategy, PM Portfolio, AI Product Portfolio",
  openGraph: {
    title: "Mayank Ray | Premium AI Product Manager Portfolio",
    description: "Explore GenAI wellness companions, recommendation flow architectures, and product teardowns.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mayank Ray | Premium AI Product Manager Portfolio",
    description: "Explore GenAI wellness companions, recommendation flow architectures, and product teardowns.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className="font-inter antialiased bg-portfolio-bg text-white h-full"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
