import { Suspense } from "react";
import { ShopPaymentPage } from "@/components/shared/Shop/ShopPaymentPage";

type PageProps = {
  params: Promise<{ influencerId: string; productId: string }>;
};

export default async function InfluencerShopPaymentRoute({
  params,
}: PageProps) {
  const { influencerId, productId } = await params;
  return (
    <Suspense>
      <ShopPaymentPage
        clinicId={influencerId}
        productId={productId}
        partner="influencer"
      />
    </Suspense>
  );
}
