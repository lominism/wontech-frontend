import { shopSerif } from "@/components/shared/Shop/shop-theme";
import React from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${shopSerif.variable} min-h-screen bg-[#FAF7F2] text-[#2A2A2A] antialiased`}
    >
      <header className="border-b border-[#E8DFD4] bg-[#FFFCF8]/90 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span
            className="font-[family-name:var(--font-shop-serif)] text-2xl font-medium tracking-wide text-[#3D5A4C]"
            style={{ fontFamily: "var(--font-shop-serif), serif" }}
          >
            Wontech
          </span>
          <span className="hidden text-xs uppercase tracking-[0.25em] text-[#6B6560] sm:block">
            Clinic &amp; Beauty
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {children}
      </main>
      <footer className="border-t border-[#E8DFD4] bg-[#FFFCF8] py-10">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p
            className="text-lg text-[#3D5A4C]"
            style={{ fontFamily: "var(--font-shop-serif), serif" }}
          >
            Wontech
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#6B6560]">
            Thoughtfully sourced for your skin
          </p>
        </div>
      </footer>
    </div>
  );
}
