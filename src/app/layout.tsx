import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/shared/Providers";

export const metadata: Metadata = {
  title: "Nazaraana - High-Stakes Exam Wellness Companion for Indian Students",
  description: "An empathetic emotional wellness platform for students preparing for JEE, NEET, UPSC, and board exams. Talk to BhalAI, track your mood, and write confessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className="font-hind antialiased bg-warm-bg text-warm-text h-full"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
