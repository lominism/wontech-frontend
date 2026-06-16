"use client";

import { useTranslations } from "next-intl";
import { Download, Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { orderStatuses } from "@/lib/mock-data";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
};

export function OrdersToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: Props) {
  const t = useTranslations("orders.actions");
  const tStatus = useTranslations("orders.status");

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
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t("statusFilter")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatuses")}</SelectItem>
          {orderStatuses.map((s) => (
            <SelectItem key={s} value={s}>
              {tStatus(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="secondary" className="shrink-0">
          <Download size={16} />
          {t("exportCsv")}
        </Button>
        <Button className="shrink-0">
          <Plus size={16} />
          {t("newOrder")}
        </Button>
      </div>
    </div>
  );
}
