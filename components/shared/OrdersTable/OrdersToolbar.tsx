"use client";

import { useTranslations } from "next-intl";
import { Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_FILTER_STATUSES } from "@/lib/api/orders";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onNewOrder: () => void;
};

export function OrdersToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onNewOrder,
}: Props) {
  const t = useTranslations("orders.actions");
  const tFilter = useTranslations("orders.filter");

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
          {ORDER_FILTER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {tFilter(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="ml-auto flex items-center gap-2">
        <Button className="shrink-0" onClick={onNewOrder}>
          <Plus size={16} />
          {t("newOrder")}
        </Button>
      </div>
    </div>
  );
}
