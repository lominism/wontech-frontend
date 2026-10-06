import { ShopPaymentPage } from "@/components/shared/Shop/ShopPaymentPage";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function StorefrontPaymentPage({ params }: PageProps) {
  const { productId } = await params;
  return <ShopPaymentPage productId={productId} partner="storefront" />;
}
