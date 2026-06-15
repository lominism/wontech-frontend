import { AppProvider } from "@/providers";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Noto_Sans, Noto_Sans_Thai } from "next/font/google";
import { Toaster } from "sonner";

const notoSansThai = Noto_Sans_Thai({
  weight: ["400", "700"],
  subsets: ["thai", "latin"],
  variable: "--font-noto-sans-thai",
});

const notoSans = Noto_Sans({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Wontech",
  description: "Wontech Admin Back Office",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  // if (!hasLocale(routing.locales, locale)) {
  //   notFound();
  // }

  return (
    <html lang={locale} data-lang={locale} suppressHydrationWarning>
      <body
        className={`${notoSansThai.variable} ${notoSans.variable} antialiased`}
        suppressHydrationWarning={true}
        style={{ backgroundColor: "var(--fx-bg)" }}
      >
        <NextIntlClientProvider locale={locale}>
          <AppProvider>{children}</AppProvider>
          <Toaster richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
