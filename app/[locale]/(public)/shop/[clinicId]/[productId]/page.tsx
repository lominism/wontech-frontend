import { ShopProductPage } from "@/components/shared/Shop/ShopProductPage";

type PageProps = {
  params: Promise<{ clinicId: string; productId: string }>;
};

export default async function ShopPage({ params }: PageProps) {
  const { clinicId, productId } = await params;
  return <ShopProductPage clinicId={clinicId} productId={productId} />;
}
