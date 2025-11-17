import {
  Inter,
  Dancing_Script,
  Noto_Sans_Khmer,
  Bokor,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
  display: "swap",
});

export const notoSansKhmer = Noto_Sans_Khmer({
  subsets: ["khmer"],
  variable: "--font-khmer",
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const bokor = Bokor({
  subsets: ["khmer"],
  variable: "--font-khmer-cursive",
  display: "swap",
  weight: ["400"],
});
