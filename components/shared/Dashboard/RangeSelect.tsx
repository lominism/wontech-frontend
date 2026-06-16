"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  dashboardRangeOptions,
  type DashboardRange,
} from "@/lib/mock-data";

type Props = {
  value: DashboardRange;
  onChange: (value: DashboardRange) => void;
};

export function RangeSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DashboardRange)}>
      <SelectTrigger className="h-7 w-auto gap-1 border-none bg-muted px-2 text-xs shadow-none focus:ring-0">

        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {dashboardRangeOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className="text-xs"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
