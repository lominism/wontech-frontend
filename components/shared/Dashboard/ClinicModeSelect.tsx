"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { CLINIC_MODES, type ClinicMode } from "@/lib/api/dashboard";

type Props = {
  value: ClinicMode;
  onChange: (value: ClinicMode) => void;
};

export function ClinicModeSelect({ value, onChange }: Props) {
  const t = useTranslations("dashboard.clinicModes");

  return (
    <Select value={value} onValueChange={(v) => onChange(v as ClinicMode)}>
      <SelectTrigger className="h-7 w-auto gap-1 border-none bg-muted px-2 text-xs shadow-none focus:ring-0">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {CLINIC_MODES.map((mode) => (
          <SelectItem key={mode} value={mode} className="text-xs">
            {t(mode)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
