"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  getClinicBranches,
  mockClinics,
  mockCreditUsageHistory,
} from "@/lib/mock-data";
import { ClinicInfoCard } from "./ClinicInfoCard";
import { ClinicFinancialCard } from "./ClinicFinancialCard";
import { CreditUsageHistoryTable } from "./CreditUsageHistoryTable";

type Props = {
  clinicId: string;
};

export function ClinicDetail({ clinicId }: Props) {
  const t = useTranslations("clinic.detail");

  const clinic = mockClinics.find((c) => c.id === clinicId);

  const { parent, branches } = useMemo(() => {
    if (!clinic) return { parent: null, branches: [] };

    const parentClinic = clinic.parentId
      ? mockClinics.find((c) => c.id === clinic.parentId) ?? null
      : null;

    return {
      parent: parentClinic,
      // Only show the Branches section for branch clinics (i.e. those with a parent).
      branches: parentClinic ? getClinicBranches(clinic) : [],
    };
  }, [clinic]);

  const history = mockCreditUsageHistory.filter((r) => r.clinicId === clinicId);

  if (!clinic) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/clinic"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          {t("backToClinics")}
        </Link>
        <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
          {t("notFound")}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/clinic"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        {t("backToClinics")}
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ClinicInfoCard clinic={clinic} branches={branches} parent={parent} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <ClinicFinancialCard clinic={clinic} />
          <CreditUsageHistoryTable records={history} />
        </div>
      </div>
    </div>
  );
}
