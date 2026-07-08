import QRCode from "qrcode";

const QR_OPTIONS = {
  errorCorrectionLevel: "M" as const,
  margin: 2,
};

export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

export function buildQrFilename(
  clinicName: string,
  productId: string,
  extension: "svg" | "png"
): string {
  const slug = sanitizeFilename(clinicName) || "clinic";
  return `qr-${slug}-${productId}.${extension}`;
}

export async function generateQrSvg(url: string): Promise<string> {
  return QRCode.toString(url, { ...QR_OPTIONS, type: "svg" });
}

export async function generateQrPngDataUrl(
  url: string,
  size = 1024
): Promise<string> {
  return QRCode.toDataURL(url, { ...QR_OPTIONS, width: size });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
}

export async function downloadQrSvg(
  url: string,
  filename: string
): Promise<void> {
  const svg = await generateQrSvg(url);
  const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  downloadBlob(blob, filename);
}

export async function downloadQrPng(
  url: string,
  filename: string,
  size = 1024
): Promise<void> {
  const dataUrl = await generateQrPngDataUrl(url, size);
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  downloadBlob(blob, filename);
}
