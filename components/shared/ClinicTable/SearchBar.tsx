"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  onAdd: () => void;
};

export function SearchBar({ value, onChange, onAdd }: Props) {
  const t = useTranslations("clinic.actions");

  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={15}
        />
        <Input
          placeholder={t("search")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Button
        type="button"
        onClick={onAdd}
        className="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shrink-0"
      >
        <Plus size={16} />
        {t("addClinic")}
      </Button>
    </div>
  );
}
