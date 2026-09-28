import type { Metadata } from "next";
import { Yellowtail, Playfair_Display, Poppins } from "next/font/google";
import "./globals.css";

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yellowtail",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Cerâmica da Juju",
  description:
    "Peças artesanais em cerâmica, modeladas e pintadas à mão pela Juju. Pratos, potinhos e objetos de decoração exclusivos para sua casa.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${yellowtail.variable} ${playfair.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
