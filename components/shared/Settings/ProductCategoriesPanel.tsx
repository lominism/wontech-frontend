"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type ProductCategory } from "@/lib/api/product-categories";
import { useCreateProductCategory } from "@/lib/queries/useCreateProductCategory";
import { useDeleteProductCategory } from "@/lib/queries/useDeleteProductCategory";
import { useProductCategories } from "@/lib/queries/useProductCategories";

export function ProductCategoriesPanel() {
  const t = useTranslations("settings.company");
  const { data: categories = [], isLoading, isError, refetch } =
    useProductCategories();
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateProductCategory();
  const { mutateAsync: deleteCategory, isPending: isDeleting } =
    useDeleteProductCategory();

  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ProductCategory | null>(
    null
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error(t("categoryNameRequired"));
      return;
    }

    try {
      await createCategory(trimmed);
      setName("");
      toast.success(t("categoryAddSuccess"));
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : t("categoryAddFailed")
      );
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCategory(pendingDelete.id);
      toast.success(t("categoryDeleteSuccess"));
      setPendingDelete(null);
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : t("categoryDeleteFailed")
      );
    }
  };

  if (isLoading) {
    return (
      <p className="text-sm text-muted-foreground">{t("categoriesLoading")}</p>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-destructive">{t("categoriesLoadError")}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex max-w-lg flex-col gap-6">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("categoryNamePlaceholder")}
          disabled={isCreating}
          aria-label={t("categoryNamePlaceholder")}
        />
        <Button type="submit" disabled={isCreating}>
          {isCreating ? t("adding") : t("addCategory")}
        </Button>
      </form>

      {categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("categoriesEmpty")}</p>
      ) : (
        <ul className="divide-y rounded-md border">
          {categories.map((category) => (
            <li
              key={category.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <span className="text-sm font-medium">{category.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setPendingDelete(category)}
                aria-label={t("deleteCategory")}
              >
                <Trash2 size={16} />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteCategoryTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteCategoryDescription", {
                name: pendingDelete?.name ?? "",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t("cancel")}
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? t("deleting") : t("confirmDelete")}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
