// Stock level past which a product is considered fully stocked (drives the bar fill).
export const STOCK_TARGET = 100;
// At or below this count a product is flagged as low stock.
export const LOW_STOCK_THRESHOLD = 10;

export type StockStatus = "out" | "low" | "in";

export function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function getStockPercent(stock: number): number {
  return Math.min(100, Math.round((stock / STOCK_TARGET) * 100));
}

export const stockBarColor: Record<StockStatus, string> = {
  out: "bg-red-500",
  low: "bg-amber-500",
  in: "bg-green-500",
};

export const stockTextColor: Record<StockStatus, string> = {
  out: "text-red-600",
  low: "text-amber-600",
  in: "text-green-600",
};
