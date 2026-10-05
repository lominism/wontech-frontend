import { Suspense } from "react";
import { ShopCheckoutPage } from "@/components/shared/Shop/ShopCheckoutPage";

type PageProps = {
  params: Promise<{ influencerId: string; productId: string }>;
};

export default async function InfluencerShopCheckoutRoute({
  params,
}: PageProps) {
  const { influencerId, productId } = await params;
  return (
    <Suspense>
      <ShopCheckoutPage
        clinicId={influencerId}
        productId={productId}
        partner="influencer"
      />
    </Suspense>
  );
}
