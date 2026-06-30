"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LOGISTICS_FILTER_STATUSES } from "@/lib/api/logistics";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
};

export function LogisticsToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  const t = useTranslations("logistics.actions");
  const tFilter = useTranslations("logistics.filter");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={15}
        />
        <Input
          placeholder={t("search")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder={t("statusFilter")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("activeStatuses")}</SelectItem>
          {LOGISTICS_FILTER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {tFilter(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
