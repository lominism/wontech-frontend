"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { uploadProductImage } from "@/lib/api/uploads";
import { MAX_PRODUCT_IMAGES } from "@/lib/product-images";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
};

export function ProductImagesUpload({ value, onChange, disabled }: Props) {
  const t = useTranslations("inventory.dialog");
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [targetSlot, setTargetSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const slots = Array.from({ length: MAX_PRODUCT_IMAGES }, (_, i) => value[i] ?? null);

  const handleFile = async (file: File, slotIndex: number) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError(t("imageInvalidType"));
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(t("imageTooLarge", { max: MAX_SIZE_MB }));
      return;
    }

    setUploadingSlot(slotIndex);
    try {
      const url = await uploadProductImage(file);
      const next = [...value];
      if (slotIndex < next.length) {
        next[slotIndex] = url;
      } else if (slotIndex === next.length) {
        next.push(url);
      }
      onChange(next);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : t("imageUploadFailed")
      );
    } finally {
      setUploadingSlot(null);
      setTargetSlot(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetSlot != null) {
      void handleFile(file, targetSlot);
    }
  };

  const openFilePicker = (slotIndex: number) => {
    setTargetSlot(slotIndex);
    inputRef.current?.click();
  };

  const handleRemove = (slotIndex: number) => {
    const next = value.filter((_, i) => i !== slotIndex);
    onChange(next);
    setError(null);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Label>{t("images")}</Label>
        <p className="text-xs text-muted-foreground">{t("imagesHint")}</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        disabled={disabled || uploadingSlot !== null}
        onChange={handleInputChange}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {slots.map((url, slotIndex) => {
          const slotNumber = slotIndex + 1;
          const isUploading = uploadingSlot === slotIndex;
          const canUploadToSlot =
            !url &&
            slotIndex === value.length &&
            value.length < MAX_PRODUCT_IMAGES;

          return (
            <div
              key={slotIndex}
              className="flex flex-col gap-1.5 rounded-lg border bg-muted/20 p-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">
                  {slotNumber}
                  {slotNumber === 1 && (
                    <span className="ml-1 text-primary">({t("primaryImage")})</span>
                  )}
                </span>
                {url && (
                  <div className="flex items-center gap-0.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      disabled={disabled || isUploading || slotIndex === 0}
                      onClick={() => moveImage(slotIndex, slotIndex - 1)}
                      aria-label={t("moveImageEarlier")}
                    >
                      <ChevronLeft size={14} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-6"
                      disabled={
                        disabled || isUploading || slotIndex === value.length - 1
                      }
                      onClick={() => moveImage(slotIndex, slotIndex + 1)}
                      aria-label={t("moveImageLater")}
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                )}
              </div>

              {url ? (
                <div className="relative aspect-square overflow-hidden rounded-md border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={t("imagePreviewSlot", { slot: slotNumber })}
                    className="h-full w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="absolute right-1 top-1 size-6"
                    disabled={disabled || isUploading}
                    onClick={() => handleRemove(slotIndex)}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={disabled || isUploading || !canUploadToSlot}
                  onClick={() => openFilePicker(slotIndex)}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed border-muted-foreground/25 bg-background/50 text-center transition-colors hover:border-primary/40 hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-50"
                >
                  <ImageIcon className="size-5 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">
                    {isUploading ? t("imageUploading") : t("imageAddSlot")}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
