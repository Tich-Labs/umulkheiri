import type { Metadata } from "next";
import { Ojuju, Questrial } from "next/font/google";
import NavigationWrapper from "@/components/NavigationWrapper";
import CookieNotice from "@/components/CookieNotice";
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
  title: {
    default: "Umulkheiri Jalo | Ikigai Alignment Coach",
    template: "%s | Umulkheiri Jalo",
  },
  description:
    "Certified Ikigai Alignment Coach in Nairobi. Umulkheiri Jalo blends Japanese Ikigai philosophy, Ubuntu belonging, and Kihooto justice to help you discover and live your purpose.",
  openGraph: {
    type: "website",
    siteName: "Umulkheiri Jalo",
    title: "Umulkheiri Jalo | Ikigai Alignment Coach",
    description:
      "Align with your purpose through coaching rooted in African wisdom and Japanese Ikigai philosophy.",
    images: [{ url: "/images/Umulkheiri.jpg", width: 1000, height: 750, alt: "Umulkheiri Jalo, Ikigai Alignment Coach" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Umulkheiri Jalo | Ikigai Alignment Coach",
    description: "Align with your purpose through coaching rooted in African wisdom and Japanese Ikigai philosophy.",
    images: ["/images/Umulkheiri.jpg"],
  },
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
        <CookieNotice />
      </body>
    </html>
  );
}
