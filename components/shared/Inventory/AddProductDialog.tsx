"use client";

import { ProductFormDialog } from "./ProductFormDialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddProductDialog({ open, onOpenChange }: Props) {
  return (
    <ProductFormDialog open={open} onOpenChange={onOpenChange} />
  );
}
