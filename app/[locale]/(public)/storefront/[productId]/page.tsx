import { ShopProductPage } from "@/components/shared/Shop/ShopProductPage";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function StorefrontProductPage({ params }: PageProps) {
  const { productId } = await params;
  return <ShopProductPage productId={productId} partner="storefront" />;
}
