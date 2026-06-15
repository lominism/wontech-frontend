import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merger — used throughout the app and by shadcn/ui primitives
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Thai Baht currency formatter
export const thbFormatter = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  currencyDisplay: "symbol",
});
