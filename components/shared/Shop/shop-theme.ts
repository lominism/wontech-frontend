import { Cormorant_Garamond } from "next/font/google";

export const shopSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-shop-serif",
});

export const shopTheme = {
  bg: "#FAF7F2",
  bgAlt: "#F3EDE4",
  text: "#2A2A2A",
  textMuted: "#6B6560",
  accent: "#3D5A4C",
  accentHover: "#2F4839",
  border: "#E8DFD4",
  cream: "#FFFCF8",
} as const;

/** Shared field styles for public shop forms (overrides global orange focus ring). */
export const shopInputClass =
  "w-full h-11 rounded-none border border-[#E8DFD4] bg-[#FAF7F2] px-3 text-base text-[#2A2A2A] outline-none placeholder:text-[#6B6560] focus-visible:border-[#3D5A4C] focus-visible:ring-2 focus-visible:ring-[#3D5A4C]/20";
