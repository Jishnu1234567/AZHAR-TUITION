import type { Metadata } from "next";
import "./globals.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { Roboto } from "next/font/google";
import FloatingWhatsApp from "../components/FloatingWhatsApp";

const roboto = Roboto({ subsets: ["latin"], weight: ["100", "300", "400"] });

export const metadata: Metadata = {
  title: "Azhar's Tuition",
  description: "Expert guidance for academic excellence in Kerala",
  icons: {
    icon: "/images/logo-azhar.png",
    apple: "/images/logo-azhar.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}