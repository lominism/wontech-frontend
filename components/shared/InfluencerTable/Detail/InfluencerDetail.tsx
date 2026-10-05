"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { useInfluencer } from "@/lib/queries/useInfluencer";
import { useInfluencersLookup } from "@/lib/queries/useInfluencersLookup";
import { getClinicBranches } from "@/lib/mock-data";
import { useInfluencerCreditLedger } from "@/lib/queries/useInfluencerCreditLedger";
import { InfluencerInfoCard } from "./InfluencerInfoCard";
import { InfluencerFinancialCard } from "./InfluencerFinancialCard";
import { CreditUsageHistoryTable } from "./CreditUsageHistoryTable";
import { CopyShopLink } from "@/components/shared/Shop/CopyShopLink";
import { useProducts } from "@/lib/queries/useProducts";

type Props = {
  influencerId: string;
};

export function InfluencerDetail({ influencerId }: Props) {
  const t = useTranslations("influencer.detail");
  const { user, loading: authLoading } = useAuth();
  const {
    data: influencer,
    isLoading,
    isError,
    refetch,
  } = useInfluencer(influencerId, {
    enabled: !authLoading && !!user,
  });
  const { data: allInfluencers = [] } = useInfluencersLookup({
    enabled: !authLoading && !!user,
  });
  const { data: allProducts = [] } = useProducts({
    enabled: !authLoading && !!user,
  });

  const { parent, branches } = useMemo(() => {
    if (!influencer) return { parent: null, branches: [] };

    const parentInfluencer = influencer.parentId
      ? allInfluencers.find((c) => c.id === influencer.parentId) ?? null
      : null;

    return {
      parent: parentInfluencer,
      branches: parentInfluencer ? getClinicBranches(influencer, allInfluencers) : [],
    };
  }, [influencer, allInfluencers]);

  const { data: history = [], isLoading: historyLoading } = useInfluencerCreditLedger(
    influencerId,
    { enabled: !authLoading && !!user }
  );

  if (authLoading || isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-lg border bg-card text-muted-foreground">
        {t("loading")}
      </div>
    );
  }

  if (isError || !influencer) {
    return (
      <div className="flex flex-col gap-4">
        <Link
          href="/influencer"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          {t("backToInfluencers")}
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
        href="/influencer"
        className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={15} />
        {t("backToInfluencers")}
      </Link>

      <CopyShopLink
        clinicId={influencerId}
        clinicName={influencer.name}
        products={allProducts}
        partner="influencer"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <InfluencerInfoCard influencer={influencer} branches={branches} parent={parent} />
        </div>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <InfluencerFinancialCard influencer={influencer} />
          <CreditUsageHistoryTable
            influencerId={influencerId}
            records={history}
            loading={historyLoading}
          />
        </div>
      </div>
    </div>
  );
}
