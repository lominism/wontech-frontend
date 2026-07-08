"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildQrFilename,
  downloadQrPng,
  downloadQrSvg,
  generateQrSvg,
} from "@/lib/qr-code";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  clinicName: string;
  productId: string;
  productName: string;
};

export function QrPreviewDialog({
  open,
  onOpenChange,
  url,
  clinicName,
  productId,
  productName,
}: Props) {
  const t = useTranslations("shop.link");
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState<"svg" | "png" | null>(null);

  useEffect(() => {
    if (!open) {
      setSvgMarkup(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void generateQrSvg(url)
      .then((svg) => {
        if (!cancelled) setSvgMarkup(svg);
      })
      .catch(() => {
        if (!cancelled) toast.error(t("qrDownloadFailed"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, url, t]);

  const handleDownloadSvg = async () => {
    setDownloading("svg");
    try {
      await downloadQrSvg(
        url,
        buildQrFilename(clinicName, productId, "svg")
      );
    } catch {
      toast.error(t("qrDownloadFailed"));
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadPng = async () => {
    setDownloading("png");
    try {
      await downloadQrPng(
        url,
        buildQrFilename(clinicName, productId, "png")
      );
    } catch {
      toast.error(t("qrDownloadFailed"));
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("qrPreviewTitle")}</DialogTitle>
          <DialogDescription>{t("qrPreviewDescription")}</DialogDescription>
        </DialogHeader>

        <div className="flex w-full min-w-0 flex-col items-center gap-4">
          <div className="w-full space-y-1 text-center">
            <p className="text-sm font-semibold">{clinicName}</p>
            <p className="text-xs text-muted-foreground">{productName}</p>
          </div>

          <div className="flex size-52 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white p-4">
            {loading ? (
              <div className="text-sm text-muted-foreground">
                {t("qrLoading")}
              </div>
            ) : svgMarkup ? (
              <div
                className="flex size-full items-center justify-center overflow-hidden [&_svg]:h-auto [&_svg]:max-h-full [&_svg]:w-auto [&_svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            ) : null}
          </div>
        </div>

        <DialogFooter className="w-full min-w-0 flex-row gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={!svgMarkup || downloading !== null}
            onClick={() => void handleDownloadSvg()}
          >
            {downloading === "svg" ? t("qrDownloading") : t("downloadSvg")}
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={!svgMarkup || downloading !== null}
            onClick={() => void handleDownloadPng()}
          >
            {downloading === "png" ? t("qrDownloading") : t("downloadPng")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
