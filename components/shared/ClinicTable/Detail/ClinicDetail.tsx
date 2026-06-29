"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useClinic } from "@/lib/queries/useClinic";
import { useClinics } from "@/lib/queries/useClinics";
import {
  getClinicBranches,
  mockCreditUsageHistory,
} from "@/lib/mock-data";
import { ClinicInfoCard } from "./ClinicInfoCard";
import { ClinicFinancialCard } from "./ClinicFinancialCard";
import { CreditUsageHistoryTable } from "./CreditUsageHistoryTable";
import { CopyShopLink } from "@/components/shared/Shop/CopyShopLink";
import { useProducts } from "@/lib/queries/useProducts";

type Props = {
  clinicId: string;
};

export function ClinicDetail({ clinicId }: Props) {
  const t = useTranslations("clinic.detail");
  const { user, loading: authLoading } = useAuth();
  const {
    data: clinic,
    isLoading,
    isError,
    refetch,
  } = useClinic(clinicId, {
    enabled: !authLoading && !!user,
  });
  const { data: allClinics = [] } = useClinics({
    enabled: !authLoading && !!user,
  });
  const { data: allProducts = [] } = useProducts({
    enabled: !authLoading && !!user,
  });

  const { parent, branches } = useMemo(() => {
    if (!clinic) return { parent: null, branches: [] };

    const parentClinic = clinic.parentId
      ? allClinics.find((c) => c.id === clinic.parentId) ?? null
      : null;

    return {
      parent: parentClinic,
      branches: parentClinic ? getClinicBranches(clinic, allClinics) : [],
    };
  }, [clinic, allClinics]);

  const history = mockCreditUsageHistory.filter((r) => r.clinicId === clinicId);

  if (authLoading || isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (isError || !clinic) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/clinic"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          {t("backToClinics")}
        </Link>
        <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-card text-destructive">
          <p className="text-sm">{t("notFound")}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline underline-offset-4"
          >
            {t("retry")}
          </button>
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

      <CopyShopLink clinicId={clinicId} products={allProducts} />

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
