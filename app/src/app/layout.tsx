import type { Metadata } from "next";
import { Ojuju, Questrial } from "next/font/google";
import NavigationWrapper from "@/components/NavigationWrapper";
import "./globals.css";

const ojuju = Ojuju({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ojuju",
  display: "swap",
});

const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-questrial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Umulkheiri Jalo — Ikigai Alignment Coaching",
  description:
    "Certified Ikigai Alignment Coach blending Japanese purpose philosophy, Ubuntu belonging, and Kihooto justice into your transformation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ojuju.variable} ${questrial.variable}`}>
      <body className="min-h-screen flex flex-col">
        <NavigationWrapper>
          <main className="flex-1">{children}</main>
        </NavigationWrapper>
      </body>
    </html>
  );
}
