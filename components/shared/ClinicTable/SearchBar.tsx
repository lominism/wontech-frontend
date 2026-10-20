"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import {
  CLINIC_LIST_FILTERS,
  type ClinicListFilter,
} from "@/lib/api/clinics";

type Props = {
  value: string;
  onChange: (value: string) => void;
  filter: ClinicListFilter;
  onFilterChange: (value: ClinicListFilter) => void;
  onAdd: () => void;
};

export function SearchBar({
  value,
  onChange,
  filter,
  onFilterChange,
  onAdd,
}: Props) {
  const t = useTranslations("clinic.actions");
  const tFilter = useTranslations("clinic.filter");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] max-w-sm flex-1">
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

      <Select
        value={filter}
        onValueChange={(next) => onFilterChange(next as ClinicListFilter)}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder={t("filter")} />
        </SelectTrigger>
        <SelectContent>
          {CLINIC_LIST_FILTERS.map((option) => (
            <SelectItem key={option} value={option}>
              {tFilter(option)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        <Button
          type="button"
          onClick={onAdd}
          className="shrink-0 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
        >
          <Plus size={16} />
          {t("addClinic")}
        </Button>
      </div>
    </div>
  );
}
