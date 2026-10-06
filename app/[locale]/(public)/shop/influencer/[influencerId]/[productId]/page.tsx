import { ShopProductPage } from "@/components/shared/Shop/ShopProductPage";

type PageProps = {
  params: Promise<{ influencerId: string; productId: string }>;
};

export default async function InfluencerShopPage({ params }: PageProps) {
  const { influencerId, productId } = await params;
  return (
    <ShopProductPage
      clinicId={influencerId}
      productId={productId}
      partner="influencer"
    />
  );
}
