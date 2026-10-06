import { ShopCheckoutPage } from "@/components/shared/Shop/ShopCheckoutPage";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function StorefrontCheckoutPage({ params }: PageProps) {
  const { productId } = await params;
  return <ShopCheckoutPage productId={productId} partner="storefront" />;
}
